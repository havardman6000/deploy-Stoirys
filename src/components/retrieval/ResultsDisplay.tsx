import React, { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import Button from '../common/Button';
import Card from '../common/Card';
import { RetrievedData } from '../../types';

interface ResultsDisplayProps {
  data: RetrievedData | null;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, isLoading }) => {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isTextLoading, setIsTextLoading] = useState(false);

  // Try to read Blob as text when it might be text content
  useEffect(() => {
    if (!data || !isBlob(data.data)) return;
    
    const { data: content, contentType } = data;
    
    // Only attempt to read as text for octet-stream or undefined content types
    if (contentType === 'application/octet-stream' || !contentType) {
      setIsTextLoading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          // Simple heuristic to detect if content is text
          const isProbablyText = isProbablyTextContent(text);
          
          if (isProbablyText) {
            setTextContent(text);
          } else {
            setTextContent(null);
          }
        } catch (error) {
          console.error('Error reading blob as text:', error);
          setTextContent(null);
        } finally {
          setIsTextLoading(false);
        }
      };
      
      reader.onerror = () => {
        console.error('FileReader error');
        setTextContent(null);
        setIsTextLoading(false);
      };
      
      reader.readAsText(content as Blob);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Simple heuristic to detect if content is likely text
  const isProbablyTextContent = (text: string): boolean => {
    if (!text || text.length === 0) return false;
    
    // Check if the string contains mostly printable ASCII characters
    // This is a simple heuristic that can be improved
    const textSample = text.slice(0, 1000); // Sample the first 1000 chars
    const printableChars = textSample.replace(/[^\x20-\x7E]/g, '').length;
    const ratio = printableChars / textSample.length;
    
    // If more than 85% are printable ASCII, it's probably text
    return ratio > 0.85;
  };

  // Helper function to determine if data is a Blob
  const isBlob = (content: any): boolean => {
    return content instanceof Blob || 
           (typeof content === 'object' && content !== null && typeof content.size === 'number' && typeof content.type === 'string');
  };

  // Generate a direct link to the transaction content
  const getDirectLink = () => {
    if (data.directUrl) return data.directUrl;
    return `https://storage-explorer.irys.xyz/tx/${data.transactionId}`;
  };

  // If we have a directUrl from CORS issues, show a message and direct link
  if (data.directUrl || (data.data === null && data.contentType === null)) {
    return (
      <Card className="mb-4">
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-blue-50 text-blue-700">
            <p className="font-medium mb-2">This content may be available via the Irys Explorer</p>
            <p>Click the button below to try viewing the content on the Irys Explorer.</p>
          </div>
          
          <div className="flex justify-center">
            <a 
              href={getDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <Button variant="primary">
                View on Explorer
              </Button>
            </a>
          </div>
          
          <div className="text-sm text-gray-500 mt-2 font-mono overflow-x-auto">
            Transaction ID: {data.transactionId}
          </div>
        </div>
      </Card>
    );
  }

  const renderContent = () => {
    const { data: content, contentType, tags } = data;
    
    // Check if content is effectively empty or invalid
    const isEmptyContent = !content || 
      (content instanceof Blob && content.size === 0) ||
      (typeof content === 'string' && content.trim() === '');
    
    if (isEmptyContent) {
      return (
        <div className="text-center py-6">
          <div className="p-4 border rounded-md bg-yellow-50 text-yellow-700">
            <p className="font-medium mb-2">⚠️ Content Not Available</p>
            <p>The transaction ID exists but the content cannot be retrieved or is empty.</p>
          </div>
          
          <div className="flex justify-center mt-4">
            <a 
              href={getDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <Button variant="secondary">
                View on Explorer
              </Button>
            </a>
          </div>
        </div>
      );
    }
    
    // Try to get content type from tags if available
    let effectiveContentType = contentType;
    if (tags && tags.length > 0) {
      const contentTypeTag = tags.find(tag => 
        tag.name.toLowerCase() === 'content-type' || 
        tag.name === 'Content-Type'
      );
      if (contentTypeTag && contentTypeTag.value) {
        effectiveContentType = contentTypeTag.value;
        console.log(`Using Content-Type from tags: ${effectiveContentType}`);
      }
    }
    
    // Convert effectiveContentType to lowercase for consistent comparisons
    const lowerContentType = effectiveContentType?.toLowerCase() || '';
    
    // When content type is application/octet-stream but we have text content,
    // override it to text/plain for better display
    if (lowerContentType === 'application/octet-stream' && textContent !== null) {
      effectiveContentType = 'text/plain';
      console.log('Detected text content in application/octet-stream, treating as text/plain');
    }
    
    // If we successfully read the content as text, display it as text
    if (textContent !== null && (lowerContentType === 'application/octet-stream' || !effectiveContentType)) {
      return (
        <div className="space-y-4">
          <div className="h-96 border rounded overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              defaultValue={textContent}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>
          
          {/* Buttons with consistent styling */}
          <div className="flex flex-row justify-end space-x-3 mt-4">
            <a 
              href={URL.createObjectURL(new Blob([textContent], { type: 'text/plain' }))}
              download={`file-${data.transactionId.substring(0, 8)}.txt`}
              className="text-primary hover:underline"
            >
              <Button variant="primary">
                Download File
              </Button>
            </a>
            <a 
              href={getDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <Button variant="secondary">
                View on Explorer
              </Button>
            </a>
          </div>
        </div>
      );
    }
    
    // Handle Blob content
    if (isBlob(content)) {
      // Create URL for the Blob
      const blobUrl = URL.createObjectURL(content);
      
      // Handle based on content type
      if (effectiveContentType.includes('image')) {
        return (
          <div className="flex justify-center">
            <img 
              src={blobUrl} 
              alt="Retrieved content" 
              className="max-h-96 max-w-full object-contain rounded"
              onLoad={() => URL.revokeObjectURL(blobUrl)}
            />
          </div>
        );
      } else if (effectiveContentType.includes('video')) {
        return (
          <div className="flex justify-center">
            <video 
              src={blobUrl} 
              controls 
              className="max-h-96 max-w-full rounded"
              onLoadedData={() => URL.revokeObjectURL(blobUrl)}
            />
          </div>
        );
      } else if (effectiveContentType.includes('audio')) {
        return (
          <div className="flex justify-center">
            <audio 
              src={blobUrl} 
              controls 
              className="w-full"
              onLoadedData={() => URL.revokeObjectURL(blobUrl)}
            />
          </div>
        );
      } else if (isTextLoading) {
        // Show loading indicator while trying to read as text
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
            <p>Analyzing content...</p>
          </div>
        );
      } else {
        // For other blob types, try to show inline with download options as fallback
        return (
          <div className="text-center py-6">
            <p className="text-lg mb-4">This content may not display properly in the browser.</p>
            <div className="flex justify-center space-x-3">
              <a 
                href={blobUrl} 
                download={`file-${data.transactionId.substring(0, 8)}`}
                className="text-primary hover:underline"
              >
                <Button variant="primary">
                  Download File
                </Button>
              </a>
              <a 
                href={getDirectLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                <Button variant="secondary">
                  View on Explorer
                </Button>
              </a>
            </div>
          </div>
        );
      }
    }

    // Handle JSON data
    if (effectiveContentType === 'application/json' || 
        (typeof content === 'string' && content.trim().startsWith('{'))) {
      let jsonValue = content;
      
      // Try to parse string as JSON if it's not already an object
      if (typeof content === 'string') {
        try {
          const parsed = JSON.parse(content);
          jsonValue = JSON.stringify(parsed, null, 2); // Pretty print
        } catch (e) {
          // Continue with the original string if parsing fails
          console.error('Failed to parse JSON', e);
        }
      }
      
      return (
        <div className="space-y-4">
          <div className="h-96 border rounded overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="json"
              defaultValue={typeof jsonValue === 'string' ? jsonValue : JSON.stringify(jsonValue, null, 2)}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>
          
          {/* Buttons with consistent styling */}
          <div className="flex flex-row justify-end space-x-3 mt-4">
            <a 
              href={URL.createObjectURL(new Blob([typeof jsonValue === 'string' ? jsonValue : JSON.stringify(jsonValue, null, 2)], { type: 'application/json' }))}
              download={`file-${data.transactionId.substring(0, 8)}.json`}
              className="text-primary hover:underline"
            >
              <Button variant="primary">
                Download File
              </Button>
            </a>
            <a 
              href={getDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <Button variant="secondary">
                View on Explorer
              </Button>
            </a>
          </div>
        </div>
      );
    }

    // Render plain text content
    if (lowerContentType.includes('text/plain') || lowerContentType.includes('text/html')) {
      return (
        <div className="space-y-4">
          <div className="h-96 border rounded overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              defaultValue={typeof content === 'string' ? content : "Content cannot be displayed directly."}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>
          
          {/* Buttons with consistent styling */}
          <div className="flex flex-row justify-end space-x-3 mt-4">
            <a 
              href={URL.createObjectURL(new Blob([typeof content === 'string' ? content : ""], { type: 'text/plain' }))}
              download={`file-${data.transactionId.substring(0, 8)}.txt`}
              className="text-primary hover:underline"
            >
              <Button variant="primary">
                Download File
              </Button>
            </a>
            <a 
              href={getDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <Button variant="secondary">
                View on Explorer
              </Button>
            </a>
          </div>
        </div>
      );
    }

    // Default - unknown type
    return (
      <div className="text-center py-6">
        <p className="text-lg mb-4">This content type ({effectiveContentType || 'unknown'}) cannot be previewed directly.</p>
        <div className="flex justify-center space-x-3">
          {/* Only show download button if content is available */}
          {content && (
            <a 
              href={URL.createObjectURL(new Blob([content]))} 
              download={`file-${data.transactionId.substring(0, 8)}`}
              className="text-primary hover:underline"
            >
              <Button variant="primary">
                Download File
              </Button>
            </a>
          )}
          <a 
            href={getDirectLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <Button variant="secondary">
              View on Explorer
            </Button>
          </a>
        </div>
        {!content && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            File content may not be available for download.
            Try the Explorer link instead.
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Retrieved Content</h3>
          <div className="text-sm text-gray-500">
            Content type: {data.contentType}
          </div>
        </div>
        
        {renderContent()}
        
        <div className="pt-2 border-t text-sm text-gray-500">
          <p className="overflow-x-auto font-mono">Transaction ID: {data.transactionId}</p>
          {data.tags && data.tags.length > 0 && (
            <div className="mt-1">
              {data.tags.find(tag => tag.name === 'App-Name') && (
                <p>App-Name: {data.tags.find(tag => tag.name === 'App-Name')?.value}</p>
              )}
              {data.tags.find(tag => tag.name.toLowerCase() === 'content-type') && (
                <p>Content-Type: {data.tags.find(tag => tag.name.toLowerCase() === 'content-type')?.value}</p>
              )}
              {data.tags.find(tag => tag.name === 'Network') && (
                <p>Network: {data.tags.find(tag => tag.name === 'Network')?.value}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay; 
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIrys } from '../../hooks/useIrys';
import Card from '../common/Card';
import Button from '../common/Button';
import { addHistoryItem } from '../../services/historyService';

// Icons
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const RetrievalTab = () => {
  const { retrieveData } = useIrys();
  const [transactionId, setTransactionId] = useState('');
  const [retrievedData, setRetrievedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataType, setDataType] = useState('');
  const [fileName, setFileName] = useState('');
  const location = useLocation();

  // Check for transaction ID in URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txId = params.get('tx');
    
    if (txId) {
      setTransactionId(txId);
      handleRetrieve(txId);
    }
  }, [location.search]);

  // Handle data retrieval
  const handleRetrieve = async (id: string = transactionId) => {
    if (!id) {
      setError('Please enter a transaction ID');
      return;
    }

    // Clean the transaction ID - remove any potential object references or formatting issues
    const cleanId = id.toString().trim().replace(/[\[\]{}"\s]/g, '');
    
    // If the cleaned ID is '[object Object]' or empty after cleaning, it's invalid
    if (!cleanId || cleanId === 'objectObject') {
      setError('Invalid transaction ID format. Please provide a valid transaction ID.');
      return;
    }

    // Update the input field with the full transaction ID to ensure it's visible to the user
    setTransactionId(cleanId);

    setLoading(true);
    setError('');
    setRetrievedData(null);

    try {
      console.log(`Retrieving data for transaction ID: ${cleanId}`);
      const data = await retrieveData(cleanId);
      
      // If no data returned or data is empty/invalid, show "No results found" message
      if (!data || (!data.data && data.contentType === '')) {
        setError('No results found.');
        return;
      }
      
      // Ensure the full transaction ID is assigned to the retrieved data
      data.transactionId = cleanId;
      
      setRetrievedData(data);
      
      // Update UI with retrieved data - only if we have actual content or content type
      if (data && (data.data || data.contentType)) {
        const contentType = data.contentType || '';
        setDataType(contentType);
        
        // Create a temporary tags array from available data
        // This is a workaround since RetrievedData doesn't have tags property directly
        const tags = [];
        
        // Add content type tag
        if (contentType) {
          tags.push({ name: 'Content-Type', value: contentType });
        }
        
        // Add Transaction ID tag to ensure it's available in the tags
        tags.push({ name: 'Transaction-ID', value: cleanId });
        
        // Determine data type and file name
        let fileName = `File-${cleanId.substring(0, 8)}`;
        setFileName(fileName);
        
        // Add to history
        addHistoryItem({
          id: cleanId, // Ensure the full ID is saved to history
          name: fileName,
          size: typeof data.data === 'object' && data.data instanceof Blob ? data.data.size : 0,
          type: contentType || 'application/octet-stream',
          timestamp: Date.now(),
          tags: tags
        });
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      // Show simple error message regardless of the actual error
      setError('No results found.');
    } finally {
      setLoading(false);
    }
  };

  // Download the retrieved data
  const handleDownload = () => {
    if (!retrievedData || !retrievedData.data) return;

    try {
      // Create object URL for the data
      let blob;
      if (typeof retrievedData.data === 'string') {
        // If data is already a string, convert to blob
        blob = new Blob([retrievedData.data], { type: dataType || 'application/octet-stream' });
      } else {
        // If data is an ArrayBuffer, create blob directly
        blob = new Blob([retrievedData.data], { type: dataType || 'application/octet-stream' });
      }
      const url = URL.createObjectURL(blob);
      
      // Create and click download link
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || `download-${transactionId.substring(0, 8)}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download file');
    }
  };

  // Render content based on data type
  const renderContent = () => {
    if (!retrievedData) return null;
    
    // Check if we have actual data content
    const hasValidData = retrievedData.data !== null && 
                        retrievedData.data !== undefined && 
                        (typeof retrievedData.data === 'string' ? 
                          retrievedData.data.trim().length > 0 : 
                          true);
                          
    if (!hasValidData) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
          <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
            <p className="font-medium">Unable to retrieve content</p>
            <p className="text-sm mt-1">The transaction exists, but the content could not be retrieved.</p>
          </div>
          <a 
            href={`https://storage-explorer.irys.xyz/tx/${retrievedData.transactionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2"
          >
            <Button 
              variant="secondary"
              size="sm"
            >
              View on Explorer
            </Button>
          </a>
        </div>
      );
    }
    
    const dataType = retrievedData.contentType || '';
    
    // Handle Blob and ArrayBuffer differently
    if (dataType.startsWith('image/')) {
      // For images
      let blob;
      if (retrievedData.data instanceof Blob) {
        blob = retrievedData.data;
      } else if (typeof retrievedData.data === 'string') {
        blob = new Blob([retrievedData.data], { type: dataType });
      } else {
        blob = new Blob([retrievedData.data], { type: dataType });
      }
      
      return (
        <div className="flex justify-center">
          <img 
            src={URL.createObjectURL(blob)} 
            alt="Retrieved content" 
            className="max-h-96 max-w-full object-contain rounded"
          />
        </div>
      );
    } else if (dataType.startsWith('text/') || dataType.includes('json')) {
      // For text - handle both string and Blob formats
      let text;
      if (typeof retrievedData.data === 'string') {
        // If data is already a string, use it directly
        text = retrievedData.data;
      } else if (retrievedData.data instanceof Blob) {
        // If data is a Blob, create a message indicating we need to use the direct link
        text = "[Content is a Blob and needs to be viewed via the direct link below]";
        
        // We'll add a directUrl if it doesn't exist
        if (!retrievedData.directUrl) {
          retrievedData.directUrl = `https://storage-explorer.irys.xyz/tx/${retrievedData.transactionId}`;
        }
      } else {
        try {
          // Try to convert to string if possible
          text = String(retrievedData.data);
        } catch (error) {
          console.error("Failed to convert data to string:", error);
          text = "[Unable to display content - please use the direct link below]";
        }
      }
      
      return (
        <div className="p-4 bg-slate-50 rounded-lg overflow-auto max-h-96">
          <pre className="text-sm text-text-primary whitespace-pre-wrap break-words font-mono">
            {text}
          </pre>
          
          {/* Add a direct link to view the content if we couldn't process it */}
          {(retrievedData.data instanceof Blob) && (
            <div className="mt-4 flex justify-center">
              <a 
                href={retrievedData.directUrl || `https://storage-explorer.irys.xyz/tx/${retrievedData.transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                View Content on Irys Explorer
              </a>
            </div>
          )}
        </div>
      );
    } else if (dataType.startsWith('video/')) {
      // For videos
      let blob;
      if (typeof retrievedData.data === 'string') {
        // If data is already a string, convert to blob
        blob = new Blob([retrievedData.data], { type: dataType });
      } else {
        // If data is an ArrayBuffer, create blob directly
        blob = new Blob([retrievedData.data], { type: dataType });
      }
      const url = URL.createObjectURL(blob);
      return (
        <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
          <video 
            controls 
            className="max-w-full max-h-96 rounded"
            onLoadedData={() => URL.revokeObjectURL(url)}
          >
            <source src={url} type={dataType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (dataType.startsWith('audio/')) {
      // For audio
      let blob;
      if (typeof retrievedData.data === 'string') {
        // If data is already a string, convert to blob
        blob = new Blob([retrievedData.data], { type: dataType });
      } else {
        // If data is an ArrayBuffer, create blob directly
        blob = new Blob([retrievedData.data], { type: dataType });
      }
      const url = URL.createObjectURL(blob);
      return (
        <div className="p-4 bg-slate-50 rounded-lg">
          <audio 
            controls 
            className="w-full"
            onLoadedData={() => URL.revokeObjectURL(url)}
          >
            <source src={url} type={dataType} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else {
      // For other types, show a generic file icon
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <DocumentIcon />
          </div>
          <p className="text-sm font-medium mb-1">{fileName || `File (${dataType || 'Unknown type'})`}</p>
          <p className="text-xs text-text-secondary mb-3">
            {retrievedData.data ? 
              typeof retrievedData.data === 'string' 
                ? `${(retrievedData.data.length / 1024).toFixed(2)} KB`
                : `${(retrievedData.data.byteLength / 1024).toFixed(2)} KB` 
              : 'Unknown size'}
          </p>
          <Button 
            onClick={handleDownload}
            variant="secondary"
            size="sm"
          >
            Download File
          </Button>
        </div>
      );
    }
  };

  // Show tags from the retrieved data
  const renderTags = () => {
    // Type safety check - add fallback if tags don't exist on retrievedData
    // This addresses the error "Property 'tags' does not exist on type 'RetrievedData'"
    const hasTags = retrievedData && 
                   'tags' in retrievedData && 
                   Array.isArray((retrievedData as any).tags) && 
                   (retrievedData as any).tags.length > 0;
    
    if (!hasTags) {
      // If no tags available, show basic info about the content
      if (retrievedData) {
        const basicInfo = [
          { name: 'Content-Type', value: retrievedData.contentType || 'Unknown' },
          { name: 'Transaction ID', value: retrievedData.transactionId || transactionId },
          { name: 'Network', value: 'IRYS Testnet' }
        ];
        
        return (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Content Information</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="grid gap-2">
                {basicInfo.map((info, index) => (
                  <div key={index} className="flex items-center bg-white rounded p-2 text-sm">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                      {info.name}
                    </span>
                    <span className="ml-2 text-text-secondary truncate">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      return null;
    }

    // If we have tags, render them
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">File Tags</h3>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="grid gap-2">
            {(retrievedData as any).tags.map((tag: {name: string, value: string}, index: number) => (
              <div key={index} className="flex items-center bg-white rounded p-2 text-sm">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  {tag.name}
                </span>
                <span className="ml-2 text-text-secondary truncate">
                  {tag.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Retrieving from IRYS Testnet</h3>
        <p className="text-sm text-blue-700">
          You can retrieve any content that was uploaded to Irys on the IRYS testnet.
          Just enter the transaction ID to access your content.
        </p>
      </div>

      <Card title="Retrieve Data" className="bg-white">
        <div className="space-y-4">
          {/* Transaction ID input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <Button 
              onClick={() => handleRetrieve()} 
              disabled={!transactionId || loading}
              isLoading={loading}
              className="whitespace-nowrap"
            >
              Retrieve
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 text-center">
              {error === 'No results found.' ? (
                <div className="text-gray-600">No results found.</div>
              ) : (
                <div className="p-3 bg-red-50 text-red-800 rounded text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Retrieved content */}
          {retrievedData && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium mb-2">Retrieved Content</h3>
              {renderContent()}
              
              {/* Always show download button */}
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleDownload}
                  variant="primary"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download File</span>
                </Button>
              </div>
              
              {renderTags()}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RetrievalTab; 
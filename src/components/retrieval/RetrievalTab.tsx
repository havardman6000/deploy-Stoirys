import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIrys } from '../../hooks/useIrys';
import Card from '../common/Card';
import Button from '../common/Button';
import { addHistoryItem } from '../../services/historyService';
import { FaSpinner, FaCopy, FaTimes, FaFile, FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Icons
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

interface SearchIconProps {
  className?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 text-text-secondary"} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const RetrievalTab = () => {
  const { retrieveData } = useIrys();
  const [transactionId, setTransactionId] = useState('');
  const [retrievedData, setRetrievedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataType, setDataType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const location = useLocation();
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Check for transaction ID in URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let txId = params.get('tx');
    
    console.log("Transaction ID from URL:", txId, "Type:", typeof txId);
    
    if (txId) {
      // Clean the transaction ID in case it's in object format
      if (txId.includes('object Object') || txId.startsWith('[object')) {
        console.warn("Detected object notation in transaction ID from URL, attempting to fix");
        // This could be a case where an object was stringified incorrectly
        try {
          // Try to parse it as JSON in case it's a valid stringified object
          const parsed = JSON.parse(txId);
          if (parsed && typeof parsed === 'object' && 'id' in parsed) {
            txId = String(parsed.id);
          } else if (parsed && typeof parsed === 'object' && 'transactionId' in parsed) {
            txId = String(parsed.transactionId);
          }
        } catch (e) {
          // If parsing fails, try to extract a valid ID format (43 characters for Irys transactions)
          const matches = txId.match(/[a-zA-Z0-9_-]{43}/);
          if (matches && matches.length > 0) {
            txId = matches[0];
          }
        }
      }
      
      setTransactionId(txId);
      handleRetrieve(txId);
    }
  }, [location.search]);

  // Clean up any created object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Create object URL for blob data when retrievedData changes
  useEffect(() => {
    if (retrievedData && retrievedData.data instanceof Blob) {
      // Revoke previous URL if it exists
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      // Create new URL for the blob
      const url = URL.createObjectURL(retrievedData.data);
      setImageUrl(url);
      console.log("Created object URL for blob:", url);
    } else if (retrievedData && retrievedData.data instanceof ArrayBuffer) {
      // Convert ArrayBuffer to Blob with correct content type
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      
      const blob = new Blob([retrievedData.data], { type: retrievedData.contentType });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      console.log("Created object URL from ArrayBuffer:", url);
    }
  }, [retrievedData]);

  // Update the handleTransactionIdChange function to better handle objects
  const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure we always store a string value
    const value = e.target.value;
    
    console.log("New transaction ID input:", value, "Type:", typeof value);
    
    if (typeof value === 'object') {
      console.warn('Received object instead of string for transaction ID input:', value);
      // Try to extract id or convert to string representation
      if (value === null) {
        setTransactionId("");
      } else {
        // Use type assertion to handle the object properly
        const objValue = value as any;
        
        if (objValue && typeof objValue === 'object' && 'id' in objValue) {
          setTransactionId(String(objValue.id));
        } else if (objValue && typeof objValue === 'object' && 'transactionId' in objValue) {
          setTransactionId(String(objValue.transactionId));
        } else {
          setTransactionId(String(value));
        }
      }
    } else {
      setTransactionId(value);
    }
  };

  // Handle data retrieval
  const handleRetrieve = async (id: string = transactionId) => {
    if (!id || !id.trim()) {
      setError('Please enter a transaction ID');
      return;
    }

    console.log('Original transaction ID input:', id, 'Type:', typeof id);

    // Enhanced transaction ID cleaning
    let cleanId: string;
    
    if (typeof id === 'object') {
      console.warn('Received object for transaction ID, attempting to extract ID');
      // Try to extract ID from object
      if (id && 'id' in id) {
        cleanId = String((id as any).id);
      } else if (id && 'transactionId' in id) {
        cleanId = String((id as any).transactionId);
      } else {
        cleanId = String(id).replace(/\[object Object\]/g, '');
      }
    } else {
      cleanId = String(id);
    }
    
    // Remove any unwanted characters
    cleanId = cleanId.trim().replace(/[\[\]{}"\s]/g, '');
    
    console.log('Cleaned transaction ID:', cleanId);
    
    // Validate the cleaned ID
    if (!cleanId || cleanId === 'objectObject' || cleanId === '[object Object]') {
      setError('Invalid transaction ID format. Please provide a valid transaction ID.');
      return;
    }

    // Update the input field with the clean ID
    setTransactionId(cleanId);
    
    setLoading(true);
    setError('');
    setRetrievedData(null);

    try {
      console.log(`Retrieving data for transaction ID: ${cleanId}`);
      
      // Get the data
      const data = await retrieveData(cleanId);
      console.log("Retrieved data:", data);
      
      // If no data returned or data is empty/invalid, show "No results found" message
      if (!data || (!data.data && data.contentType === '')) {
        setError('No results found.');
        return;
      }
      
      // Ensure the full transaction ID is assigned to the retrieved data
      data.transactionId = cleanId;
      
      // Make sure tags array exists
      if (!data.tags) {
        data.tags = [];
      }
      
      // Add any missing standard tags if they're not already present
      const hasContentType = data.tags.some(tag => tag.name === 'Content-Type');
      if (!hasContentType && data.contentType) {
        data.tags.push({ name: 'Content-Type', value: data.contentType });
      }
      
      const hasTransactionId = data.tags.some(tag => tag.name === 'Transaction-ID');
      if (!hasTransactionId) {
        data.tags.push({ name: 'Transaction-ID', value: cleanId });
      }
      
      // Log all available tags for debugging
      console.log("Available tags:", data.tags);
      
      setRetrievedData(data);
      
      // Update UI with retrieved data
      if (data && (data.data || data.contentType)) {
        const contentType = data.contentType || '';
        setDataType(contentType);
        
        // Determine data type and file name
        let fileName = `File-${cleanId.substring(0, 8)}`;
        
        // Check for filename in tags
        if (data.tags) {
          const nameTag = data.tags.find(tag => 
            tag.name.toLowerCase() === 'filename' || 
            tag.name.toLowerCase() === 'name'
          );
          if (nameTag) {
            fileName = nameTag.value;
          }
        }
        
        setFileName(fileName);
         
        // Add to history
        addHistoryItem({
          id: cleanId,
          name: fileName,
          size: data.size || (typeof data.data === 'object' && data.data instanceof Blob ? data.data.size : 0),
          type: contentType || 'application/octet-stream',
          timestamp: Date.now(),
          tags: data.tags
        });
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
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
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffd5]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-[#1a1b1e] border border-[#3a3b3e] rounded-lg p-6 text-center">
          <div className="text-red-400 mb-2">{error}</div>
          <div className="text-gray-400 text-sm">Please check the transaction ID and try again.</div>
        </div>
      );
    }

    if (retrievedData) {
      return (
        <div className="space-y-6">
          {/* Transaction details card - redesigned */}
          <div className="bg-[#1a1b1e] border border-[#3a3b3e] rounded-lg overflow-hidden">
            <div className="bg-[#2a2b2e] px-4 py-3 border-b border-[#3a3b3e] flex justify-between items-center">
              <h3 className="text-[#00ffd5] font-medium">Transaction Details</h3>
              <button 
                onClick={handleDownload}
                className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black px-3 py-1 rounded-md text-sm flex items-center"
              >
                <FaDownload className="mr-1" size={14} />
                Download
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Transaction ID */}
                <div>
                  <div className="text-gray-400 text-sm mb-1">Transaction ID:</div>
                  <div className="flex items-center bg-[#2a2b2e] p-2 rounded border border-[#3a3b3e]">
                    <div className="text-white font-mono text-sm truncate flex-1">{retrievedData.transactionId}</div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(retrievedData.transactionId);
                        toast.success("Transaction ID copied to clipboard");
                      }}
                      className="ml-2 text-gray-400 hover:text-[#00ffd5] p-1"
                      title="Copy to clipboard"
                    >
                      <FaCopy size={14} />
                    </button>
                  </div>
                </div>

                {/* File info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Content Type */}
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Content Type:</div>
                    <div className="bg-[#2a2b2e] p-2 rounded border border-[#3a3b3e] text-white">
                      {retrievedData.contentType || 'Unknown'}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Size:</div>
                    <div className="bg-[#2a2b2e] p-2 rounded border border-[#3a3b3e] text-white">
                      {retrievedData.size
                        ? formatBytes(retrievedData.size)
                        : retrievedData.data && typeof retrievedData.data.byteLength !== 'undefined' 
                          ? formatBytes(retrievedData.data.byteLength)
                          : retrievedData.data && typeof retrievedData.data.length !== 'undefined'
                            ? formatBytes(retrievedData.data.length)
                            : 'Unknown'
                      }
                    </div>
                  </div>
                </div>

                {/* Metadata tags */}
                <div>
                  <div className="text-gray-400 text-sm mb-2">Metadata Tags:</div>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Always add App-Name: Stoirys at the top */}
                    <div className="bg-[#2a2b2e] p-2 rounded border border-[#3a3b3e] flex justify-between">
                      <span className="text-[#00ffd5] text-sm">App-Name:</span>
                      <span className="text-white text-sm truncate max-w-[70%] text-right">Stoirys</span>
                    </div>
                    
                    {retrievedData.tags && retrievedData.tags.length > 0 ? (
                      (() => {
                        // Create a filtered and deduplicated tag array
                        const uniqueTags: { name: string; value: string }[] = [];
                        const seenTagNames = new Set<string>();
                        seenTagNames.add('App-Name'); // We already displayed App-Name
                        
                        retrievedData.tags.forEach((tag: { name: string; value: string }) => {
                          // Skip unwanted tags
                          if (tag.name === 'type') return;
                          if (tag.name === 'App-Name') return; // Skip as we've already shown it
                          
                          // For Content-Type, only keep the first one
                          if (tag.name === 'Content-Type' && seenTagNames.has('Content-Type')) return;
                          
                          // Keep only the first occurrence of each tag name
                          if (!seenTagNames.has(tag.name)) {
                            seenTagNames.add(tag.name);
                            uniqueTags.push(tag);
                          }
                        });
                        
                        // Render the filtered tags
                        return uniqueTags.map((tag, index) => (
                          <div key={index} className="bg-[#2a2b2e] p-2 rounded border border-[#3a3b3e] flex justify-between">
                            <span className="text-[#00ffd5] text-sm">{tag.name}:</span>
                            <span className="text-white text-sm truncate max-w-[70%] text-right">{tag.value}</span>
                          </div>
                        ));
                      })()
                    ) : (
                      <>
                        {/* Add key additional metadata when no other tags are present */}
                        <div className="bg-[#2a2b2e] p-2 rounded border border-[#3a3b3e] flex justify-between">
                          <span className="text-[#00ffd5] text-sm">Content-Type:</span>
                          <span className="text-white text-sm truncate max-w-[70%] text-right">{retrievedData.contentType || 'Unknown'}</span>
                        </div>
                        <div className="bg-[#2a2b2e] p-2 rounded border border-[#3a3b3e] flex justify-between">
                          <span className="text-[#00ffd5] text-sm">Transaction-ID:</span>
                          <span className="text-white text-sm truncate max-w-[70%] text-right">{retrievedData.transactionId}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File content preview */}
          <div className="bg-[#1a1b1e] border border-[#3a3b3e] rounded-lg overflow-hidden">
            <div className="bg-[#2a2b2e] px-4 py-3 border-b border-[#3a3b3e]">
              <h3 className="text-[#00ffd5] font-medium">Content Preview</h3>
            </div>
            
            <div className="p-4">
              {dataType.includes('image/') ? (
                <div className="flex justify-center">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Retrieved content" 
                      className="max-w-full max-h-[500px] object-contain rounded"
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        e.currentTarget.outerHTML = '<div class="text-gray-400">Error loading image. Format may be unsupported.</div>';
                      }}
                    />
                  ) : retrievedData.data instanceof Blob ? (
                    <img 
                      src={URL.createObjectURL(retrievedData.data)} 
                      alt="Retrieved content" 
                      className="max-w-full max-h-[500px] object-contain rounded"
                    />
                  ) : typeof retrievedData.data === 'string' ? (
                    <img 
                      src={retrievedData.data} 
                      alt="Retrieved content" 
                      className="max-w-full max-h-[500px] object-contain rounded"
                    />
                  ) : (
                    <div className="text-gray-400">Unable to display image</div>
                  )}
                </div>
              ) : dataType.includes('video/') ? (
                <div className="flex justify-center">
                  <video 
                    controls 
                    className="max-w-full max-h-[500px] rounded"
                    src={typeof retrievedData.data === 'string' ? retrievedData.data : ''}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : dataType.includes('audio/') ? (
                <div className="flex justify-center">
                  <audio 
                    controls 
                    className="w-full"
                    src={typeof retrievedData.data === 'string' ? retrievedData.data : ''}
                  >
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              ) : dataType.includes('application/pdf') ? (
                <div className="flex justify-center">
                  <iframe 
                    src={typeof retrievedData.data === 'string' ? retrievedData.data : ''} 
                    className="w-full h-[500px] rounded border border-[#3a3b3e]"
                    title="PDF Preview"
                  ></iframe>
                </div>
              ) : (
                <div className="bg-white text-black p-4 rounded-lg overflow-auto max-h-[500px]">
                  <pre className="whitespace-pre-wrap break-words">
                    {typeof retrievedData.data === 'string' ? retrievedData.data : 'Cannot display content'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#1a1b1e] border border-[#3a3b3e] rounded-lg p-6 text-center">
        <div className="text-gray-400">Enter a transaction ID to retrieve data</div>
      </div>
    );
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
          { name: 'name', value: retrievedData.fileName || 'Unnamed File' },
          { name: 'App-Name', value: 'Stoirys' },
          { name: 'Transaction-ID', value: retrievedData.transactionId || transactionId }
        ];
        
        return (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2 text-[#00ffd5]">Metadata Tags:</h3>
            <div className="bg-[#1a1b1e] p-4 rounded-lg border border-[#3a3b3e]">
              <div className="grid gap-2">
                {basicInfo.map((info, index) => (
                  <div key={index} className="flex items-center justify-between p-2 text-sm border-b border-[#3a3b3e] last:border-b-0">
                    <span className="text-[#00ffd5]">
                      {info.name}:
                    </span>
                    <span className="text-gray-300 truncate max-w-[70%] text-right">
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
            {(retrievedData as any).tags.map((tag: { name: string; value: string }, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-[#00ffd5]">{tag.name}:</span>
                <span className="text-white">{tag.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const openPreview = (item: any) => {
    setShowPreview(true);
    setPreviewItem(item);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1b1e] border border-[#3a3b3e] rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-[#00ffd5] mb-2">Retrieving from IRYS Devnet</h3>
        <p className="text-sm text-gray-300">
          You can retrieve any content that was uploaded to Irys on the IRYS Devnet.
          Just enter the transaction ID to access your content.
        </p>
      </div>

      <Card className="bg-[#2a2b2e] border-[#3a3b3e]">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#00ffd5] mb-4">Retrieve Data</h2>
          
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={transactionId}
                onChange={handleTransactionIdChange}
                placeholder="Enter transaction ID"
                className="w-full px-4 py-2 bg-[#1a1b1e] border border-[#3a3b3e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ffd5] text-white placeholder-gray-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <Button
              onClick={() => handleRetrieve()}
              disabled={loading || !transactionId}
              className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black px-4 py-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2 inline" />
                  Retrieving...
                </>
              ) : (
                'Retrieve Data'
              )}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}
        </div>
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="animate-spin text-[#00ffd5] text-3xl mb-4" />
            <p className="text-gray-300">Retrieving data from Irys Network...</p>
          </div>
        )}
        
        {retrievedData && !loading && (
          <div className="space-y-6">
            {renderContent()}
          </div>
        )}
      </Card>

      {/* Preview Popup */}
      {showPreview && previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2b2e] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[#3a3b3e]">
              <h3 className="text-lg font-medium text-[#00ffd5]">
                {previewItem.name || `File-${previewItem.transactionId.substring(0, 8)}`}
              </h3>
              <button 
                onClick={closePreview}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {previewItem.contentType?.startsWith('image/') ? (
                <img 
                  src={`https://gateway.irys.xyz/${previewItem.transactionId}`}
                  alt={previewItem.name} 
                  className="max-w-full max-h-[60vh] mx-auto"
                />
              ) : previewItem.contentType?.startsWith('text/') ? (
                <pre className="bg-[#1a1b1e] p-4 rounded-lg text-gray-300 font-mono text-sm whitespace-pre-wrap">
                  {previewItem.data}
                </pre>
              ) : (
                <div className="text-center p-8">
                  <FaFile className="text-[#00ffd5] text-5xl mx-auto mb-4" />
                  <p className="text-white">This file type cannot be previewed</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center p-4 border-t border-[#3a3b3e] bg-[#1a1b1e]">
              <div className="text-gray-400 text-sm">
                {previewItem.contentType} • {formatBytes(previewItem.size || 0)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewItem.transactionId);
                    alert('Transaction ID copied to clipboard');
                  }}
                  className="text-[#00ffd5] hover:text-[#00e6c0] flex items-center"
                >
                  <FaCopy className="mr-1" size={14} />
                  Copy ID
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetrievalTab; 
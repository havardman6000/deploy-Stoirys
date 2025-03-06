import React, { useEffect, useState, useCallback } from 'react';
import { useIrys } from '../contexts/IrysContext';
import { useWallet } from '../contexts/WalletContext';
import { FaFile, FaFileAlt, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileAudio, FaFileVideo, FaFileCode, FaSearch, FaExternalLinkAlt, FaCopy, FaTrash, FaUpload, FaDownload, FaTimes, FaSpinner, FaSyncAlt } from 'react-icons/fa';
import Card from './common/Card';
import Button from './common/Button';
import { useFirebase } from '../contexts/FirebaseContext';
import { Transaction } from '../contexts/FirebaseContext';
import { getTransactionsIndexUrl, getIndexCreationInstructions } from '../utils/firebaseIndexHelper';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

// Helper function to get icon based on file type
const getFileIcon = (contentType: string) => {
  if (!contentType) return <FaFile className="text-gray-400" />;
  
  if (contentType.includes('image')) return <FaFileImage className="text-[#00ffd5]" />;
  if (contentType.includes('pdf')) return <FaFilePdf className="text-[#00ffd5]" />;
  if (contentType.includes('word') || contentType.includes('document')) return <FaFileWord className="text-[#00ffd5]" />;
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return <FaFileExcel className="text-[#00ffd5]" />;
  if (contentType.includes('audio')) return <FaFileAudio className="text-[#00ffd5]" />;
  if (contentType.includes('video')) return <FaFileVideo className="text-[#00ffd5]" />;
  if (contentType.includes('text') || contentType.includes('json') || contentType.includes('javascript') || contentType.includes('typescript')) {
    return <FaFileCode className="text-[#00ffd5]" />;
  }
  
  return <FaFileAlt className="text-gray-400" />;
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

// Helper function to format date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Helper function to get MIME type from filename
const getMimeType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'zip': 'application/zip',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

// History item type combining both Firebase and localStorage history items
interface HistoryItem {
  id: string;
  type: string;
  timestamp: number;
  size?: number;
  name?: string;
  contentType?: string;
  url?: string;
  status?: string;
}

interface PreviewItem extends HistoryItem {
  data?: string | ArrayBuffer;
}

interface HistoryProps {
  items?: HistoryItem[];
  loading?: boolean;
}

// Tab type
type HistoryTab = 'uploads' | 'retrievals';

const History: React.FC<HistoryProps> = ({ items: propItems, loading: propLoading }) => {
  const { isConnected: isIrysConnected } = useIrys();
  const { isConnected: isWalletConnected, walletAddress } = useWallet();
  const { getTransactions, deleteTransaction, clearTransactions } = useFirebase();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(propLoading || false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<HistoryTab>('uploads');
  const [filter, setFilter] = useState<'all' | 'upload' | 'retrieve'>('all');
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<PreviewItem | null>(null);
  const [indexError, setIndexError] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  
  // Filter items based on search query and active tab
  const filteredItems = historyItems
    .filter(item => {
      // First filter by tab
      if (activeTab === 'uploads' && item.type !== 'upload') return false;
      
      // Then filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name?.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.contentType?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first

  // Load history from Firebase or localStorage
  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    setIndexError(false);
    
    try {
      // Try to load history from Firebase first
      if (getTransactions) {
        try {
          const firebaseItems = await getTransactions();
          console.log('Loaded history from Firebase:', firebaseItems);
          
          if (firebaseItems && firebaseItems.length > 0) {
            // Convert Firebase items to HistoryItem format
            const convertedItems = firebaseItems.map(item => ({
              id: item.transactionId,
              type: item.type,
              timestamp: item.createdAt?.toMillis?.() || item.createdAt?.seconds * 1000 || Date.now(),
              name: item.fileName || '',
              contentType: '', // Not typically stored in Firebase
              size: item.fileSize,
              url: item.fileUrl || '',
              status: item.status
            }));
            
            setHistoryItems(convertedItems);
            setLoading(false);
            return;
          }
        } catch (firebaseError: any) {
          console.error('Error loading from Firebase:', firebaseError);
          
          // Check if this is an index error
          if (firebaseError.message?.includes('index')) {
            setIndexError(true);
          } else {
            setError('Failed to load history from Firebase');
          }
          
          // Fall back to local storage
        }
      }
      
      // Fall back to local storage
      loadHistoryFromStorage();
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Failed to load history');
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadHistory();
  }, [walletAddress]);
  
  // Load history from localStorage
  const loadHistoryFromStorage = () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const storageKey = `irys-history-${walletAddress}`;
      const storedHistory = localStorage.getItem(storageKey);
      
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistoryItems(Array.isArray(parsedHistory) ? parsedHistory : []);
      } else {
        setHistoryItems([]);
      }
    } catch (error: any) {
      console.error("Error loading history:", error);
      setError(`Failed to load history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Navigate to transaction on Irys Explorer
  const viewTransaction = (id: string) => {
    window.open(`https://explorer.irys.xyz/transaction/${id}`, '_blank');
  };
  
  // Copy transaction ID to clipboard
  const copyTransactionId = (id: string) => {
    navigator.clipboard.writeText(id);
    // Could add a toast notification here
  };
  
  // Remove a history item
  const removeHistoryItem = async (id: string) => {
    if (!walletAddress) return;
    
    setLoading(true);
    
    try {
      if (deleteTransaction) {
        // Use Firebase deleteTransaction method
        console.log(`Attempting to delete transaction ${id}`);
        const success = await deleteTransaction(id);
        
        if (success) {
          console.log(`Transaction ${id} deleted successfully`);
        } else {
          console.warn(`Failed to delete transaction ${id} from Firebase`);
        }
      } else {
        console.warn('Firebase deleteTransaction not available');
      }
      
      // Always update local state regardless of Firebase result
      setHistoryItems(prevItems => prevItems.filter(item => item.id !== id));
      
      // For backwards compatibility, update localStorage as well
      if (walletAddress) {
        const storageKey = `irys-history-${walletAddress}`;
        const existingData = localStorage.getItem(storageKey);
        
        if (existingData) {
          try {
            const parsedData = JSON.parse(existingData);
            const updatedData = parsedData.filter((item: any) => item.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
          } catch (e) {
            console.error('Error updating localStorage:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error removing history item:', error);
      setError('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };
  
  // Clear all history
  const clearHistory = async () => {
    if (!walletAddress) return;
    
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      setLoading(true);
      
      try {
        if (clearTransactions) {
          // Use Firebase clearTransactions method
          console.log('Attempting to clear all transactions');
          const success = await clearTransactions();
          
          if (success) {
            console.log('All transactions cleared successfully');
          } else {
            console.warn('Failed to clear transactions from Firebase');
          }
        } else {
          console.warn('Firebase clearTransactions not available');
        }
        
        // Always update local state regardless of Firebase result
        setHistoryItems([]);
        
        // For backwards compatibility, clear localStorage as well
        if (walletAddress) {
          const storageKey = `irys-history-${walletAddress}`;
          localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.error('Error clearing history:', error);
        setError('Failed to clear history');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Count of items by type
  const uploadCount = historyItems.filter(item => item.type === 'upload' || item.type === 'fund').length;
  const retrievalCount = historyItems.filter(item => item.type === 'retrieve').length;
  
  const openPreview = async (item: HistoryItem) => {
    try {
      // Reset image URL when opening a new preview
      setPreviewImageUrl(null);
      
      let data: string | ArrayBuffer | undefined = undefined;
      
      console.log(`Fetching preview for item: ${item.id}, contentType: ${item.contentType}`);
      
      // For all content types, fetch the raw data
      const response = await fetch(`https://gateway.irys.xyz/${item.id}`);
      console.log(`Fetch response status: ${response.status}, ok: ${response.ok}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      // Handle different content types
      if (item.contentType?.startsWith('text/') || 
          item.contentType?.includes('json') || 
          item.contentType?.includes('javascript') || 
          item.contentType?.includes('xml')) {
        // For text content, get as text
        data = await response.text();
        console.log(`Text data fetched, length: ${data.length}`);
      } else if (item.contentType?.startsWith('image/')) {
        // For images, get as blob and create an object URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewImageUrl(url);
        console.log(`Image blob created, URL: ${url}`);
      } else {
        // For other content, try to detect if it might be text
        const contentType = response.headers.get('content-type');
        console.log(`Content-Type from response: ${contentType}`);
        
        if (contentType?.startsWith('text/') || 
            contentType?.includes('json') || 
            contentType?.includes('javascript') || 
            contentType?.includes('xml')) {
          // If the server says it's text, get as text
          data = await response.text();
          console.log(`Text data fetched from content-type header, length: ${data.length}`);
        } else {
          // Try as blob for any other type
          try {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPreviewImageUrl(url);
            console.log(`Blob created for other content type, URL: ${url}`);
          } catch (blobError) {
            console.error('Error creating blob:', blobError);
          }
        }
      }
      
      setPreviewItem({ ...item, data });
      setShowPreview(true);
    } catch (error) {
      console.error('Error fetching preview:', error);
      // Still show the preview with error handling
      setPreviewItem({ ...item });
      setShowPreview(true);
    }
  };

  const closePreview = () => {
    // Clean up any object URLs when closing the preview
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
    setPreviewItem(null);
    setShowPreview(false);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-[#3a3b3e] bg-[#2a2b2e] p-4">
        <h2 className="text-xl font-semibold text-[#00ffd5] mb-4">Transaction History</h2>
        
        {/* Tabs */}
        <div className="flex border-b border-[#3a3b3e]">
          <button
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'uploads' 
                ? 'text-[#00ffd5] border-[#00ffd5]' 
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('uploads')}
          >
            Uploads
            {uploadCount > 0 && (
              <span className="ml-2 bg-[#00ffd5]/20 text-[#00ffd5] text-xs font-semibold px-2 py-0.5 rounded-full">
                {uploadCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Search field */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 pr-8 rounded-md bg-[#1a1b1e] border border-[#3a3b3e] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00ffd5] focus:border-[#00ffd5] text-sm sm:text-base"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      {/* Firebase Index Error Message */}
      {indexError && (
        <div className="mb-6 p-4 border border-yellow-600 bg-yellow-900/50 rounded-lg">
          <h3 className="text-yellow-400 font-medium mb-2">Firebase Index Required</h3>
          <p className="text-yellow-200 text-sm mb-2">
            To view your transaction history across browsers, a Firebase index needs to be created.
          </p>
          <div className="mb-2">
            <a 
              href={getTransactionsIndexUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ffd5] hover:underline inline-flex items-center"
            >
              <span>Create the required index</span>
              <FaExternalLinkAlt className="ml-1 h-3 w-3" />
            </a>
          </div>
          <p className="text-gray-400 text-xs">
            Until the index is created, only local history will be shown.
          </p>
        </div>
      )}
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <FaSpinner className="animate-spin text-[#00ffd5] text-2xl" />
            <span className="ml-2 text-gray-300">Loading history...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-md p-4">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">No transactions found</h3>
            <p className="mt-1 text-gray-400">
              {searchQuery 
                ? "Try a different search term" 
                : "Upload files to see your transaction history"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-[#00ffd5]">Upload History</h2>
                </div>
                
                {historyItems.length > 0 && (
                  <Button
                    onClick={clearHistory}
                    variant="danger"
                    className="flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>Clear History</span>
                  </Button>
                )}
              </div>

              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 border border-[#3a3b3e] rounded-lg bg-[#2a2b2e] hover:bg-[#3a3b3e] transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {item.type === 'upload' ? (
                        item.contentType ? getFileIcon(item.contentType) : <FaUpload className="text-[#00ffd5]" />
                      ) : item.type === 'retrieve' ? (
                        <FaDownload className="text-[#00ffd5]" />
                      ) : (
                        <FaFile className="text-[#00ffd5]" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between">
                        <div className="mr-2 mb-2 sm:mb-0 overflow-hidden">
                          <h3 className="font-medium text-white truncate max-w-full">
                            {item.name || `Transaction ${item.id.substring(0, 8)}...`}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {formatDate(item.timestamp)} • {item.size ? formatFileSize(item.size) : 'Unknown size'}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2 flex-shrink-0">
                          <button
                            onClick={() => openPreview(item)}
                            className="text-gray-400 hover:text-[#00ffd5] p-1"
                            title="Preview"
                          >
                            <FaExternalLinkAlt size={14} />
                          </button>
                          
                          <button
                            onClick={() => copyTransactionId(item.id)}
                            className="text-gray-400 hover:text-[#00ffd5] p-1"
                            title="Copy Transaction ID"
                          >
                            <FaCopy size={14} />
                          </button>
                          
                          <button
                            onClick={() => removeHistoryItem(item.id)}
                            className="text-gray-400 hover:text-red-400 p-1"
                            title="Remove from History"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center overflow-hidden">
                        <div className="text-xs bg-[#1a1b1e] text-[#00ffd5] px-2 py-0.5 rounded flex-shrink-0">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </div>
                        <div className="ml-2 text-xs text-gray-400 truncate overflow-hidden flex-1 min-w-0">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2b2e] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-[#3a3b3e]">
              <h3 className="text-lg font-medium text-[#00ffd5]">
                {previewItem.name}
              </h3>
              <button 
                onClick={closePreview}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              {previewImageUrl ? (
                <img 
                  src={previewImageUrl}
                  alt={previewItem.name} 
                  className="max-w-full max-h-[60vh] mx-auto"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.currentTarget.outerHTML = '<div class="text-center text-gray-400">Error loading image. Format may be unsupported.</div>';
                  }}
                />
              ) : previewItem.data ? (
                // Text content - handle any type of text data
                <pre className="bg-[#1a1b1e] p-4 rounded-lg text-gray-300 font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {typeof previewItem.data === 'string' ? 
                    previewItem.data : 
                    'Cannot display content (unsupported format)'
                  }
                </pre>
              ) : (
                <div className="text-center p-8">
                  <FaFile className="text-[#00ffd5] text-5xl mx-auto mb-4" />
                  <p className="text-white">This file type cannot be previewed</p>
                  <p className="text-gray-400 text-sm mt-2">You can still download the file using the transaction ID.</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center p-4 border-t border-[#3a3b3e] bg-[#1a1b1e]">
              <div className="text-gray-400 text-sm">
                {previewItem.contentType} • {previewItem.size ? formatFileSize(previewItem.size) : 'Unknown size'}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewItem.id);
                    toast.success('Transaction ID copied to clipboard');
                  }}
                  className="text-[#00ffd5] hover:text-[#00e6c0] flex items-center"
                >
                  <FaCopy className="mr-1" size={14} />
                  Copy ID
                </button>
                <button
                  onClick={() => {
                    const downloadUrl = `https://gateway.irys.xyz/${previewItem.id}`;
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = previewItem.name || `file-${previewItem.id.substring(0, 8)}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    toast.success('Download started');
                  }}
                  className="text-[#00ffd5] hover:text-[#00e6c0] flex items-center"
                >
                  <FaDownload className="mr-1" size={14} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default History; 
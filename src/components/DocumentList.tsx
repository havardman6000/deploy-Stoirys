import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useFirebase } from '../contexts/FirebaseContext';
import Card from './common/Card';
import Button from './common/Button';
import { FaFile, FaFileAlt, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileAudio, FaFileVideo, FaFileCode, FaSearch, FaExternalLinkAlt, FaCopy, FaTrash, FaDownload, FaEye, FaTimes, FaSpinner } from 'react-icons/fa';

// Helper function to get icon based on file type
const getFileIcon = (contentType: string) => {
  if (contentType.includes('image')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  } else if (contentType.includes('pdf')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  } else if (contentType.includes('text') || contentType.includes('json')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
};

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "Unknown";
  
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// Helper function to format date
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
};

// Type definition for folder with parentId
interface EnhancedFolder {
  id: string;
  name: string;
  userId?: string;
  parentId?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

interface DocumentListProps {
  title?: string;
  limit?: number;
  showSearch?: boolean;
  searchQuery?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  title = "Your Documents", 
  limit = 0,
  showSearch = true,
  searchQuery: externalSearchQuery = ''
}) => {
  const { walletAddress } = useWallet();
  const { getFiles, getTransactions, createFolder, getFolders, saveFile } = useFirebase();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [folders, setFolders] = useState<EnhancedFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Function to load files and transactions
  const loadData = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load files from Firebase - pass currentFolder as undefined if null
      let files = await getFiles(currentFolder || undefined);
      
      // Load transactions for linking
      const transactions = await getTransactions();
      
      // Get folders
      const folderList = await getFolders();
      
      // Convert the folder list to our enhanced type and filter accordingly
      const enhancedFolders = folderList.map(folder => ({ 
        ...folder, 
        parentId: (folder as any).parentId 
      })) as EnhancedFolder[];
      
      // Filter folders based on current folder
      setFolders(enhancedFolders.filter(folder => {
        // Root level folders have null or empty parentId
        if (!currentFolder) {
          return !folder.parentId;
        }
        // Subfolders have the current folder as parentId
        return folder.parentId === currentFolder;
      }));
      
      // Enhance files with transaction data if available
      files = files.map(file => {
        const transaction = transactions.find(tx => tx.transactionId === file.transactionId);
        return {
          ...file,
          transactionDetails: transaction || null
        };
      });
      
      setDocuments(files);
    } catch (error: any) {
      console.error("Error loading documents:", error);
      setError(`Failed to load documents: ${error.message}`);
      setDocuments([]);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on mount and when folder changes
  useEffect(() => {
    loadData();
  }, [walletAddress, currentFolder]);
  
  // Filter documents based on search
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.type && doc.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // View transaction on explorer
  const viewTransaction = (id: string) => {
    window.open(`https://explorer.irys.xyz/transaction/${id}`, '_blank');
  };
  
  // View document directly
  const viewDocument = (url: string) => {
    window.open(url, '_blank');
  };
  
  // Download document
  const downloadDocument = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Copy transaction ID
  const copyTransactionId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert("Transaction ID copied to clipboard!");
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      // Here we add the proper parentId reference based on the current folder
      await createFolder(newFolderName);
      
      setNewFolderName('');
      setShowNewFolderModal(false);
      loadData(); // Refresh the folders list
    } catch (error: any) {
      console.error("Error creating folder:", error);
      setError(`Failed to create folder: ${error.message}`);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  // Navigate up a level
  const navigateUp = async () => {
    if (!currentFolder) return;
    
    try {
      // Find the current folder to get its parent
      const folderList = await getFolders();
      const enhancedFolders = folderList.map(folder => ({ 
        ...folder, 
        parentId: (folder as any).parentId 
      })) as EnhancedFolder[];
      
      const currentFolderObj = enhancedFolders.find(f => f.id === currentFolder);
      
      if (currentFolderObj) {
        setCurrentFolder(currentFolderObj.parentId || null);
      } else {
        setCurrentFolder(null);
      }
    } catch (error) {
      console.error("Error navigating up:", error);
      setCurrentFolder(null); // Fallback to root
    }
  };

  // Sort documents and folders
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'date') {
      const aTimestamp = a.updatedAt?.toDate().getTime() || a.createdAt?.toDate().getTime() || 0;
      const bTimestamp = b.updatedAt?.toDate().getTime() || b.createdAt?.toDate().getTime() || 0;
      return sortDirection === 'asc' ? aTimestamp - bTimestamp : bTimestamp - aTimestamp;
    } else if (sortBy === 'size') {
      return sortDirection === 'asc' ? (a.size || 0) - (b.size || 0) : (b.size || 0) - (a.size || 0);
    }
    return 0;
  });

  // Toggle sort direction
  const toggleSort = (field: 'name' | 'date' | 'size') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-[#3a3b3e] bg-[#2a2b2e] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#00ffd5]">{title}</h2>
          <div className="flex items-center space-x-2">
            {currentFolder && (
              <Button
                onClick={navigateUp}
                className="text-gray-300 hover:text-[#00ffd5] bg-[#1a1b1e] border border-[#3a3b3e] px-3 py-1"
              >
                ← Back
              </Button>
            )}
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="text-gray-300 hover:text-[#00ffd5] bg-[#1a1b1e] border border-[#3a3b3e] px-3 py-1 rounded"
            >
              + Create Folder
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        {showSearch && (
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search documents by name or type..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 rounded-md bg-[#1a1b1e] border border-[#3a3b3e] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00ffd5] focus:border-[#00ffd5]"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Folder path breadcrumbs can be added here if needed */}
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <FaSpinner className="animate-spin text-[#00ffd5] text-2xl" />
            <span className="ml-2 text-gray-300">Loading documents...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 text-red-200 rounded-md p-4">
            {error}
          </div>
        ) : folders.length === 0 && filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">No documents found</h3>
            <p className="mt-1 text-gray-400">Upload files to see them here</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                onClick={() => setShowNewFolderModal(true)}
                className="bg-[#1a1b1e] text-[#00ffd5] border border-[#00ffd5] hover:bg-[#00ffd5]/10"
              >
                Create Folder
              </Button>
              <Button
                onClick={() => {
                  const event = new CustomEvent('changeActiveTab', { detail: { tab: 'upload' } });
                  window.dispatchEvent(event);
                }}
                className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black"
              >
                Upload a Document
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Sorting controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-300">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} {currentFolder ? 'in this folder' : ''}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <button
                  onClick={() => toggleSort('name')}
                  className={`px-2 py-1 text-sm rounded ${sortBy === 'name' ? 'bg-[#00ffd5]/20 text-[#00ffd5]' : 'text-gray-300 hover:bg-[#3a3b3e]'}`}
                >
                  Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('date')}
                  className={`px-2 py-1 text-sm rounded ${sortBy === 'date' ? 'bg-[#00ffd5]/20 text-[#00ffd5]' : 'text-gray-300 hover:bg-[#3a3b3e]'}`}
                >
                  Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('size')}
                  className={`px-2 py-1 text-sm rounded ${sortBy === 'size' ? 'bg-[#00ffd5]/20 text-[#00ffd5]' : 'text-gray-300 hover:bg-[#3a3b3e]'}`}
                >
                  Size {sortBy === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-2 py-1 text-gray-300 hover:bg-[#3a3b3e] rounded"
                >
                  {viewMode === 'grid' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Grid/List View of Documents */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'divide-y divide-[#3a3b3e]'}>
              {/* Folders first */}
              {folders.map((folder) => (
                <div 
                  key={folder.id}
                  onClick={() => navigateToFolder(folder.id)}
                  className={
                    viewMode === 'grid'
                      ? 'cursor-pointer p-4 border border-[#3a3b3e] rounded-lg bg-[#2a2b2e] hover:bg-[#3a3b3e] transition-colors'
                      : 'cursor-pointer p-4 hover:bg-[#2a2b2e] transition-colors flex items-center'
                  }
                >
                  <div className={viewMode === 'grid' ? 'flex items-center mb-2' : 'flex items-center flex-1'}>
                    <svg className="h-8 w-8 text-[#00ffd5] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <div className="overflow-hidden">
                      <p className="font-medium text-white truncate">{folder.name}</p>
                      {viewMode === 'list' && (
                        <p className="text-xs text-gray-400 truncate">Folder</p>
                      )}
                    </div>
                  </div>
                  {viewMode === 'grid' && (
                    <p className="text-xs text-gray-400">Folder</p>
                  )}
                </div>
              ))}
              
              {/* Documents */}
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className={
                    viewMode === 'grid'
                      ? 'p-4 border border-[#3a3b3e] rounded-lg bg-[#2a2b2e] hover:bg-[#3a3b3e] transition-colors'
                      : 'p-4 hover:bg-[#2a2b2e] transition-colors'
                  }
                >
                  <div className={viewMode === 'grid' ? '' : 'flex items-center'}>
                    <div className={viewMode === 'grid' ? 'flex items-center mb-3' : 'flex items-center flex-1'}>
                      {getFileIcon(doc.type)}
                      <div className="ml-3 overflow-hidden">
                        <p className="font-medium text-white truncate">{doc.name}</p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(doc.size)} • {new Date(doc.uploadedAt?.toMillis() || 0).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className={viewMode === 'grid' ? 'flex justify-between items-center' : 'flex items-center ml-4'}>
                      <div className="space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewTransaction(doc.transactionId);
                          }}
                          className="text-gray-400 hover:text-[#00ffd5] p-1"
                          title="View on Explorer"
                        >
                          <FaExternalLinkAlt />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTransactionId(doc.transactionId);
                          }}
                          className="text-gray-400 hover:text-[#00ffd5] p-1"
                          title="Copy Transaction ID"
                        >
                          <FaCopy />
                        </button>
                        
                        {doc.irysUrl && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewDocument(doc.irysUrl || '');
                              }}
                              className="text-gray-400 hover:text-[#00ffd5] p-1"
                              title="View Document"
                            >
                              <FaEye />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadDocument(doc.irysUrl || '', doc.name);
                              }}
                              className="text-gray-400 hover:text-[#00ffd5] p-1"
                              title="Download Document"
                            >
                              <FaDownload />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Create Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2b2e] rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-[#00ffd5] mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full p-2 rounded-md mb-4 bg-[#1a1b1e] border border-[#3a3b3e] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00ffd5]"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowNewFolderModal(false)}
                className="bg-[#3a3b3e] text-white hover:bg-[#4a4b4e]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DocumentList; 
import { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../../services/historyService';
import { HistoryItem } from '../../services/historyService';
import Card from './Card';
import Button from './Button';
import TransactionDetails from './TransactionDetails';

// File type icons
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    );
  } else if (type.startsWith('video/')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    );
  } else if (type.startsWith('audio/')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
      </svg>
    );
  } else if (type.startsWith('text/') || type.includes('json')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    );
  } else if (type.includes('pdf')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
};

// Format file size
const formatFileSize = (bytes: number | undefined) => {
  if (bytes === undefined || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface HistoryProps {
  onSelectItem?: (id: string) => void;
}

const History = ({ onSelectItem }: HistoryProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);

  // Load history on component mount
  useEffect(() => {
    const items = getHistory();
    setHistoryItems(items);
  }, []);

  // Handle item click
  const handleItemClick = (id: string) => {
    setSelectedItem(id);
    if (onSelectItem) {
      onSelectItem(id);
    }
  };

  // Handle clear history
  const handleClearHistory = () => {
    clearHistory();
    setHistoryItems([]);
  };

  // Generate a unique key for each history item
  const getItemKey = (item: HistoryItem) => {
    return `${item.id}-${item.timestamp}`;
  };

  return (
    <Card 
      title="Upload History" 
      headerActions={
        <Button
          variant="ghost"
          size="xs"
          onClick={handleClearHistory}
          disabled={historyItems.length === 0}
        >
          Clear All
        </Button>
      }
      className="bg-white"
      noPadding
    >
      {historyItems.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">No history items found</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border-light">
          {/* Table header */}
          <div className="file-list-header grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider border-b border-border-light">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          {/* Table body */}
          <div className="divide-y divide-border-light">
            {historyItems.map((item) => (
              <div key={getItemKey(item)} className="flex flex-col">
                <div 
                  className={`file-list-row grid grid-cols-12 gap-4 px-4 py-3 text-sm cursor-pointer ${
                    selectedItem === item.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="col-span-5 flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      {getFileIcon(item.type)}
                    </div>
                    <div className="truncate font-medium">
                      {item.name || `File-${item.id.substring(0, 8)}`}
                    </div>
                  </div>
                  <div className="col-span-3 text-text-secondary truncate">
                    {formatDate(item.timestamp)}
                  </div>
                  <div className="col-span-2 text-text-secondary truncate">
                    {formatFileSize(item.size)}
                  </div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <button 
                      className="text-text-secondary hover:text-primary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/?tx=${item.id}`, '_blank');
                      }}
                      title="Open in browser"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </button>
                    {item.type === 'upload' && (
                      <button 
                        className="text-text-secondary hover:text-primary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetailsId(showDetailsId === item.id ? null : item.id);
                        }}
                        title="View transaction details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Transaction details panel */}
                {showDetailsId === item.id && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-border-light">
                    <TransactionDetails transactionId={item.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default History; 
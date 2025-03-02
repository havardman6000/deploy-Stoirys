import React, { useState, useEffect } from 'react';
import { useIrys } from '../../hooks/useIrys';
import { getHistory, clearHistory } from '../../services/historyService';
import { HistoryItem } from '../../services/historyService';
import Button from './Button';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

// Helper function to get file type icon
const getFileIcon = (type: string) => {
  // Different icons based on file type
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('audio/')) return '🎵';
  if (type.startsWith('video/')) return '🎬';
  if (type.startsWith('text/')) return '📄';
  if (type.includes('pdf')) return '📑';
  return '📁';
};

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined) return 'Unknown size';
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to format date
const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface HistoryProps {
  onSelectItem?: (id: string) => void;
  initialQuery?: string;
}

const History: React.FC<HistoryProps> = ({ onSelectItem, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isWalletConnected } = useIrys();
  const navigate = useNavigate();

  // Load history on component mount
  useEffect(() => {
    const items = getHistory();
    setHistoryItems(items);
    setFilteredItems(items);
  }, []);

  // Effect to handle initialQuery updates
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch();
    }
  }, [initialQuery]);

  const handleSearch = () => {
    setIsSearching(true);
    
    const items = getHistory();
    
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      setIsSearching(false);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = items.filter(item => 
      (item.name && item.name.toLowerCase().includes(query)) ||
      item.id.toLowerCase().includes(query) ||
      (item.type && item.type.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some(tag => 
        tag.name.toLowerCase().includes(query) || 
        tag.value.toLowerCase().includes(query)
      ))
    );
    
    setFilteredItems(filtered);
    setIsSearching(false);
  };

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle item click
  const handleItemClick = (id: string) => {
    if (onSelectItem) {
      onSelectItem(id);
    } else {
      navigate(`/?tx=${id}`);
    }
  };

  // Handle clear history
  const handleClearHistory = () => {
    clearHistory();
    setHistoryItems([]);
    setFilteredItems([]);
  };

  // Navigate to retrieve tab with the search query
  const handleSearchNetwork = () => {
    // Dispatch event to change to retrieve tab
    const event = new CustomEvent('changeActiveTab', { 
      detail: { tab: 'retrieve' }
    });
    window.dispatchEvent(event);
    
    // If we have a search query, set it as the transaction ID
    if (searchQuery.trim()) {
      navigate(`/?tx=${searchQuery.trim()}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">History</h2>
        {historyItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex mb-4">
          <Button 
            variant="primary"
            className="mr-2"
          >
            History
          </Button>
          <Button 
            onClick={handleSearchNetwork}
            variant="secondary"
            disabled={!isWalletConnected}
            title={!isWalletConnected ? 'Connect wallet to search network' : ''}
          >
            Search Network
          </Button>
        </div>
        
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSearch}
            className="rounded-l-none"
          >
            Search
          </Button>
        </div>
      </div>
      
      <div>
        {isSearching ? (
          <div className="text-center py-8">
            <p>Searching...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{getFileIcon(item.type)}</div>
                    <div>
                      <h3 className="font-medium">{item.name || item.id.slice(0, 10) + '...'}</h3>
                      <p className="text-gray-500 text-sm">{formatDate(item.timestamp)}</p>
                      <p className="text-gray-500 text-sm">{item.type} • {formatFileSize(item.size)}</p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      onClick={() => handleItemClick(item.id)}
                      variant="secondary"
                      size="sm"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No results found for "{searchQuery}"</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Your history is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 
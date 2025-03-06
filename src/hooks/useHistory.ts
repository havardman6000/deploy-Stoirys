import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

// Define the history item interface
export interface HistoryItem {
  id: string;
  type: string;
  timestamp: number;
  size?: number;
  name?: string;
  contentType?: string;
  url?: string;
  status?: string;
}

// History hook for managing upload history in localStorage
export const useHistory = () => {
  const { walletAddress } = useWallet();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the storage key based on wallet address
  const getStorageKey = () => {
    if (!walletAddress) return null;
    return `irys-history-${walletAddress}`;
  };
  
  // Load history from localStorage when wallet changes
  useEffect(() => {
    if (walletAddress) {
      loadHistory();
    } else {
      // Clear history if wallet disconnects
      setHistoryItems([]);
    }
  }, [walletAddress]);
  
  // Load history from localStorage
  const loadHistory = () => {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
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
  
  // Save history to localStorage
  const saveHistory = (items: HistoryItem[]) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error: any) {
      console.error("Error saving history:", error);
      setError(`Failed to save history: ${error.message}`);
    }
  };
  
  // Add a new history item
  const addHistoryItem = (newItem: HistoryItem) => {
    // Ensure we don't add duplicates
    const isDuplicate = historyItems.some(item => item.id === newItem.id);
    
    if (!isDuplicate) {
      const updatedItems = [newItem, ...historyItems];
      setHistoryItems(updatedItems);
      saveHistory(updatedItems);
    }
  };
  
  // Remove a history item
  const removeHistoryItem = (id: string) => {
    const updatedItems = historyItems.filter(item => item.id !== id);
    setHistoryItems(updatedItems);
    saveHistory(updatedItems);
  };
  
  // Clear all history
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      setHistoryItems([]);
      saveHistory([]);
    }
  };
  
  // Get a specific history item by ID
  const getHistoryItem = (id: string) => {
    return historyItems.find(item => item.id === id) || null;
  };
  
  return {
    historyItems,
    loading,
    error,
    addHistoryItem,
    removeHistoryItem,
    clearHistory,
    getHistoryItem,
    loadHistory
  };
};

export default useHistory; 
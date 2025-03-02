import { Tag } from '../types';

const HISTORY_KEY = 'irys_app_history';

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: number;
  type: string;
  size: number;
  tags?: Tag[];
}

// Get history from localStorage
export const getHistory = (): HistoryItem[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
    return [];
  } catch (error) {
    console.error('Error retrieving history:', error);
    return [];
  }
};

// Save history to localStorage
export const saveHistory = (history: HistoryItem[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

// Add a new item to history
export const addHistoryItem = (item: HistoryItem): void => {
  try {
    const history = getHistory();
    // Check if item already exists by ID to avoid duplicates
    const exists = history.some(historyItem => historyItem.id === item.id);
    
    if (!exists) {
      const updatedHistory = [item, ...history].slice(0, 50); // Keep last 50 items
      saveHistory(updatedHistory);
    }
  } catch (error) {
    console.error('Error adding history item:', error);
  }
};

// Clear all history
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

// Remove a specific item from history
export const removeHistoryItem = (id: string): void => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    saveHistory(updatedHistory);
  } catch (error) {
    console.error('Error removing history item:', error);
  }
};

// Export a consolidated historyService object for compatibility
export const historyService = {
  getHistory,
  saveHistory,
  addHistoryItem,
  clearHistory,
  removeHistoryItem
};

export default historyService; 
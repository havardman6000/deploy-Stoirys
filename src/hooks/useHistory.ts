import { useState, useEffect, useCallback } from 'react';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(historyService.getHistory());
  }, []);

  // Add history item
  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'timestamp'>) => {
    historyService.addHistoryItem(item);
    setHistory(historyService.getHistory());
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    historyService.clearHistory();
    setHistory([]);
  }, []);

  // Remove history item
  const removeHistoryItem = useCallback((id: string) => {
    historyService.removeHistoryItem(id);
    setHistory(historyService.getHistory());
  }, []);

  return {
    history,
    addHistoryItem,
    clearHistory,
    removeHistoryItem
  };
}; 
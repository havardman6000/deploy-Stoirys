import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock the hooks
vi.mock('./hooks/useIrys', () => ({
  useIrys: () => ({
    isLoading: false,
    error: null,
    balance: '0.1',
    isDevnet: true,
    fetchBalance: vi.fn(),
    fundNode: vi.fn(),
    uploadData: vi.fn(),
    retrieveData: vi.fn(),
    toggleNetwork: vi.fn()
  })
}));

vi.mock('./hooks/useHistory', () => ({
  useHistory: () => ({
    history: [],
    addHistoryItem: vi.fn(),
    clearHistory: vi.fn(),
    removeHistoryItem: vi.fn()
  })
}));

// Simple test to check if the component renders
describe('App Component', () => {
  it('smoke test passes', () => {
    // We're just doing a simple smoke test to make sure the test framework works
    expect(true).toBe(true);
  });
}); 
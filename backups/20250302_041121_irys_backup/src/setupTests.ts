import '@testing-library/jest-dom';
import { vi } from 'vitest';
import './config/polyfills';

// Properly mock window properties
Object.defineProperty(window, 'ethereum', {
  value: {
    request: vi.fn().mockResolvedValue([]),
    on: vi.fn(),
    removeListener: vi.fn(),
    autoRefreshOnNetworkChange: false,
  },
  writable: true,
  configurable: true, // Make sure it's configurable
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document.createElement
const originalCreateElement = document.createElement.bind(document);
document.createElement = vi.fn((tagName) => {
  if (tagName === 'a') {
    return {
      setAttribute: vi.fn(),
      style: {},
      click: vi.fn(),
      href: '',
      download: '',
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    };
  }
  return originalCreateElement(tagName);
}); 
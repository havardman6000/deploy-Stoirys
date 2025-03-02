import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NetworkSelector from './NetworkSelector';

// Mock the useIrys hook
vi.mock('../../hooks/useIrys', () => ({
  useIrys: () => ({
    isDevnet: true,
    toggleNetwork: vi.fn(),
    isLoading: false
  })
}));

describe('NetworkSelector', () => {
  it('renders network options correctly', () => {
    render(<NetworkSelector />);
    
    // Check if both network options are rendered
    expect(screen.getByText('Testnet')).toBeDefined();
    expect(screen.getByText('Mainnet')).toBeDefined();
  });

  it('displays the current network correctly', () => {
    render(<NetworkSelector />);
    
    // In our mock, isDevnet is true, so Testnet should have bg-gray-200 class (secondary appearance)
    const testnetButton = screen.getByText('Testnet');
    expect(testnetButton.className).toContain('bg-gray-200');
    
    // Mainnet should have the primary appearance
    const mainnetButton = screen.getByText('Mainnet');
    expect(mainnetButton.className).toContain('bg-primary');
  });
}); 
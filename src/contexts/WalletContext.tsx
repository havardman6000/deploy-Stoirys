import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

// Types for TypeScript
interface WalletContextValue {
  isConnected: boolean;
  walletAddress: string | null;
  balance: string | null;
  provider: any;
  signer: any;
  chainId: bigint | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  switchToSepoliaNetwork: () => Promise<boolean>;
}

// Create context
const WalletContext = createContext<WalletContextValue>({
  isConnected: false,
  walletAddress: null,
  balance: null,
  provider: null,
  signer: null,
  chainId: null,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  switchToSepoliaNetwork: async () => false,
});

// Sepolia testnet chain ID
const SEPOLIA_CHAIN_ID = 11155111;

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);

  const switchToSepoliaNetwork = async (): Promise<boolean> => {
    console.log("Attempting to switch to Sepolia network");
    
    if (!window.ethereum) {
      console.error("Ethereum provider not available");
      return false;
    }

    try {
      await window.ethereum?.request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      console.error("Error switching network:", switchError);
      
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum?.request?.({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://eth-sepolia.public.blastapi.io'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }
            ]
          });
          return true;
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError);
          return false;
        }
      }
      return false;
    }
  };

  // Helper function to store wallet connection state in localStorage
  const storeConnectionState = (connected: boolean) => {
    if (connected) {
      localStorage.setItem('wallet-connection-state', 'connected');
    } else {
      localStorage.removeItem('wallet-connection-state');
    }
  };

  // Flag to track user-initiated disconnection - initialize from localStorage if available
  const [userDisconnected, setUserDisconnected] = useState(() => {
    const stored = localStorage.getItem('wallet-user-disconnected');
    return stored === 'true';
  });

  // Add logging for state changes and persist to localStorage
  useEffect(() => {
    console.log("DIAGNOSTIC: userDisconnected state changed to:", userDisconnected);
    localStorage.setItem('wallet-user-disconnected', userDisconnected ? 'true' : 'false');
  }, [userDisconnected]);

  useEffect(() => {
    const storedState = localStorage.getItem('wallet-connection-state');
    
    console.log("DIAGNOSTIC: Checking stored connection state:", storedState, "isConnected:", isConnected, "userDisconnected:", userDisconnected);
    
    // Only auto-connect if explicitly stored as connected
    if (storedState === 'connected' && !isConnected && window.ethereum && !userDisconnected) {
      console.log("DIAGNOSTIC: Auto-connecting from stored state");
      connectWallet();
    }
  }, [isConnected, userDisconnected]); // Add proper dependencies

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Define event handlers
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("DIAGNOSTIC: Accounts changed event fired. Accounts:", accounts, "userDisconnected:", userDisconnected);
        
        // Only process account changes if the user hasn't explicitly disconnected
        if (!userDisconnected) {
          if (accounts.length === 0) {
            // User has disconnected all accounts
            console.log("DIAGNOSTIC: No accounts found, disconnecting wallet");
            disconnectWallet();
          } else if (accounts[0] !== walletAddress) {
            // User has switched accounts
            console.log("DIAGNOSTIC: Account switched, reconnecting wallet");
            connectWallet();
          }
        } else {
          console.log("DIAGNOSTIC: Ignoring accounts changed event because user explicitly disconnected");
        }
      };

      const handleChainChanged = () => {
        console.log("Chain changed, refreshing...");
        // The recommended way to handle chain changes is to refresh the page
        window.location.reload();
      };
      
      // Add event listeners
      if (window.ethereum && window.ethereum.on) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
      
      // Check if already connected
      if (window.ethereum && typeof window.ethereum.request === 'function') {
        console.log("DIAGNOSTIC: About to check initial accounts, userDisconnected:", userDisconnected);
        
        // Only perform the check if the user hasn't explicitly disconnected
        if (!userDisconnected) {
          window.ethereum.request({ method: 'eth_accounts' })
            .then((accounts: string[]) => {
              console.log("DIAGNOSTIC: Initial accounts check result:", accounts);
              if (accounts.length > 0) {
                connectWallet();
              }
            })
            .catch((err: any) => {
              console.error("DIAGNOSTIC: Error checking accounts:", err);
            });
        } else {
          console.log("DIAGNOSTIC: Skipping initial accounts check because userDisconnected is true");
        }
      }
      
      // Store event handlers for proper cleanup
      const cleanup = () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
      
      // Return cleanup function
      return cleanup;
    }
  }, [walletAddress, userDisconnected]); // Update dependencies

  const connectWallet = async (): Promise<boolean> => {
    console.log("DIAGNOSTIC: Starting connectWallet, userDisconnected:", userDisconnected);
    
    // Reset the user disconnected flag
    setUserDisconnected(false);
    
    if (!window.ethereum) {
      console.error("No Ethereum provider found. Please install MetaMask or another wallet");
      return false;
    }
    
    try {
      // Request account access
      const accounts = await window.ethereum.request?.({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        console.error("No accounts found");
        return false;
      }

      const address = accounts[0];
      setWalletAddress(address);
      console.log("Connected to wallet address:", address);

      // Create ethers provider and signer
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);

      const ethSigner = ethersProvider.getSigner();
      setSigner(ethSigner);

      // Get network and balance
      const network = await ethersProvider.getNetwork();
      setChainId(BigInt(network.chainId));
      console.log("Connected to network with chain ID:", network.chainId);

      const ethBalance = await ethersProvider.getBalance(address);
      setBalance(ethers.utils.formatEther(ethBalance));
      console.log("Wallet balance:", ethers.utils.formatEther(ethBalance));

      // Check if we're on Sepolia
      if (BigInt(network.chainId) !== BigInt(SEPOLIA_CHAIN_ID)) {
        console.log("Not connected to Sepolia. Current chain ID:", network.chainId);
        console.log("Attempting to switch to Sepolia...");
        const switched = await switchToSepoliaNetwork();
        if (!switched) {
          console.error("Failed to switch to Sepolia network");
          return false;
        }
      }

      // Save connection state to localStorage
      storeConnectionState(true);
      
      setIsConnected(true);
      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return false;
    }
  };

  const disconnectWallet = () => {
    console.log("DIAGNOSTIC: Starting disconnectWallet, current state:", {
      isConnected,
      walletAddress,
      userDisconnected
    });
    
    // Set the user disconnected flag to prevent auto-reconnection
    setUserDisconnected(true);
    
    // Clear the connection state from localStorage
    storeConnectionState(false);
    console.log("DIAGNOSTIC: Connection state cleared in localStorage");

    // Clear local data
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    console.log("DIAGNOSTIC: Local state cleared");
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      balance,
      provider,
      signer,
      chainId,
      connectWallet,
      disconnectWallet,
      switchToSepoliaNetwork,
    }}>
      {children}
    </WalletContext.Provider>
  );
} 
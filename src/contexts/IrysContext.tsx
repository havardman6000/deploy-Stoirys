import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { WebIrys } from '@irys/sdk';
import { ethers } from 'ethers';

// Constants
const IRYS_DEVNET_NODE = "https://devnet.irys.xyz"; // Irys DevNet URL
const FREE_TIER_MAX_SIZE = 95 * 1024; // 95KB for free tier
// Use Ethereum Sepolia testnet RPC
const SEPOLIA_RPC_URL = "https://eth-sepolia.public.blastapi.io";
const SEPOLIA_CHAIN_ID = 11155111;

// Define the context type
interface IrysContextType {
  isConnected: boolean;
  connectToIrys: () => Promise<void>;
  disconnectFromIrys: () => void;
  uploadFile: (file: File, metadata?: any) => Promise<string>;
  fundIrys: (amount: string) => Promise<string>;
  balance: string | null;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  errorMessage: string | null;
  refreshBalance: () => Promise<void>;
  getIrysInstance: () => any;
  isDevnet: boolean;
  calculateUploadCost: (size: number) => Promise<string>;
}

// Create initial context
const initialContext: IrysContextType = {
  isConnected: false,
  connectToIrys: async () => {},
  disconnectFromIrys: () => {},
  uploadFile: async () => "",
  fundIrys: async () => "",
  balance: null,
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  errorMessage: null,
  refreshBalance: async () => {},
  getIrysInstance: () => null,
  isDevnet: true,
  calculateUploadCost: async () => "0",
};

// Create context
const IrysContext = createContext<IrysContextType>(initialContext);

// Create custom hook
export const useIrys = () => useContext(IrysContext);

// Provider component
export function IrysProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [irys, setIrys] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get wallet context
  const { isConnected: isWalletConnected, walletAddress, provider, signer, chainId } = useWallet();

  // Log wallet connection status for debugging
  useEffect(() => {
    console.log("Wallet connection status in IrysContext:", isWalletConnected);
    console.log("Wallet address:", walletAddress);
  }, [isWalletConnected, walletAddress]);

  // Connect to Irys node
  const connectToIrys = async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Check if wallet is connected
      if (!isWalletConnected || !walletAddress || !provider || !signer) {
        console.log("Wallet not connected in IrysContext. isWalletConnected:", isWalletConnected);
        // Don't set a visible error message since we show the global banner instead
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      // Validate network is Sepolia
      if (chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
        setErrorMessage(`Please switch to Sepolia network. Current chain ID: ${chainId}`);
        setIsLoading(false);
        return;
      }

      console.log("Creating WebIrys instance with ethers v5...");
      
      // Create WebIrys instance for Ethereum
      const webIrys = new WebIrys({
        url: IRYS_DEVNET_NODE,
        token: "ethereum",
        wallet: { provider: provider, name: "ethers" },
      });

      // Connect to Irys
      await webIrys.ready();
      
      // Get user balance
      const userBalance = await webIrys.getLoadedBalance();
      // Convert balance to string before formatting
      setBalance(ethers.utils.formatEther(userBalance.toString()));
      console.log("Irys balance:", ethers.utils.formatEther(userBalance.toString()));
      
      // Store Irys instance
      setIrys(webIrys);
      
      // Store in window for debugging (optional)
      if (typeof window !== 'undefined') {
        window.irysInstance = webIrys;
      }
      
      setIsConnected(true);
      console.log("Connected to Irys successfully");
    } catch (error) {
      console.error("Failed to initialize Irys:", error);
      setErrorMessage(`Failed to connect to Irys: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect from Irys
  const disconnectFromIrys = () => {
    console.log("Disconnecting from Irys");
    
    // Clear the Irys instance and state
    setIrys(null);
    setIsConnected(false);
    setBalance(null);
    setUploadProgress(0);
    setIsUploading(false);
    
    // Clear localStorage values related to Irys
    localStorage.removeItem('irys-connection-state');
    
    // Clean window reference
    if (typeof window !== 'undefined') {
      if (window.irysInstance) {
        try {
          // Attempt to cleanly destroy the instance
          if (typeof window.irysInstance.disconnect === 'function') {
            window.irysInstance.disconnect();
          }
        } catch (err) {
          console.warn("Error disconnecting Irys instance:", err);
        }
        delete window.irysInstance;
      }
    }
    
    console.log("Successfully disconnected from Irys");
  };

  // Calculate the cost to upload a file based on size
  const calculateUploadCost = async (size: number): Promise<string> => {
    // For very small files, we don't charge
    if (size < FREE_TIER_MAX_SIZE) {
      return "FREE";
    }
    
    try {
      if (!irys) {
        await connectToIrys();
      }
      
      if (!irys) {
        throw new Error("Irys instance not available");
      }
      
      // Get cost for the file
      const price = await irys.getPrice(size);
      return ethers.utils.formatEther(price.toString());
    } catch (error) {
      console.error("Error calculating upload cost:", error);
      return "0";
    }
  };

  // Upload file to Irys
  const uploadFile = async (file: File, metadata: any = {}): Promise<string> => {
    if (!isConnected || !irys) {
      await connectToIrys();
      
      if (!isConnected || !irys) {
        throw new Error("Failed to connect to Irys");
      }
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);
    
    try {
      // Prepare metadata as tags
      const tags = [];
      
      // Add standard tags
      tags.push({ name: "Content-Type", value: file.type });
      tags.push({ name: "App-Name", value: "Stoirys" });
      
      // Add custom metadata as tags
      if (metadata) {
        for (const [key, value] of Object.entries(metadata)) {
          if (value && typeof value === 'string') {
            tags.push({ name: key, value });
          }
        }
      }
      
      // Create a custom progress tracking wrapper
      const progressTracker = (progress: any) => {
        // Log the raw progress data to understand its structure
        console.log("Progress update received:", progress);
        
        // Handle different progress formats from WebIrys
        let percentage = 0;
        
        if (typeof progress === 'number') {
          // Direct number - might be 0-1 or 0-100
          percentage = progress <= 1 ? progress * 100 : progress;
        } else if (progress && typeof progress === 'object') {
          // Object with percentage or progress data
          if (progress.percent !== undefined) {
            percentage = progress.percent <= 1 ? progress.percent * 100 : progress.percent;
          } else if (progress.progress !== undefined && progress.total !== undefined) {
            if (progress.total > 0) {
              percentage = (progress.progress / progress.total) * 100;
            }
          }
        }
        
        // Ensure percentage is between 0-100 and round to nearest integer
        percentage = Math.max(0, Math.min(100, Math.round(percentage)));
        
        console.log(`Calculated upload progress: ${percentage}%`);
        
        // Update state with calculated percentage - use functional update to avoid stale state
        setUploadProgress(percentage);
      };
      
      // Set up interval to force progress updates even if WebIrys is not reporting them
      let lastUpdate = Date.now();
      const progressInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastUpdate;
        
        // If more than 3 seconds have passed without an update, increment progress slightly
        if (elapsed > 3000) {
          setUploadProgress(prev => {
            // Only auto-increment if we haven't reached 90%
            // (preserve the last 10% for actual completion)
            if (prev < 90) {
              const increment = Math.max(1, Math.min(5, Math.floor(prev / 10)));
              const newProgress = Math.min(90, prev + increment);
              console.log(`Auto-incrementing progress to ${newProgress}% after ${elapsed}ms without updates`);
              lastUpdate = now;
              return newProgress;
            }
            return prev;
          });
        }
      }, 3000);
      
      // Upload file with enhanced progress callback
      console.log("Starting file upload with progress tracking...");
      console.log(`File size: ${formatBytes(file.size)}`);
      
      const receipt = await irys.uploadFile(file, { 
        tags,
        onProgress: (progress: any) => {
          progressTracker(progress);
          lastUpdate = Date.now(); // Update the timestamp when we get a progress update
        }
      });
      
      // Clear the interval
      clearInterval(progressInterval);
      
      // Set progress to 100% on successful completion
      setUploadProgress(100);
      
      console.log("File uploaded:", receipt);
      console.log("Transaction ID:", receipt.id);
      console.log("URL:", `https://gateway.irys.xyz/${receipt.id}`);
      
      return receipt.id;
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Upload failed: ${errorMsg}`);
      throw new Error(`Failed to upload: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      // Don't reset progress to 0 here - keep the final progress visible
    }
  };

  // Helper function to format file size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Fund Irys with ETH
  const fundIrys = async (amount: string): Promise<string> => {
    if (!isConnected || !irys) {
      await connectToIrys();
      
      if (!isConnected || !irys) {
        throw new Error("Failed to connect to Irys");
      }
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Convert amount from ETH to atomic units (wei)
      const fundAmount = ethers.utils.parseEther(amount);
      console.log(`Funding Irys with ${amount} ETH`);
      
      // Fund with timeout to handle potentially slow transactions
      const fundTx = await irys.fund(fundAmount.toString());
      
      console.log("Funding successful", fundTx);
      
      // Refresh balance
      await refreshBalance();
      
      return fundTx.id;
    } catch (error) {
      console.error("Error funding Irys:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Funding failed: ${errorMsg}`);
      throw new Error(`Failed to fund: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh balance from Irys
  const refreshBalance = async (): Promise<void> => {
    if (!isConnected || !irys) {
      return;
    }
    
    try {
      const userBalance = await irys.getLoadedBalance();
      // Convert BigNumber to string before formatting
      setBalance(ethers.utils.formatEther(userBalance.toString()));
      console.log("Updated Irys balance:", ethers.utils.formatEther(userBalance.toString()));
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  // Get Irys instance
  const getIrysInstance = () => irys;
  
  // Connect to Irys when wallet connects
  useEffect(() => {
    if (isWalletConnected && walletAddress && provider && signer) {
      if (!isConnected) {
        connectToIrys();
      }
    } else {
      // Disconnect if wallet disconnects
      if (isConnected) {
        disconnectFromIrys();
      }
    }
  }, [isWalletConnected, walletAddress, provider, signer]);

  // Define context value
  const contextValue: IrysContextType = {
    isConnected,
    connectToIrys,
    disconnectFromIrys,
    uploadFile,
    fundIrys,
    balance,
    isLoading,
    isUploading,
    uploadProgress,
    errorMessage,
    refreshBalance,
    getIrysInstance,
    isDevnet: true,
    calculateUploadCost,
  };

  return (
    <IrysContext.Provider value={contextValue}>
      {children}
    </IrysContext.Provider>
  );
} 
//src/contexts/IrysContext.tsx
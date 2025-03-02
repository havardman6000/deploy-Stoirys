import { useState, useCallback, useEffect } from 'react';
import { irysServiceSafe as irysService } from '../services/irysServiceSafe';
import { UploadResult, RetrievedData, Tag } from '../types';
import { getEthereum } from '../config/polyfills';

export const useIrys = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isDevnet, setIsDevnet] = useState<boolean>(
    import.meta.env.VITE_IRYS_DEVNET === 'true'
  );
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  
  // IMPORTANT: Define hooks in the correct order to avoid reference errors
  
  // Improved wallet verification
  const verifyWalletConnected = useCallback(async () => {
    console.log('[useIrys] Verifying wallet connection...');
    
    try {
      // Use the irysService method for detailed wallet status
      const walletStatus = await irysService.checkWalletConnectionStatus();
      console.log('[useIrys] Wallet status:', walletStatus);
      
      // Update the connected state based on the status
      setIsWalletConnected(walletStatus.isConnected);
      
      // Store in session storage if connected
      if (walletStatus.isConnected && walletStatus.account) {
        try {
          sessionStorage.setItem('wallet_connected', 'true');
          sessionStorage.setItem('wallet_address', walletStatus.account);
        } catch (e) {
          console.warn('[useIrys] Error saving wallet connection state to sessionStorage:', e);
        }
      }
      
      // Return the full status object for more detailed information
      return walletStatus;
    } catch (error) {
      console.error('[useIrys] Error verifying wallet connection:', error);
      setIsWalletConnected(false);
      
      // Return a standardized error response
      return {
        isConnected: false,
        isCorrectNetwork: false,
        error: error instanceof Error ? error.message : 'Unknown error checking wallet connection'
      };
    }
  }, []);

  // Fetch balance - with debouncing to prevent cascading updates
  // This needs to be defined before any hooks that use it!
  const fetchBalance = useCallback(async () => {
    // Verify wallet is connected first
    const connected = await verifyWalletConnected();
    if (!connected) {
      // Only set error if we need to show it to the user during an explicit balance check
      // Don't set error for background checks or initial loading
      console.log('[useIrys] Wallet not connected during fetchBalance');
      return '0';
    }
    
    setIsLoading(true);
    setError(null);
    try {
      console.log('[useIrys] Fetching balance for network:', isDevnet ? 'devnet' : 'testnet');
      const balance = await irysService.getBalance();
      console.log('[useIrys] Balance received:', balance);
      
      // Only update if we have a valid balance to prevent unnecessary renders
      if (balance && balance !== 'NaN') {
        setBalance(balance);
      }
      return balance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useIrys] Error fetching balance:', errorMessage);
      // Don't set error for background operations
      return '0';
    } finally {
      setIsLoading(false);
    }
  }, [verifyWalletConnected, isDevnet]);

  // Check wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if user has explicitly disconnected
        const userDisconnected = localStorage.getItem('wallet_disconnected') === 'true';
        
        // If user explicitly disconnected, don't auto-connect
        if (userDisconnected) {
          console.log('[useIrys] User previously disconnected, not auto-connecting');
          setIsWalletConnected(false);
          return false;
        }
        
        const ethereum = getEthereum();
        if (!ethereum) return false;
        
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const isConnected = accounts && accounts.length > 0;
        
        console.log('[useIrys] Initial wallet check:', isConnected ? 'Connected' : 'Not connected');
        setIsWalletConnected(isConnected);
        
        // Store connection state
        if (isConnected) {
          localStorage.setItem('wallet_connected', 'true');
          if (accounts[0]) {
            localStorage.setItem('wallet_address', accounts[0]);
          }
        }
        
        return isConnected;
      } catch (err) {
        console.error('[useIrys] Error checking wallet connection:', err);
        setIsWalletConnected(false);
        return false;
      }
    };
    
    checkWalletConnection();
  }, []);

  // Reset error when status changes
  useEffect(() => {
    if (isWalletConnected) {
      setError(null);
    }
  }, [isWalletConnected]);

  // Connect wallet
  const connectWallet = useCallback(async (): Promise<boolean> => {
    console.log('[useIrys] Connecting wallet...');
    setError(null);
    setIsLoading(true);
    
    try {
      // Clear the disconnected flag when user explicitly connects
      try {
        localStorage.removeItem('wallet_disconnected');
      } catch (e) {
        console.warn('[useIrys] Error accessing localStorage:', e);
      }
      
      // Get Ethereum instance
      const ethereum = getEthereum();
      if (!ethereum) {
        setError('No Ethereum wallet detected. Please install MetaMask or a compatible wallet.');
        return false;
      }
      
      try {
        // Request wallet connection with timeout
        console.log('[useIrys] Requesting wallet accounts...');
        
        // Create a Promise wrapper with timeout
        const requestAccountsWithTimeout = async (timeoutMs: number = 30000) => {
          let timeoutId: NodeJS.Timeout;
          
          const timeoutPromise = new Promise<string[]>((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error('Wallet connection request timed out'));
            }, timeoutMs);
          });
          
          try {
            const accountsPromise = ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await Promise.race([accountsPromise, timeoutPromise]) as string[];
            clearTimeout(timeoutId!);
            return accounts;
          } catch (error) {
            clearTimeout(timeoutId!);
            throw error;
          }
        };
        
        // Request accounts with timeout
        const accounts = await requestAccountsWithTimeout();
        
        if (!accounts || accounts.length === 0) {
          setError('No accounts found. Please unlock your wallet and try again.');
          return false;
        }
        
        console.log('[useIrys] Wallet connected with account:', accounts[0]);
        
        // Save the connected address to localStorage to maintain state across page refreshes
        try {
          localStorage.setItem('wallet_address', accounts[0]);
          localStorage.setItem('wallet_connected', 'true');
        } catch (e) {
          console.warn('[useIrys] Error saving wallet info to localStorage:', e);
        }
        
        // Connect to Irys to verify the connection works
        await irysService.connectToIrys(true);
        console.log('[useIrys] Successfully connected to Irys node');
        
        // Update state after successful connection
        setIsWalletConnected(true);
        
        // Update the balance
        await fetchBalance();
        
        return true;
      } catch (err) {
        console.error('[useIrys] Error connecting wallet:', err);
        setError(`Failed to connect wallet: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance]);

  // Upload data
  const uploadData = useCallback(async (data: string | File | Blob, tags: Tag[] = []): Promise<UploadResult> => {
    // We need to check the connection first
    const connected = await verifyWalletConnected();
    if (!connected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      sessionStorage.setItem('networkChanged', 'false');
      
      // Set signature requested flag for UI feedback
      sessionStorage.setItem('signatureRequested', 'true');
      sessionStorage.setItem('signatureRequestTime', Date.now().toString());
      
      // Convert Blob to File if needed to match irysService.uploadData parameters
      let uploadData: string | File | Uint8Array;
      if (data instanceof Blob && !(data instanceof File)) {
        // Convert Blob to File by creating a new File instance
        uploadData = new File([data], 'blob-upload', { type: data.type });
      } else {
        uploadData = data as string | File;
      }
      
      const result = await irysService.uploadData(uploadData, tags);
      
      // Clear signature request flag
      sessionStorage.removeItem('signatureRequested');
      
      // Clear any indications of network change
      sessionStorage.removeItem('networkChanged');
      
      // Convert the result to a proper UploadResult object to fix the type errors
      // First create an object that matches the UploadResult type
      const uploadResult: UploadResult = {
        id: typeof result.id === 'string' ? result.id : JSON.stringify(result.id),
        url: typeof result.url === 'string' ? result.url : JSON.stringify(result.url),
        receipt: result.receipt,
        transactionHash: typeof result.transactionHash === 'string' ? 
          result.transactionHash : JSON.stringify(result.transactionHash),
        explorerUrl: typeof result.explorerUrl === 'string' ? 
          result.explorerUrl : JSON.stringify(result.explorerUrl)
      };
      
      console.log('[useIrys] Upload successful:', uploadResult);
      
      return uploadResult;
    } catch (error) {
      // Clear signature request flag
      sessionStorage.removeItem('signatureRequested');
      
      setError(error instanceof Error ? error.message : 'Unknown error during upload');
      
      // Check if the error is due to network change during upload
      const networkChanged = sessionStorage.getItem('networkChanged') === 'true';
      if (networkChanged) {
        setError('Network changed during upload. Please reconnect your wallet and try again.');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [verifyWalletConnected]);

  // Fund node
  const fundNode = async (amount: string): Promise<any> => {
    if (!amount) {
      throw new Error('Amount is required for funding');
    }

    if (parseFloat(amount) <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[useIrys] Starting fund operation with amount:', amount);
      
      // Save pre-funding balance for comparison
      let preFundingBalance = '0';
      try {
        preFundingBalance = await irysService.getBalance();
        console.log('[useIrys] Balance before funding:', preFundingBalance);
      } catch (balanceErr) {
        console.warn('[useIrys] Could not fetch pre-funding balance:', balanceErr);
      }
      
      // Funding operation with timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Funding operation timed out after 90 seconds in the useIrys hook.'));
        }, 90000); // 90-second timeout as backup
      });
      
      // Race the funding operation against the timeout
      const fundPromise = irysService.fundNode(amount);
      const result = await Promise.race([fundPromise, timeoutPromise]);
      
      console.log('[useIrys] Funding transaction submitted:', result);
      
      // If we have a transaction hash, we store it for reference
      if (result && typeof result === 'object') {
        try {
          // Store funding info safely - already handled in irysService
          // Just log for debug purposes
          if (result.tx && result.tx.id) {
            console.log('[useIrys] Transaction ID from result:', 
              typeof result.tx.id === 'string' ? result.tx.id : JSON.stringify(result.tx.id));
          }
        } catch (storageErr) {
          console.warn('[useIrys] Error accessing result data:', storageErr);
        }
      }
      
      // Schedule balance refresh
      setTimeout(async () => {
        try {
          const newBalance = await irysService.getBalance();
          console.log('[useIrys] Balance after funding timeout:', newBalance);
          setBalance(newBalance);
        } catch (refreshErr) {
          console.warn('[useIrys] Could not refresh balance after timeout:', refreshErr);
        }
      }, 5000);
      
      // Return the result from the service
      return result;
    } catch (error) {
      console.error('[useIrys] Funding error:', error);
      
      // If this is an error about a transaction that might be valid, we show a different message
      if (error instanceof Error && error.message.includes('failed to post funding tx')) {
        // Extract transaction ID if available
        const match = error.message.match(/tx - ([a-fA-F0-9]+) -/);
        if (match && match[1]) {
          const txId = match[1];
          console.log('[useIrys] Extracted transaction ID from error:', txId);
          
          // Schedule balance checks anyway
          scheduleBalanceChecks();
          
          // Return a modified result to indicate pending status
          return {
            status: 'pending',
            message: 'Transaction submitted but verification pending',
            txHash: txId
          };
        }
      }
      
      setError(error instanceof Error ? error.message : 'Unknown error during funding');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Schedule multiple balance checks with increasing delays
   */
  const scheduleBalanceChecks = () => {
    const delays = [5000, 15000, 30000, 60000]; // 5s, 15s, 30s, 60s
    
    delays.forEach(delay => {
      setTimeout(() => {
        console.log(`[useIrys] Scheduled balance check after ${delay}ms`);
        fetchBalance().catch(err => {
          console.warn('[useIrys] Error in scheduled balance check:', err);
        });
      }, delay);
    });
  };

  // Retrieve data - doesn't require wallet connection
  const retrieveData = useCallback(async (transactionId: string): Promise<RetrievedData> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await irysService.retrieveData(transactionId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err; // Re-throw to handle in the UI
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle network (devnet/mainnet)
  const toggleNetwork = useCallback(() => {
    console.log('[useIrys] Toggling network from', isDevnet ? 'devnet' : 'testnet', 'to', !isDevnet ? 'devnet' : 'testnet');
    const newIsDevnet = !isDevnet;
    setIsDevnet(newIsDevnet);
    irysService.setDevnet(newIsDevnet);
    
    // Reset balance when switching networks
    setBalance('0');
    
    // Force a balance refresh after a short delay to allow the network switch to complete
    setTimeout(() => {
      fetchBalance().catch(err => {
        console.error('[useIrys] Error fetching balance after network switch:', err);
      });
    }, 500);
  }, [isDevnet, fetchBalance]);

  // Set wallet connection status
  const setWalletConnection = useCallback((status: boolean) => {
    setIsWalletConnected(status);
    // If wallet is disconnected, reset balance
    if (!status) {
      setBalance('0');
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    console.log('[useIrys] Disconnecting wallet');
    
    // Update connection state first
    setIsWalletConnected(false);
    
    // Reset financial data
    setBalance('0');
    
    // Clear any error messages
    setError(null);
    
    // Try to disconnect from provider if it supports disconnection
    try {
      const ethereum = getEthereum();
      if (ethereum) {
        // Different wallets have different disconnect methods
        if (typeof ethereum.disconnect === 'function') {
          await ethereum.disconnect();
          console.log('[useIrys] Called ethereum.disconnect()');
        }
        
        // Some wallets support closeConnection
        if (typeof ethereum.closeConnection === 'function') {
          await ethereum.closeConnection();
          console.log('[useIrys] Called ethereum.closeConnection()');
        }
        
        // For WalletConnect v1
        if (ethereum.connector && typeof ethereum.connector.killSession === 'function') {
          await ethereum.connector.killSession();
          console.log('[useIrys] Called ethereum.connector.killSession()');
        }
        
        // For WalletConnect v2
        if (ethereum.provider && typeof ethereum.provider.disconnect === 'function') {
          await ethereum.provider.disconnect();
          console.log('[useIrys] Called ethereum.provider.disconnect()');
        }
        
        // Try to clear session cache if possible
        if (typeof ethereum.request === 'function') {
          try {
            // This works for some wallet implementations to clear permissions
            await ethereum.request({
              method: 'wallet_revokePermissions',
              params: [{ eth_accounts: {} }]
            });
            console.log('[useIrys] Revoked eth_accounts permission');
          } catch (err) {
            // Ignore errors as not all providers support this
            console.log('[useIrys] wallet_revokePermissions not supported');
          }
        }
      }
    } catch (err) {
      console.error('[useIrys] Error disconnecting from Ethereum provider:', err);
    }
    
    // Reset the underlying Irys connection in the service
    try {
      irysService.resetConnection();
    } catch (err) {
      console.error('[useIrys] Error resetting Irys connection:', err);
    }
    
    // Store disconnected state in localStorage
    try {
      localStorage.setItem('wallet_disconnected', 'true');
      localStorage.removeItem('wallet_connected');
      localStorage.removeItem('wallet_address');
    } catch (err) {
      console.error('[useIrys] Error updating localStorage:', err);
    }
    
    return true;
  }, []);

  return {
    isLoading,
    error,
    balance,
    isDevnet,
    isWalletConnected,
    connectWallet,
    fetchBalance,
    fundNode,
    uploadData,
    retrieveData,
    toggleNetwork,
    setWalletConnection,
    disconnectWallet,
    verifyWalletConnected
  };
}; 
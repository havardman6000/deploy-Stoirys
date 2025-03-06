import { useState, useCallback, useEffect } from 'react';
import { irysServiceSafe as irysService } from '../services/irysServiceSafe';
import { UploadResult, RetrievedData, Tag, HistoryItem } from '../types';
import { getEthereum } from '../config/polyfills';
import { useIrys as useIrysContext } from '../contexts/IrysContext';

// This hook provides backward compatibility with existing code that uses useIrys
export const useIrys = () => {
  // Get values from the new IrysContext
  const irysContext = useIrysContext();
  
  // Legacy state values
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isDevnet, setIsDevnet] = useState<boolean>(
    import.meta.env.VITE_IRYS_DEVNET === 'true'
  );
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  
  // Update the local state based on IrysContext
  useEffect(() => {
    setIsLoading(irysContext.isLoading);
    setError(irysContext.errorMessage);
    setBalance(irysContext.balance || '0');
    setIsWalletConnected(irysContext.isConnected);
  }, [
    irysContext.isLoading,
    irysContext.errorMessage,
    irysContext.balance,
    irysContext.isConnected
  ]);
  
  // Verify wallet connection, using the new context's state
  const verifyWalletConnected = useCallback(async () => {
    console.log('[useIrys] Verifying wallet connection...');
      return {
      isConnected: irysContext.isConnected,
      isCorrectNetwork: true,
      account: irysContext.getIrysInstance()?.address
    };
  }, [irysContext.isConnected, irysContext.getIrysInstance]);

  // Fetch balance - now using the IrysContext
  const fetchBalance = useCallback(async () => {
    console.log('[useIrys] Fetching balance...');
    try {
      await irysContext.refreshBalance();
      return irysContext.balance || '0';
    } catch (err) {
      console.error('[useIrys] Error fetching balance:', err);
      return '0';
    }
  }, [irysContext.refreshBalance, irysContext.balance]);

  // Connect wallet using IrysContext
  const connectWallet = useCallback(async (): Promise<boolean> => {
    console.log('[useIrys] Connecting wallet...');
    
    try {
      // Clear the disconnected flag
      try {
        localStorage.removeItem('wallet_disconnected');
      } catch (e) {
        console.warn('[useIrys] Error accessing localStorage:', e);
      }
      
      // Use the new context to connect
      await irysContext.connectToIrys();
      return irysContext.isConnected;
      } catch (err) {
        console.error('[useIrys] Error connecting wallet:', err);
        return false;
    }
  }, [irysContext.connectToIrys, irysContext.isConnected]);

  // Upload data through IrysContext
  const uploadData = useCallback(async (data: string | File | Blob, tags: Tag[] = []): Promise<UploadResult> => {
    console.log('[useIrys] Uploading data...');
    
    try {
      if (!irysContext.isConnected) {
        await irysContext.connectToIrys();
      }
      
      if (data instanceof File) {
        const txId = await irysContext.uploadFile(data, { tags });
        
        return {
          id: txId,
          url: `https://gateway.irys.xyz/${txId}`,
          explorerUrl: `https://explorer.irys.xyz/transaction/${txId}`,
          transactionHash: txId,
          receipt: { id: txId }
        };
      } else if (typeof data === 'string') {
        // String data upload
        const file = new File([data], 'text-upload.txt', { type: 'text/plain' });
        const txId = await irysContext.uploadFile(file, { tags });
        
        return {
          id: txId,
          url: `https://gateway.irys.xyz/${txId}`,
          explorerUrl: `https://explorer.irys.xyz/transaction/${txId}`,
          transactionHash: txId,
          receipt: { id: txId, data }
        };
      } else if (data instanceof Blob) {
        // Convert Blob to File
        const file = new File([data], 'blob-upload', { type: data.type });
        const txId = await irysContext.uploadFile(file, { tags });
        
        return {
          id: txId,
          url: `https://gateway.irys.xyz/${txId}`,
          explorerUrl: `https://explorer.irys.xyz/transaction/${txId}`,
          transactionHash: txId,
          receipt: { id: txId }
        };
      } else {
        throw new Error('Unsupported data type');
      }
    } catch (err) {
      console.error('[useIrys] Error uploading data:', err);
      throw err;
    }
  }, [irysContext.isConnected, irysContext.connectToIrys, irysContext.uploadFile]);

  // Fund the node - bridge to context
  const fundNode = useCallback(async (amount: string): Promise<any> => {
    console.log('[useIrys] Funding node with amount:', amount);
    
    try {
      const result = await irysContext.fundIrys(amount);
      return { id: result };
    } catch (err) {
      console.error('[useIrys] Error funding node:', err);
      throw err;
    }
  }, [irysContext.fundIrys]);
    
  // Retrieve data - delegating to the original irysService
  const retrieveData = useCallback(async (transactionId: string): Promise<RetrievedData> => {
    console.log('[useIrys] Retrieving data for transaction:', transactionId);
    return irysService.retrieveData(transactionId);
  }, []);

  // Get transaction details - delegating to the original irysService
  const getTransactionDetails = useCallback(async (transactionId: string) => {
    return irysService.getTransactionDetails(transactionId);
  }, []);

  // Return the combined API
  return {
    // State
    isLoading: isLoading || irysContext.isLoading,
    error: error || irysContext.errorMessage,
    balance: balance || irysContext.balance || '0',
    isWalletConnected: isWalletConnected || irysContext.isConnected,
    isDevnet,
    isUploading: irysContext.isUploading,
    uploadProgress: irysContext.uploadProgress,
    
    // Methods
    connectWallet,
    disconnectWallet: irysContext.disconnectFromIrys,
    fetchBalance,
    verifyWalletConnected,
    uploadData,
    retrieveData,
    fundNode,
    uploadDataWithIrysTokens: uploadData,
    getGatewayUrl: irysService.getGatewayUrl,
    getNodeUrl: irysService.getNodeUrl,
    getExplorerUrl: irysService.getExplorerUrl,
    getTransactionDetails,
    getAccessibleGatewayUrls: irysService.getAccessibleGatewayUrls,
    setDevnet: irysService.setDevnet,
    getIsDevnet: irysService.getIsDevnet,
    
    // Advanced methods from the original service
    checkWalletConnectionStatus: irysService.checkWalletConnectionStatus,
    requestDevnetTokens: irysService.requestDevnetTokens,
    getIrysTestnetTokens: irysService.getIrysTestnetTokens,
    uploadWithIrysTokens: irysService.uploadWithIrysTokens,
    resetConnection: irysService.resetConnection
  };
}; //src/hooks/useIrys.ts
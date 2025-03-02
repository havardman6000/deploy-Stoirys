import { WebUploader } from '@irys/web-upload';
import { WebEthereum } from '@irys/web-upload-ethereum';
import { EthersV6Adapter } from '@irys/web-upload-ethereum-ethers-v6';
import { ethers } from 'ethers';
import { UploadResult, RetrievedData, Tag, TransactionDetails } from '../types';
import { getEthereum } from '../config/polyfills';

// Add Ethereum window type
declare global {
  interface Window {
    ethereum: any;
  }
}

// Create a safer version of the Irys service using the newer WebUploader approach
class IrysServiceSafe {
  private isDevnet: boolean;
  private irysUploader: any = null;
  private lastWalletAddress: string | null = null;
  private connectionInProgress: boolean = false;
  
  constructor() {
    this.isDevnet = import.meta.env.VITE_IRYS_DEVNET === 'true';
  }
  
  getGatewayUrl(): string {
    return this.isDevnet 
      ? 'https://devnet.irys.xyz'
      : 'https://gateway.irys.xyz';
  }
  
  getNodeUrl(): string {
    return this.isDevnet
      ? 'https://devnet.irys.xyz'
      : 'https://node1.irys.xyz';
  }
  
  getExplorerUrl(): string {
    return this.isDevnet ? 'https://devnet.explorer.irys.xyz' : 'https://explorer.irys.xyz';
  }
  
  // Helper to detect if the wallet changed, which would require reconnection
  private async hasWalletChanged(): Promise<boolean> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        console.log('[irysServiceSafe] No Ethereum provider found, wallet changed');
        return true;
      }
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        console.log('[irysServiceSafe] No accounts available, wallet changed');
        return true;
      }
      
      // If we have a previous address and it's different, wallet changed
      if (this.lastWalletAddress && this.lastWalletAddress !== accounts[0]) {
        console.log('[irysServiceSafe] Wallet address changed from', this.lastWalletAddress, 'to', accounts[0]);
        return true;
      }
      
      // Update the last wallet address
      this.lastWalletAddress = accounts[0];
      return false;
    } catch (e) {
      console.error("[irysServiceSafe] Error checking if wallet changed:", e);
      return true; // Assume changed if error
    }
  }
  
  // Check if the wallet is connected without prompting for permissions
  async isWalletConnected(): Promise<boolean> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        console.log('[irysServiceSafe] No Ethereum provider found');
        return false;
      }
      
      // Use eth_accounts for a non-intrusive check of already-permitted accounts
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const connected = accounts && accounts.length > 0;
      
      // Log the result for debugging
      console.log('[irysServiceSafe] Wallet connection check:', connected ? 'Connected' : 'Not connected');
      if (connected) {
        console.log('[irysServiceSafe] Connected account:', accounts[0]);
        
        // If we have a connection, verify the chain ID to make sure we're on an appropriate network
        try {
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          console.log('[irysServiceSafe] Current chainId:', chainId);
        } catch (chainError) {
          console.warn('[irysServiceSafe] Error checking chain ID:', chainError);
        }
      } else {
        console.log('[irysServiceSafe] No accounts available');
      }
      
      return connected;
    } catch (error) {
      console.error('[irysServiceSafe] Error checking wallet connection:', error);
      return false;
    }
  }
  
  async connectToIrys(force: boolean = false): Promise<any> {
    console.log('[irysServiceSafe] Connecting to Irys...');
    
    // To avoid race conditions and duplicate connections
    if (this.connectionInProgress) {
      console.log('[irysServiceSafe] Connection already in progress, waiting...');
      // Wait for existing connection to complete
      while (this.connectionInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // If we now have a valid connection, return it
      if (this.irysUploader && !force) {
        const hasChanged = await this.hasWalletChanged();
        if (!hasChanged) {
          return this.irysUploader;
        }
      }
    }
    
    this.connectionInProgress = true;
    
    try {
      // First check if we have a valid connection already
      if (this.irysUploader && !force) {
        const hasChanged = await this.hasWalletChanged();
        if (!hasChanged) {
          return this.irysUploader;
        }
        // Otherwise continue to connect with new account
      }
      
      // Get the Ethereum provider
      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error('Ethereum provider not found. Please install MetaMask or another Web3 wallet.');
      }
      
      // Get accounts - first try without prompting
      let accounts;
      try {
        console.log('[irysServiceSafe] Attempting to get accounts without prompt');
        accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts && accounts.length > 0) {
          console.log('[irysServiceSafe] Found account without prompting:', accounts[0]);
        } else {
          // If no accounts, try requesting them (this will prompt user if needed)
          console.log('[irysServiceSafe] No accounts found, requesting with prompt');
          accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        }
      } catch (error) {
        console.error('[irysServiceSafe] Error getting accounts:', error);
        throw new Error('Failed to connect to wallet. Please make sure your wallet is unlocked and try again.');
      }
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No Ethereum accounts found. Please unlock your wallet and try again.');
      }
      
      const address = accounts[0];
      console.log('[irysServiceSafe] Using account for Irys connection:', address);
      
      // NEW: Save the current chain ID for network verification
      try {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('[irysServiceSafe] Using network chainId for connection:', chainId);
        sessionStorage.setItem('lastChainId', chainId);
      } catch (chainError) {
        console.warn('[irysServiceSafe] Error checking chain ID during connection:', chainError);
      }
      
      // Create a provider using the Ethereum object
      console.log('[irysServiceSafe] Creating Irys connection with WebUploader...');
      
      try {
        // Create instance on the appropriate network
        const url = this.getNodeUrl();
        console.log('[irysServiceSafe] Connecting to Irys node:', url);
        
        // UPDATED: Use ethers BrowserProvider with the EthersV6Adapter
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        console.log('[irysServiceSafe] Created ethers BrowserProvider');
        
        // Use the WebUploader with the EthersV6Adapter
        // Note: WebUploader automatically connects to the right network
        // We don't need to explicitly set the URL
        let uploader: any = await WebUploader(WebEthereum)
          .withAdapter(EthersV6Adapter(ethersProvider));

        // Log whether we're in devnet mode for debugging
        if (this.isDevnet) {
          console.log('[irysServiceSafe] Using devnet - note: explicit node URL setting is not required with WebUploader');
        } else {
          console.log('[irysServiceSafe] Using mainnet - note: explicit node URL setting is not required with WebUploader');
        }

        console.log('[irysServiceSafe] Connected successfully to Irys node');
        this.irysUploader = uploader;
        return uploader;
      } catch (readyError) {
        console.error('[irysServiceSafe] Error connecting to Irys node:', readyError);
        throw new Error(`Failed to connect to Irys: ${readyError instanceof Error ? readyError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[irysServiceSafe] Error in connectToIrys:', error);
      throw error;
    } finally {
      this.connectionInProgress = false;
    }
  }
  
  async getBalance(): Promise<string> {
    try {
      // First, verify wallet is still connected
      const walletConnected = await this.isWalletConnected();
      if (!walletConnected) {
        console.log('[irysServiceSafe] Cannot get balance, wallet not connected');
        return '0';
      }
      
      console.log('[irysServiceSafe] Getting balance for network:', this.isDevnet ? 'devnet' : 'mainnet');
      // Force a clean connection to ensure we're connected to the correct network
      const irys = await this.connectToIrys(true);
      const balance = await irys.getBalance();
      
      // Convert to string to avoid BigNumber issues
      console.log('[irysServiceSafe] Retrieved balance:', balance.toString());
      return balance.toString();
    } catch (error) {
      console.error('[irysServiceSafe] Error getting balance:', error);
      return '0';
    }
  }
  
  async fundNode(amount: string): Promise<any> {
    if (!amount) {
      throw new Error('Amount is required for funding');
    }

    try {
      // First check if wallet is connected
      const isConnected = await this.isWalletConnected();
      if (!isConnected) {
        console.error('[irysServiceSafe] Cannot fund: wallet not connected');
        throw new Error('Wallet not connected');
      }

      console.log('[irysServiceSafe] Starting fundNode with amount:', amount);

      // Connect to Irys (will reuse existing connection if possible)
      const irys = await this.connectToIrys();
      console.log('[irysServiceSafe] Connected to Irys, proceeding with funding');

      // Get the current balance for logging
      try {
        const currentBalance = await irys.getLoadedBalance();
        console.log('[irysServiceSafe] Current balance before funding:', currentBalance);
      } catch (balanceErr) {
        console.warn('[irysServiceSafe] Could not fetch current balance:', balanceErr);
      }

      // Parse the amount to the correct format
      const parsedAmount = ethers.parseEther(amount);
      console.log('[irysServiceSafe] Starting fund operation with amount:', parsedAmount.toString());

      try {
        // Try with normal options first
        const fundTx = await irys.fund(parsedAmount);
        
        console.log('[irysServiceSafe] Funding transaction submitted:', fundTx);
        return {
          status: 'success',
          message: 'Funding transaction submitted',
          tx: fundTx
        };
      } catch (fundError) {
        // Check if the error is related to transaction fee estimation
        if (fundError instanceof Error && 
            fundError.message.includes('eth_maxPriorityFeePerGas')) {
          console.error('[irysServiceSafe] Transaction fee estimation error, trying with legacy transaction type');
          
          // Try again with legacy transaction format
          const fundTx = await irys.fund(parsedAmount, {
            // Force using legacy transaction format instead of EIP-1559
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined,
            type: 0  // Legacy transaction type
          });
          
          console.log('[irysServiceSafe] Funding transaction submitted with legacy format:', fundTx);
          return {
            status: 'success',
            message: 'Funding transaction submitted with legacy format',
            tx: fundTx
          };
        } else {
          // Re-throw if it's not a transaction fee estimation error
          throw fundError;
        }
      }
    } catch (error) {
      console.error('[irysServiceSafe] Funding error:', error);
      
      // Handle specific error cases to provide better error messages
      let errorMessage = 'Unknown error during funding';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('eth_maxPriorityFeePerGas')) {
          errorMessage = 'Network fee estimation failed. Your network may not support EIP-1559 transactions.';
        } else if (errorMessage.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by the user';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds in your wallet to complete this transaction';
        }
      }
      
      throw new Error(errorMessage);
    }
  }
  
  async uploadData(
    data: string | File, 
    tags: Tag[] = []
  ): Promise<UploadResult> {
    console.log('[irysServiceSafe] Starting upload process...');
    const startTime = performance.now();
    
    try {
      // Request accounts to ensure we're connected
      console.log('[irysServiceSafe] Requesting accounts to ensure wallet connection...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Wallet not connected');
      }
      
      const account = accounts[0];
      console.log(`[irysServiceSafe] Using account for upload: ${account}`);
      
      // Add standard tags
      const allTags = [
        ...tags,
        { name: 'Content-Type', value: this.getContentType(data) },
        { name: 'App-Name', value: 'Irys Storage App' },
        { name: 'Upload-Date', value: new Date().toISOString() }
      ];
      
      // Connect to Irys
      console.log('[irysServiceSafe] Connecting to Irys for upload...');
      const irys = await this.connectToIrys();
      
      console.log(`[irysServiceSafe] Uploading data with tags:`, allTags);
      console.log(`[irysServiceSafe] Time elapsed so far: ${((performance.now() - startTime) / 1000).toFixed(3)} seconds`);
      
      // Upload the data
      console.log('[irysServiceSafe] Starting the actual upload operation...');
      let receipt;
      
      try {
        // Enable pay-as-you-go uploading by setting fundOnLoad to true
        // This will fund the transaction directly from the wallet at upload time
        const uploadOptions = { 
          tags: allTags,
          // This is the key option that enables pay-as-you-go
          fundOnLoad: true
        };
        
        if (typeof data === 'string') {
          console.log(`[irysServiceSafe] Uploading text (${data.length} characters) with pay-as-you-go`);
          receipt = await irys.upload(data, uploadOptions);
        } else {
          console.log(`[irysServiceSafe] Uploading file: ${data.name} (${data.size} bytes) with pay-as-you-go`);
          receipt = await irys.uploadFile(data, uploadOptions);
        }
      } catch (uploadError) {
        // Check if the error is related to transaction fee estimation
        if (uploadError instanceof Error && 
            uploadError.message.includes('eth_maxPriorityFeePerGas')) {
          console.error('[irysServiceSafe] Transaction fee estimation error, trying with legacy transaction type');
          
          // Try again with an explicit override for legacy transactions
          const uploadOptions = { 
            tags: allTags,
            fundOnLoad: true,
            // Force legacy transaction type
            txOptions: {
              gasPrice: undefined,
              maxFeePerGas: undefined,
              maxPriorityFeePerGas: undefined,
              type: 0  // Legacy transaction type
            }
          };
          
          if (typeof data === 'string') {
            receipt = await irys.upload(data, uploadOptions);
          } else {
            receipt = await irys.uploadFile(data, uploadOptions);
          }
        } else {
          // Re-throw if it's not a transaction fee estimation error
          throw uploadError;
        }
      }
      
      console.log(`[irysServiceSafe] Upload successful after ${((performance.now() - startTime) / 1000).toFixed(3)} seconds`);
      console.log('[irysServiceSafe] Receipt:', receipt);
      
      // Construct result
      const id = receipt.id;
      const url = `${this.getGatewayUrl()}/${id}`;
      
      return {
        id,
        url,
        receipt,
        transactionHash: id,
        explorerUrl: `${this.getExplorerUrl()}/tx/${id}`
      };
    } catch (error) {
      const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(3);
      console.error(`[irysServiceSafe] Upload error after ${timeElapsed} seconds:`, error);
      
      // Improved error handling
      let errorMessage = 'Upload failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Better user messaging for common errors
        if (errorMessage.includes('Insufficient balance')) {
          throw new Error('Insufficient funds in your wallet to cover the upload cost. The payment is made directly from your wallet.');
        }
        
        if (errorMessage.includes('eth_maxPriorityFeePerGas')) {
          throw new Error('Network fee estimation failed. Your network (Sepolia) may not fully support EIP-1559 transactions.');
        }

        if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
          throw new Error('Transaction was rejected. Please try again and approve the transaction in your wallet.');
        }
        
        if (errorMessage.includes('insufficient funds for gas')) {
          throw new Error('Your wallet does not have enough ETH to cover the gas fees for this transaction.');
        }
      }
      
      // Reset connection on any error to ensure clean state for next attempt
      this.resetConnection();
      
      throw error;
    }
  }
  
  private getContentType(data: string | File): string {
    // Handle Files
    if (data instanceof File) {
      return data.type || 'application/octet-stream';
    }
    
    // Handle strings (assume plain text if not JSON)
    try {
      JSON.parse(data);
      return 'application/json';
    } catch {
      return 'text/plain';
    }
  }
  
  async retrieveData(transactionId: string): Promise<RetrievedData> {
    try {
      // Construct gateway URL
      const gatewayUrl = `${this.getGatewayUrl()}/${transactionId}`;
      
      // Fetch the data
      const response = await fetch(gatewayUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve data: ${response.status} ${response.statusText}`);
      }
      
      // Get content type
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      // Handle different content types appropriately
      let data;
      
      if (contentType.includes('image/') || 
          contentType.includes('video/') || 
          contentType.includes('audio/') || 
          contentType.includes('application/pdf') ||
          contentType.includes('application/octet-stream')) {
        // Return as Blob for binary files
        data = await response.blob();
      } else if (contentType.includes('application/json')) {
        // Parse JSON
        data = await response.json();
      } else {
        // Get as text for all other types
        data = await response.text();
      }
      
      return {
        data,
        contentType,
        transactionId
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error retrieving data:', error);
      throw error;
    }
  }
  
  // Explicitly reset the Irys connection
  resetConnection(): void {
    console.log('[irysServiceSafe] Resetting Irys connection');
    this.irysUploader = null;
    this.lastWalletAddress = null;
    this.connectionInProgress = false;
  }
  
  setDevnet(isDevnet: boolean): void {
    this.isDevnet = isDevnet;
    // Reset the connection when changing networks
    this.resetConnection();
  }
  
  getIsDevnet(): boolean {
    return this.isDevnet;
  }

  // Add the getTransactionDetails method
  async getTransactionDetails(transactionId: string): Promise<TransactionDetails> {
    try {
      // The GraphQL endpoint
      const graphEndpoint = this.isDevnet ? 
        'https://devnet.irys.xyz/graphql' : 
        'https://node1.irys.xyz/graphql';
      
      // GraphQL query to get full transaction details
      const query = `
        query {
          transaction(id: "${transactionId}") {
            id
            timestamp
            signature
            owner {
              address
            }
            recipient
            tags {
              name
              value
            }
            fee {
              amount
              winston
            }
            quantity {
              amount
              winston
            }
            block {
              id
              height
              timestamp
            }
            verification {
              id
              address
              signature
              timestamp
              valid
            }
          }
        }
      `;
      
      const response = await fetch(graphEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction details: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL error: ${result.errors[0].message}`);
      }
      
      if (!result.data || !result.data.transaction) {
        throw new Error('Transaction not found');
      }
      
      // Format the result for our use
      const tx = result.data.transaction;
      
      return {
        transactionId: tx.id,
        transactionHash: tx.signature,
        owner: tx.owner?.address,
        timestamp: tx.timestamp,
        blockHeight: tx.block?.height,
        blockId: tx.block?.id,
        tags: tx.tags || [],
        explorerUrl: `${this.getExplorerUrl()}/tx/${tx.id}`,
        ownerExplorerUrl: tx.owner?.address ? `${this.getExplorerUrl()}/address/${tx.owner.address}` : null
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error fetching transaction details:', error);
      throw new Error(`Failed to get transaction details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance
export const irysServiceSafe = new IrysServiceSafe(); 
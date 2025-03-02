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
        
        // Get the appropriate URL based on devnet setting
        const providerUrl = this.isDevnet ? 'https://devnet.irys.xyz' : 'https://node1.irys.xyz';
        
        console.log(`[irysServiceSafe] Creating WebUploader for ${this.isDevnet ? 'devnet' : 'mainnet'}`);
        console.log(`[irysServiceSafe] Using provider URL: ${providerUrl}`);
        
        // Use the basic WebUploader with explicit adapter and URL
        const uploader = await WebUploader(WebEthereum)
          .withAdapter(EthersV6Adapter(ethersProvider))
          .withRpc(providerUrl);

        console.log(`[irysServiceSafe] Connected successfully to Irys ${this.isDevnet ? 'devnet' : 'mainnet'}`);
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
      const uploader = await this.connectToIrys();
      const atomicBalance = await uploader.getLoadedBalance();
      
      // Handle the case when balance is zero or invalid
      if (!atomicBalance || atomicBalance.toString() === '0') {
        console.log('[irysServiceSafe] Zero balance detected');
        return '0';
      }
      
      try {
        // Convert from atomic units (wei) to ETH with better error handling
        const balance = ethers.formatEther(atomicBalance);
        return balance;
      } catch (formatError) {
        console.warn('[irysServiceSafe] Error formatting balance:', formatError);
        // Return the raw balance as a string as fallback
        return atomicBalance.toString();
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }
  
  async fundNode(amount: string): Promise<any> {
    if (!amount) {
      throw new Error('Amount is required for funding');
    }

    let fundingTxHash = '';

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
      let initialBalance = '0';
      try {
        initialBalance = await irys.getLoadedBalance();
        console.log('[irysServiceSafe] Current balance before funding:', initialBalance);
      } catch (balanceErr) {
        console.warn('[irysServiceSafe] Could not fetch current balance:', balanceErr);
      }

      // Parse the amount to the correct format
      const parsedAmount = ethers.parseEther(amount);
      console.log('[irysServiceSafe] Starting fund operation with amount:', parsedAmount.toString());

      try {
        // Try with normal options first
        const fundTx = await irys.fund(parsedAmount);
        
        // Save the transaction hash for verification
        if (fundTx && fundTx.id) {
          fundingTxHash = typeof fundTx.id === 'string' ? fundTx.id : JSON.stringify(fundTx.id);
          // Save to local storage for recovery
          try {
            localStorage.setItem('last_funding_tx_hash', fundingTxHash);
            localStorage.setItem('last_funding_time', Date.now().toString());
            localStorage.setItem('last_funding_amount', amount);
          } catch (storageErr) {
            console.warn('[irysServiceSafe] Could not store funding tx info:', storageErr);
          }
        }
        
        console.log('[irysServiceSafe] Funding transaction submitted:', fundTx);
        
        // Start verifying the transaction with exponential backoff
        this.verifyFundingTransaction(fundingTxHash, initialBalance);
        
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
          
          // Save the transaction hash for verification
          if (fundTx && fundTx.id) {
            fundingTxHash = typeof fundTx.id === 'string' ? fundTx.id : JSON.stringify(fundTx.id);
            // Save to local storage for recovery
            try {
              localStorage.setItem('last_funding_tx_hash', fundingTxHash);
              localStorage.setItem('last_funding_time', Date.now().toString());
              localStorage.setItem('last_funding_amount', amount);
            } catch (storageErr) {
              console.warn('[irysServiceSafe] Could not store funding tx info:', storageErr);
            }
          }
          
          console.log('[irysServiceSafe] Funding transaction submitted with legacy format:', fundTx);
          
          // Start verifying the transaction with exponential backoff
          this.verifyFundingTransaction(fundingTxHash, initialBalance);
          
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
        } else if (errorMessage.includes('failed to post funding tx') && fundingTxHash) {
          // This is the case where the transaction was submitted successfully but verification failed
          errorMessage = `Your transaction appears to be processing (${fundingTxHash.substring(0, 8)}...). Please check your balance in a few minutes.`;
          
          // Start verification in background
          this.verifyFundingTransaction(fundingTxHash, initialBalance);
          
          // Create a more optimistic response object
          return {
            status: 'pending',
            message: 'Transaction is processing. Please check your balance later.',
            txHash: fundingTxHash
          };
        }
      }
      
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Verifies a funding transaction with exponential backoff retries
   * @param txHash The transaction hash to verify
   * @param initialBalance The initial balance before funding
   */
  private async verifyFundingTransaction(txHash: string, initialBalance: any): Promise<void> {
    if (!txHash) {
      console.warn('[irysServiceSafe] No transaction hash provided for verification');
      return;
    }
    
    console.log(`[irysServiceSafe] Starting verification for transaction ${txHash}`);
    
    const MAX_RETRIES = 8; // More retries with exponential backoff
    let attempt = 0;
    let backoffMs = 5000; // Start with 5 seconds
    
    const checkTransaction = async () => {
      if (attempt >= MAX_RETRIES) {
        console.warn(`[irysServiceSafe] Max verification attempts reached for tx ${txHash}`);
        return;
      }
      
      attempt++;
      console.log(`[irysServiceSafe] Verification attempt ${attempt}/${MAX_RETRIES} for tx ${txHash}`);
      
      try {
        // Approach 1: Check if balance increased
        const irys = await this.connectToIrys(true); // Force reconnect to get fresh balance
        const currentBalance = await irys.getLoadedBalance();
        console.log(`[irysServiceSafe] Balance check: Current=${currentBalance}, Initial=${initialBalance}`);
        
        // If balance increased, consider it successful
        if (currentBalance > initialBalance) {
          console.log(`[irysServiceSafe] Transaction verified: Balance increased from ${initialBalance} to ${currentBalance}`);
          return;
        }
        
        // Approach 2: Try to verify the transaction with the bundler
        try {
          const walletAddress = await this.getWalletAddress();
          if (!walletAddress) throw new Error('No wallet address available');
          
          // Use the node URL directly to check balance
          const nodeUrl = this.getNodeUrl();
          const url = `${nodeUrl}/account/balance/ethereum?address=${walletAddress}`;
          
          console.log(`[irysServiceSafe] Checking balance at URL: ${url}`);
          const response = await fetch(url);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`[irysServiceSafe] Balance from API: ${data}`);
            
            // If we got a successful response, consider the transaction verified
            if (data && parseInt(data) > 0) {
              console.log(`[irysServiceSafe] Transaction verified via API check`);
              return;
            }
          } else {
            console.warn(`[irysServiceSafe] API balance check failed: ${response.status}`);
          }
        } catch (apiErr) {
          console.warn(`[irysServiceSafe] Error checking balance via API:`, apiErr);
        }
        
        // Schedule next attempt with exponential backoff
        backoffMs = Math.min(backoffMs * 1.5, 60000); // Cap at 60 seconds
        setTimeout(checkTransaction, backoffMs);
        
      } catch (error) {
        console.warn(`[irysServiceSafe] Error verifying transaction:`, error);
        
        // Schedule next attempt with exponential backoff even after error
        backoffMs = Math.min(backoffMs * 1.5, 60000);
        setTimeout(checkTransaction, backoffMs);
      }
    };
    
    // Start the verification process
    setTimeout(checkTransaction, 5000); // Start with initial delay
  }
  
  /**
   * Gets the current wallet address if available
   */
  private async getWalletAddress(): Promise<string | null> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) return null;
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) return null;
      
      return accounts[0];
    } catch (error) {
      console.warn('[irysServiceSafe] Error getting wallet address:', error);
      return null;
    }
  }
  
  /**
   * Checks the wallet connection status and network information
   * @returns An object with connection status details
   */
  async checkWalletConnectionStatus(): Promise<{
    isConnected: boolean;
    chainId?: string; 
    chainName?: string;
    account?: string;
    isCorrectNetwork: boolean;
    error?: string;
  }> {
    try {
      // Check if ethereum provider exists
      const provider = (window as any).ethereum;
      if (!provider) {
        return {
          isConnected: false,
          isCorrectNetwork: false,
          error: 'No Ethereum provider found. Please install MetaMask.'
        };
      }

      // Get current accounts
      const accounts = await provider.request({ method: 'eth_accounts' });
      const isConnected = accounts && accounts.length > 0;
      
      if (!isConnected) {
        return {
          isConnected: false,
          isCorrectNetwork: false,
          error: 'Wallet not connected. Please connect your wallet.'
        };
      }

      // Get chain ID and determine if it's Sepolia
      const chainId = await provider.request({ method: 'eth_chainId' });
      const isCorrectNetwork = chainId === '0xaa36a7'; // Sepolia chain ID
      
      // Determine chain name
      let chainName = 'Unknown Network';
      if (chainId === '0xaa36a7') chainName = 'Sepolia Testnet';
      else if (chainId === '0x1') chainName = 'Ethereum Mainnet';
      else if (chainId === '0x5') chainName = 'Goerli Testnet';
      else if (chainId === '0x13881') chainName = 'Polygon Mumbai';
      
      return {
        isConnected,
        chainId,
        chainName,
        account: accounts[0],
        isCorrectNetwork
      };
    } catch (error: any) {
      console.error('Error checking wallet status:', error);
      return {
        isConnected: false,
        isCorrectNetwork: false,
        error: `Error checking wallet: ${error.message}`
      };
    }
  }
  
  /**
   * Uploads data to the Irys network
   * @param data The data to upload
   * @param tags The tags to attach to the upload
   * @returns The transaction ID of the upload
   */
  async uploadData(data: File | Uint8Array | string, tags: Tag[] = []): Promise<UploadResult> {
    try {
      // Make sure we're connected to Irys
      const uploader = await this.connectToIrys();
      
      // Check if we're on the Sepolia network (chainId 11155111 or 0xaa36a7)
      const provider = (window as any).ethereum;
      if (provider) {
        const chainId = await provider.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);
        
        // Check if we're on Sepolia (11155111 decimal = 0xaa36a7 hex)
        if (chainId !== '0xaa36a7') {
          throw new Error('Please connect to the Sepolia network (Chain ID: 11155111) to upload files.');
        }
      }
      
      // If data is a string, convert it to a Uint8Array
      let dataToUpload: Uint8Array | Buffer;
      if (typeof data === 'string') {
        // Use Buffer to ensure compatibility with the irys uploader
        dataToUpload = Buffer.from(data, 'utf-8');
      } else if (data instanceof File) {
        // If data is a File, read it as an ArrayBuffer and convert to Buffer
        const arrayBuffer = await data.arrayBuffer();
        dataToUpload = Buffer.from(arrayBuffer);
      } else {
        // If data is already a Uint8Array, convert to Buffer to ensure compatibility
        dataToUpload = Buffer.from(data);
      }
      
      // Add file size tag if uploading a File
      if (data instanceof File) {
        tags.push({ name: "Content-Length", value: data.size.toString() });
        tags.push({ name: "Content-Type", value: data.type || "application/octet-stream" });
        
        // Add a file upload timestamp
        tags.push({ name: "Upload-Timestamp", value: new Date().toISOString() });
        tags.push({ name: "Network", value: "Sepolia" });
      }
      
      // Add content type for text uploads if not specified
      if (typeof data === 'string' && !tags.some(tag => tag.name.toLowerCase() === 'content-type')) {
        tags.push({ name: "Content-Type", value: "text/plain" });
      }
      
      // Filter out any tags with empty names or values
      const validTags = tags.filter(tag => tag.name && tag.value);
      
      console.log('Starting upload with tags:', validTags);
      
      try {
        // Attempt upload with the default transaction parameters
        const receipt = await uploader.upload(dataToUpload, {
          tags: validTags
        });
        
        console.log('Upload successful:', receipt);
        
        // Create a proper UploadResult object
        const txId = receipt.id;
        const gatewayUrl = this.isDevnet 
          ? `https://gateway.irys.xyz/devnet/${txId}`
          : `https://gateway.irys.xyz/${txId}`;
          
        const explorerUrl = this.isDevnet 
          ? `https://explorer.irys.xyz/devnet/tx/${txId}`
          : `https://explorer.irys.xyz/tx/${txId}`;
          
        return {
          id: txId,
          url: gatewayUrl,
          receipt: receipt,
          transactionHash: receipt.id,
          explorerUrl: explorerUrl
        };
      } catch (uploadError: any) {
        console.error('Upload error:', uploadError);
        
        // Check for specific error types and provide better error messages
        if (uploadError.message && uploadError.message.includes('insufficient funds')) {
          throw new Error('Insufficient funds in your wallet to complete this upload. Please add more Sepolia ETH.');
        }
        
        if (uploadError.message && uploadError.message.includes('fee estimation')) {
          console.log('Fee estimation error, attempting with legacy transaction type...');
          
          // Try again with legacy transaction type
          try {
            const receipt = await uploader.upload(dataToUpload, {
              tags: validTags,
              options: {
                // Force legacy transaction type
                txType: 0
              }
            });
            
            console.log('Upload successful with legacy transaction:', receipt);
            
            // Create a proper UploadResult object for legacy uploads
            const txId = receipt.id;
            const gatewayUrl = this.isDevnet 
              ? `https://gateway.irys.xyz/devnet/${txId}`
              : `https://gateway.irys.xyz/${txId}`;
              
            const explorerUrl = this.isDevnet 
              ? `https://explorer.irys.xyz/devnet/tx/${txId}`
              : `https://explorer.irys.xyz/tx/${txId}`;
              
            return {
              id: txId,
              url: gatewayUrl,
              receipt: receipt,
              transactionHash: receipt.id,
              explorerUrl: explorerUrl
            };
          } catch (legacyError: any) {
            console.error('Legacy upload error:', legacyError);
            throw new Error(`Upload failed: ${legacyError.message || 'Unknown error with legacy transaction'}`);
          }
        }
        
        if (uploadError.message && uploadError.message.includes('user rejected')) {
          throw new Error('Transaction rejected by user. Please try again and confirm the transaction in your wallet.');
        }
        
        // Default error handling
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error during upload'}`);
      }
    } catch (error: any) {
      console.error('Upload process error:', error);
      throw error;
    }
  }
  
  async retrieveData(transactionId: string | any): Promise<RetrievedData> {
    try {
      // Clean and validate the transaction ID
      if (!transactionId) {
        throw new Error('Transaction ID is required for data retrieval');
      }
      
      // Handle potential [object Object] issue by extracting a clean ID
      let cleanId = String(transactionId);
      if (typeof transactionId === 'object' && transactionId !== null) {
        console.warn('[irysServiceSafe] Received object instead of string for transaction ID:', transactionId);
        // Try to extract ID from object
        if ('id' in transactionId && transactionId.id) {
          cleanId = String(transactionId.id);
        } else {
          // Convert to string and clean up
          cleanId = JSON.stringify(transactionId).replace(/[{}"]/g, '');
          if (cleanId === '[object Object]' || cleanId === 'objectObject') {
            throw new Error('Invalid transaction ID format: object reference without id property');
          }
        }
      }
      
      // Remove any extra whitespace, brackets, quotes
      cleanId = cleanId.toString().trim().replace(/[\[\]{}"\s]/g, '');
      
      // Construct gateway URL
      const gatewayUrl = `${this.getGatewayUrl()}/${cleanId}`;
      console.log('[irysServiceSafe] Retrieving data from URL:', gatewayUrl);
      
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
        transactionId: cleanId // Return the cleaned ID
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

  /**
   * Request tokens from the Irys devnet faucet
   * This will only work on devnet and helps users upload larger files without manual funding
   */
  async requestDevnetTokens(walletAddress: string): Promise<boolean> {
    if (!this.isDevnet) {
      console.warn('[irysServiceSafe] Token faucet only available on devnet');
      return false;
    }
    
    if (!walletAddress) {
      console.error('[irysServiceSafe] Wallet address required for faucet request');
      return false;
    }
    
    try {
      console.log(`[irysServiceSafe] Requesting tokens from devnet faucet for ${walletAddress}`);
      
      // The Irys devnet faucet endpoint - updated URL to avoid DNS resolution issues
      const faucetUrl = 'https://devnet.irys.xyz/faucet/fund';
      
      console.log(`[irysServiceSafe] Using faucet URL: ${faucetUrl}`);
      
      const response = await fetch(faucetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: walletAddress,
          chain: "ethereum"
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[irysServiceSafe] Faucet request failed: ${response.status} ${errorText}`);
        return false;
      }
      
      const result = await response.json();
      console.log('[irysServiceSafe] Faucet request successful:', result);
      return true;
    } catch (error) {
      console.error('[irysServiceSafe] Error requesting tokens from faucet:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const irysServiceSafe = new IrysServiceSafe(); 
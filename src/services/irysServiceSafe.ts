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
    // Use a working gateway URL
    return 'https://gateway.irys.xyz';
  }
  
  // Try multiple gateways to maximize chances of retrieval
  getAccessibleGatewayUrls(transactionId: string): string[] {
    const urls = [];
    
    // Add direct gateway URLs - try both with and without network prefix
    urls.push(`https://gateway.irys.xyz/${transactionId}`);
    
    // Try with network-specific paths
    if (this.isDevnet) {
      urls.push(`https://gateway.irys.xyz/devnet/${transactionId}`);
    } else {
      urls.push(`https://gateway.irys.xyz/mainnet/${transactionId}`);
    }
    
    // Add explorer URLs - both standard and direct
    urls.push(`https://storage-explorer.irys.xyz/tx/${transactionId}`);
    
    // Add Arweave gateway as fallback for Irys transactions
    urls.push(`https://arweave.net/${transactionId}`);
    
    // Always add both with and without network prefix as fallbacks
    urls.push(`https://gateway.irys.xyz/mainnet/${transactionId}`);
    urls.push(`https://gateway.irys.xyz/devnet/${transactionId}`);
    
    console.log(`[irysServiceSafe] Gateway URLs for ${transactionId}:`, urls);
    return urls;
  }
  
  getNodeUrl(): string {
    // Use a working testnet node URL
    return 'https://devnet.irys.xyz';
  }
  
  getExplorerUrl(): string {
    // Use a working explorer URL
    return 'https://explorer.irys.xyz';
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
      
      // Check if we're on the IRYS Testing Network
      let isIrysTestingNetwork = false;
      try {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('[irysServiceSafe] Using network chainId for connection:', chainId);
        sessionStorage.setItem('lastChainId', chainId);
        
        // If we're on the IRYS Testing Network (chainId 0x4f6), use special configuration
        isIrysTestingNetwork = chainId === '0x4f6';
        if (isIrysTestingNetwork) {
          console.log('[irysServiceSafe] Detected IRYS Testing Network (chain 0x4f6)');
        }
      } catch (chainError) {
        console.warn('[irysServiceSafe] Error checking chain ID during connection:', chainError);
      }
      
      // Create a provider using the Ethereum object
      console.log('[irysServiceSafe] Creating Irys connection with WebUploader...');
      
      try {
        // UPDATED: Use ethers BrowserProvider with the EthersV6Adapter
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        console.log('[irysServiceSafe] Created ethers BrowserProvider');
        
        // Get the appropriate URL based on network
        let providerUrl;
        if (isIrysTestingNetwork) {
          providerUrl = 'https://testnet-rpc.irys.xyz/v1/execution-rpc';
        } else {
          providerUrl = this.isDevnet ? 'https://devnet.irys.xyz' : 'https://node1.irys.xyz';
        }
        
        console.log(`[irysServiceSafe] Creating WebUploader for ${isIrysTestingNetwork ? 'IRYS Testing Network' : (this.isDevnet ? 'devnet' : 'mainnet')}`);
        console.log(`[irysServiceSafe] Using provider URL: ${providerUrl}`);
        
        // Create uploader with appropriate configuration
        const uploader = await WebUploader(WebEthereum)
          .withAdapter(EthersV6Adapter(ethersProvider))
          .withRpc(providerUrl);

        // Add special handling for IRYS Testing Network balances
        if (isIrysTestingNetwork) {
          console.log('[irysServiceSafe] Using IRYS Testing Network - implementing special balance handling');
          // Custom implementation to handle testing network balance check
          const originalGetBalance = uploader.getBalance;
          uploader.getBalance = async function(address?: string) {
            try {
              // Try the default method first
              const balance = await originalGetBalance.call(this, address);
              console.log('[irysServiceSafe] Default balance check returned:', balance.toString());
              
              // If balance is zero but we're on IRYS Testing Network, double-check with the wallet
              if (balance.toString() === '0') {
                console.log('[irysServiceSafe] Zero balance detected, checking with wallet directly');
                try {
                  const walletAddress = address || await ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => accounts[0]);
                  if (!walletAddress) {
                    console.warn('[irysServiceSafe] No wallet address available for balance check');
                    return balance;
                  }
                  
                  const walletBalance = await ethereum.request({
                    method: 'eth_getBalance',
                    params: [walletAddress, 'latest']
                  });
                  
                  if (walletBalance && walletBalance !== '0x0') {
                    console.log('[irysServiceSafe] Wallet reports non-zero balance, using that instead:', walletBalance);
                    // Create a BigNumber with the same type as the original balance
                    // This ensures we return the correct type
                    return balance.constructor(walletBalance.toString());
                  }
                } catch (walletErr) {
                  console.error('[irysServiceSafe] Error checking wallet balance:', walletErr);
                }
              }
              
              return balance;
            } catch (error) {
              console.error('[irysServiceSafe] Error in getBalance:', error);
              throw error;
            }
          };
        }
        
        console.log(`[irysServiceSafe] Connected successfully to ${isIrysTestingNetwork ? 'IRYS Testing Network' : (this.isDevnet ? 'Irys devnet' : 'Irys mainnet')}`);
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
      // First check if the wallet is connected to the IRYS Testing Network
      const walletStatus = await this.checkWalletConnectionStatus();
      console.log('[irysServiceSafe] Checking balance - current network:', walletStatus.chainName, 'chain ID:', walletStatus.chainId);
      
      // For IRYS Testing Network (0x4f6), we need to handle balance differently
      const isIrysNetwork = walletStatus.chainId === '0x4f6';
      if (isIrysNetwork) {
        console.log('[irysServiceSafe] Detected IRYS Testing Network, using specialized balance check');
        // On the IRYS network, the token is native so should use the provider directly
        
        try {
          if (!window.ethereum || !walletStatus.account) {
            console.warn('[irysServiceSafe] Wallet not properly connected for IRYS network balance check');
            return '0';
          }
          
          // For IRYS network, use standard eth_getBalance call
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [walletStatus.account, 'latest']
          });
          
          if (!balance) {
            console.log('[irysServiceSafe] No balance returned from IRYS network');
            return '0';
          }
          
          // Convert hex balance to decimal string
          const decimalBalance = BigInt(balance).toString();
          
          // Format to ETH equivalent (with 18 decimals)
          try {
            const formattedBalance = ethers.formatEther(decimalBalance);
            console.log('[irysServiceSafe] IRYS network balance:', formattedBalance);
            return formattedBalance;
          } catch (formatError) {
            console.warn('[irysServiceSafe] Error formatting IRYS balance:', formatError);
            return decimalBalance;
          }
        } catch (irysBalanceError) {
          console.error('[irysServiceSafe] Error getting IRYS network balance:', irysBalanceError);
          return '0';
        }
      }
      
      // Regular balance check for other networks using the uploader
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
          this.verifyFundingTransaction(fundingTxHash, '0'); // Using a default value instead of initialBalance
          
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
      if (!window.ethereum) {
        return {
          isConnected: false,
          isCorrectNetwork: false,
          error: 'MetaMask not detected. Please install MetaMask to continue.'
        };
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Check if we have at least one account
      const isConnected = accounts && accounts.length > 0;
      
      // Determine network name
      let chainName = 'Unknown Network';
      if (chainId) {
        if (chainId === '0x1') chainName = 'Ethereum Mainnet';
        else if (chainId === '0xaa36a7') chainName = 'Sepolia Testnet';
        else if (chainId === '0x4f6') chainName = 'IRYS Testing Network';
        else chainName = `Unknown Network (${chainId})`;
      }
      
      // All these networks are considered valid for IRYS token operations
      // Include 0x4f6 as a valid chain ID for IRYS token operations
      const validNetworks = ['0xaa36a7', '0x1', '0x4f6']; 
      const isCorrectNetwork = validNetworks.includes(chainId);

      return {
        isConnected,
        chainId,
        chainName,
        account: isConnected ? accounts[0] : undefined,
        isCorrectNetwork
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error checking wallet status:', error);
      return {
        isConnected: false,
        isCorrectNetwork: false,
        error: error instanceof Error ? error.message : 'Unknown error checking wallet connection'
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
      
      // Filter out invalid tags
      const validTags = tags.filter(tag => tag.name && tag.value);
      
      // Add Token tag if not present
      if (!validTags.some(tag => tag.name === 'Token')) {
        validTags.push({ name: 'Token', value: 'IRYS' });
      }
      
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
      
      // Fetch transaction tags before trying to get the data
      let tags: Tag[] = [];
      try {
        // First try to get transaction details from the node
        const txDetails = await this.getTransactionDetails(cleanId);
        if (txDetails && txDetails.tags) {
          tags = txDetails.tags;
          console.log('[irysServiceSafe] Retrieved transaction tags:', tags);
        }
      } catch (tagsError) {
        console.warn('[irysServiceSafe] Could not fetch transaction tags:', tagsError);
        // Continue with the data retrieval even if tags couldn't be fetched
        
        // Try to deduce the network from the transaction ID format
        // This is a fallback approach when we can't get tags
        if (cleanId.length === 43) {
          console.log('[irysServiceSafe] Transaction ID appears to be an Arweave/Irys ID');
          // Add a placeholder Network tag for UI display
          tags.push({ name: 'Network', value: 'IRYS Testnet' });
        }
      }
      
      // Find content-type from tags - this is the most reliable source
      let contentType = 'application/octet-stream';
      const contentTypeTag = tags.find(tag => 
        tag.name.toLowerCase() === 'content-type' || 
        tag.name === 'Content-Type'
      );
      
      if (contentTypeTag && contentTypeTag.value) {
        contentType = contentTypeTag.value;
        console.log(`[irysServiceSafe] Found content type in tags: ${contentType}`);
      }
      
      // Try storage explorer first as it's more reliable
      const storageExplorerUrl = `https://storage-explorer.irys.xyz/tx/${cleanId}`;
      console.log('[irysServiceSafe] Trying storage explorer URL first:', storageExplorerUrl);
      
      try {
        // Use no-cors mode to avoid CORS issues, but this will make content unreadable
        // We'll try regular fetch with gateways instead as our primary approach
        const response = await fetch(storageExplorerUrl, { mode: 'no-cors' });
        
        // With no-cors mode, we can't read the response content
        // Let's skip this and move directly to the gateways
        console.log('[irysServiceSafe] Storage explorer fetch status:', response.status);
      } catch (corsError) {
        console.warn('[irysServiceSafe] Could not fetch from storage explorer:', corsError);
      }
      
      // Get all possible gateway URLs to try
      const gatewayUrls = this.getAccessibleGatewayUrls(cleanId);
      
      let firstError = null;
      
      // Try each gateway URL in sequence
      for (const gatewayUrl of gatewayUrls) {
        try {
          console.log('[irysServiceSafe] Trying gateway URL:', gatewayUrl);
          
          // Try to fetch from gateway
          const response = await fetch(gatewayUrl);
          if (!response.ok) {
            console.warn(`[irysServiceSafe] Gateway response error for ${gatewayUrl}: ${response.status} ${response.statusText}`);
            if (!firstError) {
              firstError = new Error(`HTTP ${response.status} from ${gatewayUrl}`);
            }
            continue; // Try next URL
          }
          
          // Get the content type from headers as a fallback, but prioritize tag-based content type
          const headerContentType = response.headers.get('content-type');
          let effectiveContentType = contentType;
          
          if (!contentTypeTag && headerContentType) {
            // Only use header content type if we didn't find it in tags
            effectiveContentType = headerContentType;
            console.log(`[irysServiceSafe] Using content type from headers: ${effectiveContentType}`);
          }
          
          console.log(`[irysServiceSafe] Effective content type: ${effectiveContentType}`);
          
          // For application/octet-stream, we need to check if it might be text
          // This type is often a generic fallback and doesn't tell us much about the actual content
          if (effectiveContentType === 'application/octet-stream') {
            // For small responses, get as arrayBuffer to analyze
            const buffer = await response.clone().arrayBuffer();
            
            if (this.detectIfContentMightBeText(buffer)) {
              console.log('[irysServiceSafe] Detected text content in application/octet-stream');
              
              // It's likely text content, so read it as text
              const textData = await response.text();
              
              // Test a small sample to confirm it's actually text
              const sampleText = textData.substring(0, 100);
              console.log(`[irysServiceSafe] Text sample: ${sampleText}`);
              
              // If over 85% of the characters are printable, consider it text/plain
              const printableChars = sampleText.replace(/[^\x20-\x7E\r\n\t]/g, '').length;
              const ratio = printableChars / sampleText.length;
              
              if (ratio > 0.85) {
                effectiveContentType = 'text/plain';
                console.log('[irysServiceSafe] Setting content type to text/plain based on content analysis');
              }
              
              return {
                data: textData,
                contentType: effectiveContentType,
                transactionId: cleanId,
                tags: tags,
                fileName: `file-${cleanId.substring(0, 8)}.txt`,
                size: textData.length
              };
            }
          }
          
          // Decide how to handle the response based on content type
          if (effectiveContentType.startsWith('text/') || 
              effectiveContentType === 'application/json' ||
              effectiveContentType === 'application/javascript' ||
              effectiveContentType === 'application/xml' ||
              effectiveContentType.includes('+json') ||
              effectiveContentType.includes('+xml')) {
            // These are definitely text formats
            const textData = await response.text();
            
            // Determine file extension based on content type
            let extension = 'txt';
            if (effectiveContentType === 'application/json' || effectiveContentType.includes('+json')) {
              extension = 'json';
            } else if (effectiveContentType === 'application/xml' || effectiveContentType.includes('+xml')) {
              extension = 'xml';
            } else if (effectiveContentType.includes('javascript')) {
              extension = 'js';
            } else if (effectiveContentType.includes('html')) {
              extension = 'html';
            } else if (effectiveContentType.includes('css')) {
              extension = 'css';
            }
            
            return {
              data: textData,
              contentType: effectiveContentType,
              transactionId: cleanId,
              tags: tags,
              fileName: `file-${cleanId.substring(0, 8)}.${extension}`,
              size: textData.length
            };
          } else if (effectiveContentType.includes('image/') || 
                    effectiveContentType.includes('video/') || 
                    effectiveContentType.includes('audio/') ||
                    effectiveContentType.includes('application/pdf')) {
            // These are definitely binary formats
            const blobData = await response.blob();
            
            // Determine file extension based on content type
            let extension = 'bin';
            if (effectiveContentType.includes('image/')) {
              extension = effectiveContentType.replace('image/', '');
            } else if (effectiveContentType.includes('video/')) {
              extension = effectiveContentType.replace('video/', '');
            } else if (effectiveContentType.includes('audio/')) {
              extension = effectiveContentType.replace('audio/', '');
            } else if (effectiveContentType.includes('application/pdf')) {
              extension = 'pdf';
            }
            
            return {
              data: blobData,
              contentType: effectiveContentType,
              transactionId: cleanId,
              tags: tags,
              fileName: `file-${cleanId.substring(0, 8)}.${extension}`,
              size: blobData.size
            };
          } else {
            // For ambiguous types, get as arrayBuffer to analyze
            const buffer = await response.arrayBuffer();
            
            // Check if this might be a text file
            const mightBeText = this.detectIfContentMightBeText(buffer);
            
            if (mightBeText) {
              // Convert to text if it looks like text content
              const decoder = new TextDecoder('utf-8');
              const textData = decoder.decode(buffer);
              
              // Return as text with the most appropriate content type
              return {
                data: textData,
                contentType: effectiveContentType === 'application/octet-stream' ? 'text/plain' : effectiveContentType,
                transactionId: cleanId,
                tags: tags,
                fileName: `file-${cleanId.substring(0, 8)}.txt`,
                size: textData.length
              };
            } else {
              // Return as blob for binary content
              const blobData = new Blob([buffer], { type: effectiveContentType });
              return {
                data: blobData,
                contentType: effectiveContentType,
                transactionId: cleanId,
                tags: tags,
                fileName: `file-${cleanId.substring(0, 8)}.bin`,
                size: blobData.size
              };
            }
          }
        } catch (gatewayError) {
          console.warn(`[irysServiceSafe] Error with gateway ${gatewayUrl}:`, gatewayError);
          if (!firstError) {
            firstError = gatewayError;
          }
          // Continue to next gateway URL
        }
      }
      
      // If all gateway URLs fail, create a meaningful fallback response
      console.error('[irysServiceSafe] All gateway URLs failed, using fallback', firstError);
      
      // Instead of creating an error message, return null to indicate no data found
      // This will allow the UI to display a simple "No results found" message
      return {
        data: null,
        contentType: '',  // Use empty string instead of null
        transactionId: cleanId,
        directUrl: storageExplorerUrl,
        tags: tags,
        fileName: '',  // Use empty string instead of null
        size: 0
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error retrieving data:', error);
      
      // Return null for any error to simplify error handling in the UI
      return {
        data: null,
        contentType: '',  // Use empty string instead of null
        transactionId: typeof transactionId === 'string' ? transactionId : String(transactionId),
        directUrl: `https://storage-explorer.irys.xyz/tx/${transactionId}`,
        tags: [],
        fileName: '',  // Use empty string instead of null
        size: 0
      };
    }
  }
  
  // Helper to detect if content might be text based on examining binary data
  private detectIfContentMightBeText(buffer: ArrayBuffer): boolean {
    // Skip if buffer is empty
    if (!buffer || buffer.byteLength === 0) {
      return false;
    }
    
    // Only examine the first 1024 bytes (increased from 512)
    const bytesToCheck = Math.min(buffer.byteLength, 1024);
    const view = new Uint8Array(buffer, 0, bytesToCheck);
    
    // Count of printable ASCII characters (32-126) and common whitespace chars
    let printableCount = 0;
    let nonPrintableCount = 0;
    let nullCount = 0;
    
    // Check for UTF-8 BOM marker at the start (EF BB BF)
    const hasUtf8Bom = bytesToCheck >= 3 && 
                       view[0] === 0xEF && 
                       view[1] === 0xBB && 
                       view[2] === 0xBF;
    
    // If it has a UTF-8 BOM, it's definitely text
    if (hasUtf8Bom) {
      console.log('[irysServiceSafe] Detected UTF-8 BOM marker, content is text');
      return true;
    }
    
    // Check for common text file patterns
    // Look for repeated line endings or standard formatting
    let crlfCount = 0;
    let lfCount = 0;
    let spacesCount = 0;
    
    for (let i = 0; i < bytesToCheck; i++) {
      const byte = view[i];
      
      // Count null bytes (common in binary files)
      if (byte === 0) {
        nullCount++;
        continue;
      }
      
      // Printable ASCII range plus common whitespace/control chars
      if ((byte >= 32 && byte <= 126) || // Printable ASCII
          byte === 9 || // Tab
          byte === 10 || // LF
          byte === 13) { // CR
        printableCount++;
        
        // Count line endings
        if (byte === 10) lfCount++;
        if (byte === 13 && i + 1 < bytesToCheck && view[i + 1] === 10) crlfCount++;
        
        // Count spaces (common in formatted text)
        if (byte === 32) spacesCount++;
      } else {
        nonPrintableCount++;
      }
    }
    
    // If we have very few bytes, be conservative about declaring it text
    if (bytesToCheck < 10) {
      return false;
    }
    
    // Quick exit for binary files with lots of null bytes (>5%)
    const nullRatio = nullCount / bytesToCheck;
    if (nullRatio > 0.05) {
      console.log(`[irysServiceSafe] High null byte ratio (${(nullRatio * 100).toFixed(2)}%), likely binary`);
      return false;
    }
    
    // Calculate the ratio of printable to total characters
    const ratio = printableCount / bytesToCheck;
    console.log(`[irysServiceSafe] Text detection: ${(ratio * 100).toFixed(2)}% printable characters`);
    
    // Higher confidence if we see line breaks or formatted text patterns
    if ((lfCount > 0 || crlfCount > 0) && spacesCount > 0) {
      console.log(`[irysServiceSafe] Detected ${lfCount} LF line breaks, ${crlfCount} CRLF line breaks`);
      // If we have some line breaks and spaces, lower the printable threshold
      return ratio > 0.75;
    }
    
    // Text files typically have high ratios of printable characters
    // Using 0.9 (90%) as a stricter threshold
    return ratio > 0.9;
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
      // Make sure transactionId is properly formatted
      transactionId = transactionId.trim();
      
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }
      
      // Try multiple endpoints to get transaction details
      const endpoints = [
        // Node URL (for current transactions)
        `${this.getNodeUrl()}/tx/${transactionId}`,
        // Alternative node (for compatibility)
        `https://devnet.irys.xyz/tx/${transactionId}`,
        // Try explorer API as fallback
        `https://explorer.irys.xyz/api/transactions/${transactionId}`
      ];
      
      let response = null;
      let data = null;
      let errorMessage = '';
      
      // Try each endpoint until we get a successful response
      for (const url of endpoints) {
        try {
          console.log(`[irysServiceSafe] Trying to fetch transaction details from: ${url}`);
          const res = await fetch(url);
          if (res.ok) {
            response = res;
            break;
          } else {
            errorMessage += `${url}: ${res.status} ${res.statusText}; `;
          }
        } catch (e) {
          errorMessage += `${url}: ${e}; `;
          console.warn(`[irysServiceSafe] Error fetching from ${url}:`, e);
        }
      }
      
      if (!response) {
        throw new Error(`Failed to fetch transaction details: ${errorMessage}`);
      }
      
      data = await response.json();
      
      // Extract tags, handling different API response formats
      const tags = data.tags ? data.tags.map((tag: { name: string, value: string }) => ({
        name: tag.name,
        value: tag.value
      })) : [];
      
      // Check if this is an IRYS token transaction by looking for specific tags
      const isIrysTokenTransaction = tags.some(
        (tag: { name: string, value: string }) => (tag.name === 'Token' && tag.value === 'IRYS') || 
               (tag.name === 'useTokenPayment' && tag.value === 'true') ||
               (tag.name === 'token' && tag.value === 'irys-token')
      );
      
      // If this is an IRYS token transaction but doesn't have the Token:IRYS tag, add it
      let updatedTags = [...tags];
      if (isIrysTokenTransaction && !tags.some((tag: { name: string, value: string }) => tag.name === 'Token' && tag.value === 'IRYS')) {
        updatedTags.push({ name: 'Token', value: 'IRYS' });
      }
      
      // We need to handle both formats of transaction data
      const timestamp = data.timestamp || data.block?.timestamp || null;
      const ownerAddress = data.owner?.address || data.owner;
      
      let ownerExplorerUrl = null;
      if (ownerAddress) {
        ownerExplorerUrl = this.isDevnet
          ? null // No explorer for devnet
          : `${this.getExplorerUrl()}/address/${ownerAddress}`;
      }
      
      const details: TransactionDetails = {
        transactionId: data.id,
        transactionHash: data.tokenId || data.tokenReceipt,
        owner: ownerAddress,
        timestamp: timestamp ? Number(timestamp) * 1000 : undefined, // Convert to ms or undefined instead of null
        blockHeight: data.block?.height,
        blockId: data.block?.id,
        tags: updatedTags,
        explorerUrl: `${this.getExplorerUrl()}/tx/${data.id}`,
        ownerExplorerUrl
      };
      
      return details;
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
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
      
      // The Irys devnet faucet endpoint
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
      
      // Check response status
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[irysServiceSafe] Devnet faucet error:', errorText);
        throw new Error(`Devnet faucet request failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('[irysServiceSafe] Devnet token request successful:', result);
      
      // Wait a few seconds for the node to register the tokens
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return true;
    } catch (error) {
      console.error('[irysServiceSafe] Error requesting devnet tokens:', error);
      throw error;
    }
  }

  /**
   * Get Irys testnet tokens for testing purposes
   * These are free tokens that can be used on the testnet for uploads
   */
  async getIrysTestnetTokens(): Promise<any> {
    console.log('[irysServiceSafe] Requesting IRYS testnet tokens');
    
    try {
      // Make sure wallet is connected
      const walletStatus = await this.checkWalletConnectionStatus();
      if (!walletStatus.isConnected) {
        throw new Error('Wallet not connected. Please connect your wallet to get IRYS tokens.');
      }
      
      console.log('[irysServiceSafe] Request tokens for wallet:', walletStatus.account);
      
      // Get the wallet address
      const address = walletStatus.account;
      if (!address) {
        throw new Error('Could not get wallet address');
      }
      
      // If in devnet mode, use the devnet faucet
      if (this.isDevnet) {
        console.log('[irysServiceSafe] Using devnet faucet for token request');
        const initialBalance = await this.getBalance();
        const success = await this.requestDevnetTokens(address);
        
        if (!success) {
          throw new Error('Failed to get tokens from devnet faucet');
        }
        
        // Check the new balance
        const newBalance = await this.getBalance();
        console.log('[irysServiceSafe] New balance after devnet request:', newBalance);
        
        return {
          success: true,
          message: 'Successfully requested tokens from devnet faucet',
          initialBalance,
          newBalance
        };
      }
      
      // Connect to Irys with current wallet
      console.log('[irysServiceSafe] Connecting to Irys to request tokens');
      await this.connectToIrys(true);
      
      console.log('[irysServiceSafe] Making token request to faucet API');
      
      try {
        // First check the current balance
        const initialBalance = await this.getBalance();
        console.log('[irysServiceSafe] Initial balance before request:', initialBalance);
        
        // Build the request to the faucet API
        // Special case for chainId 0x4f6 which should use the correct token faucet
        const chainId = walletStatus.chainId || '';
        const isForcedIrysNetwork = chainId === '0x4f6';
        
        // Use a direct IRYS faucet URL that works better
        const faucetUrl = 'https://irys-faucet.xyz/api/claim';
        
        // Make the request to the faucet API
        const response = await fetch(faucetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: address,
            network: isForcedIrysNetwork ? 'arweave' : 'ethereum',
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[irysServiceSafe] Faucet response error:', errorText);
          throw new Error(`Faucet request failed: ${response.status}. Please try again later or get IRYS tokens from another source.`);
        }
        
        const result = await response.json();
        console.log('[irysServiceSafe] Token request successful:', result);
        
        // Wait for a moment for the tokens to be credited
        console.log('[irysServiceSafe] Waiting for tokens to be credited...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check the new balance
        const newBalance = await this.getBalance();
        console.log('[irysServiceSafe] New balance after request:', newBalance);
        
        // Return success with balance info
        return {
          success: true,
          message: 'Successfully requested IRYS tokens.',
          initialBalance,
          newBalance,
          result
        };
      } catch (error) {
        console.error('[irysServiceSafe] Error requesting tokens from faucet:', error);
        throw new Error('Failed to request tokens from faucet. Please try again later or try using the MetaMask browser extension to visit the IRYS faucet directly.');
      }
    } catch (error) {
      console.error('[irysServiceSafe] Token request error:', error);
      throw error instanceof Error ? error : new Error('Unknown error requesting tokens');
    }
  }

  /**
   * Upload data directly with IRYS tokens (L1 transaction)
   * @param data The data to upload
   * @param tags Optional tags to attach to the upload
   * @returns The upload result
   */
  async uploadWithIrysTokens(data: any, tags: Tag[] = []): Promise<UploadResult> {
    try {
      console.log("[irysServiceSafe] Starting upload with Irys testnet tokens");

      // Verify wallet connection
      const isConnected = await this.isWalletConnected();
      console.log("[irysServiceSafe] Wallet connection check:", isConnected ? "Connected" : "Not connected");
      if (!isConnected) {
        throw new Error("Wallet is not connected. Please connect your wallet first.");
      }

      // Get wallet address
      const account = await this.getWalletAddress();
      console.log("[irysServiceSafe] Connected account:", account);
      if (!account) {
        throw new Error("Could not detect connected wallet address.");
      }

      // Get chain ID
      const chainId = await this.getChainId();
      console.log("[irysServiceSafe] Current chainId:", chainId);
      
      // Check for IRYS Testing Network - chainId 0x4f6
      const isIrysTestnet = chainId === '0x4f6';
      
      if (isIrysTestnet) {
        console.log("[irysServiceSafe] Detected IRYS Testing Network - using specialized upload path");
        
        // Reset connection to ensure fresh state
        this.resetConnection();
        
        // Get direct wallet balance for diagnostics
        const walletBalance = await this.getIrysTestnetBalance();
        console.log("[irysServiceSafe] Direct wallet balance check:", walletBalance);
        
        if (typeof data === 'string' && data.length < 100) {
          // If this looks like a transaction ID, just return it
          if (/^[a-zA-Z0-9_-]{43}$/.test(data)) {
            return this.formatUploadResult({ id: data });
          }
        }
        
        try {
          // Special handling for IRYS Testing Network - use direct API upload
          return await this.uploadWithIrysTestnetTokens(data, tags);
        } catch (error: any) {
          console.error("[irysServiceSafe] Error with direct IRYS Testing Network upload:", error);
          throw error;
        }
      }
      
      // For all other networks, proceed with normal WebUploader path
      // Connect to Irys
      const uploader = await this.connectToIrys(true);
      console.log("[irysServiceSafe] Prepared uploader for Irys testnet token upload");
      
      // Authenticate if needed
      console.log("[irysServiceSafe] Authenticating uploader...");
      await uploader.ready();
      console.log("[irysServiceSafe] Uploader authenticated successfully");
      
      // Process the data into the right format
      console.log("[irysServiceSafe] Processing data for upload");
      let dataToUpload: any;
      let contentType = 'application/octet-stream';
      
      // Convert data to appropriate format
      if (data instanceof File) {
        // Convert File to Buffer
        dataToUpload = await this.convertFileToBuffer(data);
        contentType = data.type || 'application/octet-stream';
        console.log(`[irysServiceSafe] File size for upload: ${dataToUpload.length} bytes`);
      } else if (data instanceof Blob) {
        // Convert Blob to Buffer
        dataToUpload = Buffer.from(await data.arrayBuffer());
        contentType = data.type || 'application/octet-stream';
      } else if (typeof data === 'string') {
        // Convert string to Buffer
        dataToUpload = Buffer.from(data);
        contentType = 'text/plain';
      } else if (data instanceof Uint8Array) {
        // Convert Uint8Array to Buffer
        dataToUpload = Buffer.from(data);
      } else {
        throw new Error("Unsupported data type for upload");
      }
      
      // Ensure content type is in tags
      const contentTypeTagIndex = tags.findIndex(tag => tag.name === 'Content-Type');
      if (contentTypeTagIndex >= 0) {
        tags[contentTypeTagIndex].value = contentType;
      } else {
        tags.push({ name: 'Content-Type', value: contentType });
      }
      
      // Validate and process tags
      const validTags = this.prepareTags(tags);
      
      console.log('[irysServiceSafe] Starting upload with tags:', validTags);
      
      try {
        // Upload the data with the tags
        const receipt = await uploader.upload(dataToUpload, {
          tags: validTags
        });
        
        console.log('[irysServiceSafe] Upload successful:', receipt);
        
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
        console.error('[irysServiceSafe] Upload error:', uploadError);
        
        // Check for specific error types and provide better error messages
        if (uploadError.message && uploadError.message.includes('insufficient funds')) {
          throw new Error('Insufficient funds in your wallet to complete this upload. Please add more Sepolia ETH.');
        }
        
        throw uploadError;
      }
    } catch (error: any) {
      console.error("[irysServiceSafe] Error in uploadWithIrysTokens:", error);
      throw error;
    }
  }

  // Add new specialized direct upload method
  private async uploadWithIrysTestnetTokens(data: any, tags: Tag[] = []): Promise<UploadResult> {
    console.log("[irysServiceSafe] Using direct API upload for IRYS Testing Network");
    
    // Process data to buffer
    console.log("[irysServiceSafe] Processing data for upload");
    let buffer: Buffer;
    let contentType = 'application/octet-stream';
    
    if (data instanceof File) {
      buffer = await this.convertFileToBuffer(data);
      contentType = data.type || 'application/octet-stream';
      console.log(`[irysServiceSafe] File size for direct upload: ${buffer.length} bytes`);
    } else if (data instanceof Blob) {
      buffer = Buffer.from(await data.arrayBuffer());
      contentType = data.type || 'application/octet-stream';
    } else if (typeof data === 'string') {
      buffer = Buffer.from(data);
      contentType = 'text/plain';
    } else if (data instanceof Uint8Array) {
      buffer = Buffer.from(data);
    } else {
      throw new Error("Unsupported data type for upload");
    }
    
    // Prepare tags
    const finalTags = [
      ...tags,
      { name: 'Content-Type', value: contentType },
      // { name: 'App-Name', value: 'IRYS-StorageApp' },
      { name: 'Upload-Source', value: 'DirectAPI' }
    ];
    
    console.log("[irysServiceSafe] Prepared tags for direct upload:", finalTags);
    
    // Get wallet address and current timestamp
    const walletAddress = await this.getWalletAddress();
    if (!walletAddress) {
      throw new Error("Could not retrieve wallet address");
    }
    
    // For IRYS Testing Network, we'll use the WebUploader directly with the right configuration
    try {
      console.log("[irysServiceSafe] Using WebUploader for direct IRYS Testing Network upload");
      
      // Create a message to sign for authentication
      const message = `I authorize this upload to IRYS at ${new Date().toISOString()}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress]
      });
      
      // Connect to the correct provider URL
      const providerUrl = 'https://devnet.irys.xyz';
      console.log(`[irysServiceSafe] Using provider URL: ${providerUrl}`);
      
      // Use ethers BrowserProvider with the EthersV6Adapter
      const ethereum = getEthereum();
      const ethersProvider = new ethers.BrowserProvider(ethereum);
      
      // Create an Irys uploader specifically for this upload
      const { WebUploader } = await import('@irys/web-upload');
      const { WebEthereum } = await import('@irys/web-upload-ethereum');
      const { EthersV6Adapter } = await import('@irys/web-upload-ethereum-ethers-v6');
      
      const uploader = await WebUploader(WebEthereum)
        .withAdapter(EthersV6Adapter(ethersProvider))
        .withRpc(providerUrl);
      
      await uploader.ready();
      
      // Use the buffer directly - don't create a Blob
      
      // Upload the data with the tags
      const receipt = await uploader.upload(buffer, {
        tags: finalTags
      });
      
      console.log("[irysServiceSafe] Direct upload successful:", receipt);
      
      // Format the result to match our standard UploadResult format
      return {
        id: receipt.id,
        url: `https://gateway.irys.xyz/${receipt.id}`,
        receipt: receipt,
        transactionHash: receipt.id,
        explorerUrl: `https://explorer.irys.xyz/tx/${receipt.id}`
      };
      
    } catch (error: any) {
      console.error("[irysServiceSafe] Direct upload failed:", error);
      
      // If the direct method fails, try a fallback to the standard upload flow
      try {
        console.log("[irysServiceSafe] Attempting standard upload flow as fallback...");
        
        // Get the appropriate URL based on network
        const providerUrl = 'https://devnet.irys.xyz';
        
        // We'll use the standard WebUploader approach
        const ethereum = getEthereum();
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        
        // Create uploader with appropriate configuration
        const uploader = await WebUploader(WebEthereum)
          .withAdapter(EthersV6Adapter(ethersProvider))
          .withRpc(providerUrl);
        
        await uploader.ready();
        
        // Use the buffer directly - don't create a Blob
        
        // Upload the data with the tags
        const receipt = await uploader.upload(buffer, {
          tags: finalTags
        });
        
        console.log("[irysServiceSafe] Fallback upload successful:", receipt);
        
        return {
          id: receipt.id,
          url: `https://gateway.irys.xyz/${receipt.id}`,
          receipt: receipt,
          transactionHash: receipt.id,
          explorerUrl: `https://explorer.irys.xyz/tx/${receipt.id}`
        };
        
      } catch (fallbackError) {
        console.error("[irysServiceSafe] Fallback upload also failed:", fallbackError);
        throw new Error(`IRYS Testing Network upload failed: ${error.message}`);
      }
    }
  }

  // Add method to get wallet balance for IRYS testnet tokens
  private async getIrysTestnetBalance(): Promise<string> {
    try {
      if (!window.ethereum) {
        return '0';
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        return '0';
      }
      
      // Get balance using eth_getBalance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      
      if (!balance) {
        return '0';
      }
      
      // Convert hex balance to decimal
      const balanceDecimal = parseInt(balance, 16).toString();
      
      // Format to ETH equivalent (division by 10^18)
      const ethers = await import('ethers');
      const formattedBalance = ethers.formatEther(balanceDecimal);
      
      return formattedBalance;
    } catch (err) {
      console.error('[irysServiceSafe] Error getting IRYS testnet balance:', err);
      return '0';
    }
  }

  /**
   * Convert a File object to a Buffer
   * @param file The File object to convert
   * @returns A Promise that resolves to a Buffer
   */
  private async convertFileToBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const buffer = Buffer.from(reader.result);
          resolve(buffer);
        } else {
          reject(new Error("Failed to convert file to ArrayBuffer"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Helper to determine if data requires payment
  private requiresPayment(data: any): boolean {
    const size = data instanceof Buffer ? data.length : 
                 data instanceof File ? data.size : 
                 data instanceof Blob ? data.size : 
                 Buffer.from(String(data)).length;
  
    // Zero-sized files don't make sense to upload
    return size > 0;
  }

  /**
   * Gets the current chain ID from the wallet
   * @returns The chain ID as a string or null if not available
   */
  private async getChainId(): Promise<string | null> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) return null;
      
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      return chainId;
    } catch (error) {
      console.warn('[irysServiceSafe] Error getting chain ID:', error);
      return null;
    }
  }

  // Helper method to get network name
  private async getNetworkName(): Promise<string> {
    try {
      const { chainId } = await this.checkWalletConnectionStatus();
      
      if (!chainId) return "Unknown Network";
      
      const networks: Record<string, string> = {
        "0x1": "Ethereum Mainnet",
        "0x4f6": "IRYS Testing Network",
        "0xaa36a7": "Sepolia Testnet",
        "0x5": "Goerli Testnet",
        "0x89": "Polygon Mainnet",
        "0x13881": "Polygon Mumbai",
      };
      
      return networks[chainId] || `Chain ID: ${chainId}`;
    } catch (error) {
      console.error("Error getting network name:", error);
      return "Unknown Network";
    }
  }

  // Formats the upload result into a standard format
  private formatUploadResult(result: any): UploadResult {
    if (!result || !result.id) {
      throw new Error('Upload failed: No transaction ID returned');
    }
    
    return {
      id: result.id,
      url: `${this.getGatewayUrl()}/${result.id}`,
      transactionHash: result.id,
      explorerUrl: `${this.getExplorerUrl()}/tx/${result.id}`
    };
  }

  // Helper method to prepare tags
  private prepareTags(tags: Tag[]): Tag[] {
    // Clean up tags and ensure required tags are present
    let validTags = tags.filter(tag => tag.name && tag.value);
    
    // Ensure App-Name is set to Stoirys
    const appNameIndex = validTags.findIndex(tag => tag.name === 'App-Name');
    if (appNameIndex >= 0) {
      validTags[appNameIndex].value = 'Stoirys';
    } else {
      validTags.push({ name: 'App-Name', value: 'Stoirys' });
    }
    
    // Ensure we have a Content-Type, but preserve existing ones
    const contentTypeIndex = validTags.findIndex(tag => 
      tag.name.toLowerCase() === 'content-type' || tag.name === 'Content-Type'
    );
    
    if (contentTypeIndex === -1) {
      // Default to text/plain if no content type is specified
      validTags.push({ name: 'Content-Type', value: 'text/plain' });
    } else {
      // Standardize the tag name to Content-Type (proper case)
      validTags[contentTypeIndex].name = 'Content-Type';
      
      // If content type is empty or invalid, set a fallback
      if (!validTags[contentTypeIndex].value) {
        validTags[contentTypeIndex].value = 'application/octet-stream';
      }
      
      // Log the content type we're using
      console.log(`[irysServiceSafe] Using Content-Type: ${validTags[contentTypeIndex].value}`);
    }
    
    // Add upload timestamp
    let timestampIndex = validTags.findIndex(tag => tag.name === 'Upload-Timestamp');
    if (timestampIndex === -1) {
      validTags.push({ name: 'Upload-Timestamp', value: new Date().toISOString() });
    }
    
    return validTags;
  }
}

// Export a singleton instance
export const irysServiceSafe = new IrysServiceSafe(); 
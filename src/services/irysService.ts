import { WebIrys } from '@irys/sdk';
import { ethers } from 'ethers';
import { UploadResult, RetrievedData, Tag, TransactionDetails } from '../types';
import { getEthereum } from '../config/polyfills';

// Use casting instead
const ethereumProvider = window.ethereum as any;

class IrysService {
  private webIrysInstance: WebIrys | null = null;
  private isDevnet: boolean;
  private lastConnectedAccount: string | null = null;
  private connectionAttemptTime: number = 0;
  
  constructor() {
    this.isDevnet = import.meta.env.VITE_IRYS_DEVNET === 'true';
  }
  
  getGatewayUrl(): string {
    return this.isDevnet ? 'https://devnet.gateway.irys.xyz' : 'https://gateway.irys.xyz';
  }
  
  getNodeUrl(): string {
    return this.isDevnet ? 'https://devnet.irys.xyz' : 'https://node1.irys.xyz';
  }
  
  getExplorerUrl(): string {
    return this.isDevnet ? 'https://devnet.explorer.irys.xyz' : 'https://explorer.irys.xyz';
  }
  
  async connectToIrys(force: boolean = false): Promise<WebIrys> {
    // Return existing instance if available and not forced to reconnect
    // Only reuse if less than 5 minutes old to prevent stale connections
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    if (this.webIrysInstance && !force && (now - this.connectionAttemptTime) < maxAge) {
      try {
        // Quick check if the instance is still valid
        await this.webIrysInstance.getLoadedBalance();
        console.log('[IrysService] Using existing WebIrys instance');
        return this.webIrysInstance;
      } catch (error) {
        console.log('[IrysService] Existing WebIrys instance is invalid, creating new one');
        // If error, continue to create a new instance
      }
    }
    
    console.log('[IrysService] Creating new WebIrys instance');
    this.connectionAttemptTime = now;
    
    // Connect to the Ethereum provider safely
    const ethereum = getEthereum();
    if (!ethereum) {
      throw new Error('No Ethereum provider found. Please install MetaMask or similar.');
    }
    
    try {
      // @ts-ignore - Ignore BrowserProvider type error
      const provider = new ethers.BrowserProvider(ethereum);
      
      // First check if we can get accounts without prompting
      const accounts = await provider.send('eth_accounts', []);
      
      if (!accounts || accounts.length === 0) {
        console.log('[IrysService] No accounts available without prompting. Requesting accounts...');
        await provider.send('eth_requestAccounts', []);
      }
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      console.log('[IrysService] Connected with wallet:', address);
      this.lastConnectedAccount = address;
      
      // Initialize WebIrys with the correct type structure
      const webIrys = new WebIrys({
        url: this.getNodeUrl(),
        token: 'ethereum',
        // @ts-ignore - The SDK types might be outdated
        provider: provider,
        wallet: { provider: signer }
      });
      
      await webIrys.ready();
      
      // Store the instance for future use
      this.webIrysInstance = webIrys;
      return webIrys;
    } catch (error) {
      console.error('[IrysService] Error connecting to Irys:', error);
      this.webIrysInstance = null;
      throw new Error('Failed to connect to Irys. Please check your wallet connection.');
    }
  }
  
  async getBalance(): Promise<string> {
    try {
      const irys = await this.connectToIrys();
      const balance = await irys.getLoadedBalance();
      // Convert to string to avoid BigNumber issues
      return balance.toString();
    } catch (error) {
      console.error('[IrysService] Error getting balance:', error);
      return '0';
    }
  }
  
  async fundNode(amount: string): Promise<any> {
    const irys = await this.connectToIrys(true); // Always force a fresh connection for funding
    // Use the correct parsing method for the SDK
    const fundTx = await irys.fund(amount);
    return fundTx;
  }
  
  async uploadData(
    data: string | File, 
    tags: Tag[] = []
  ): Promise<UploadResult> {
    // Force a fresh connection for uploads to avoid stale wallet state
    const irys = await this.connectToIrys(true);
    
    try {
      // Ensure we always have some basic tags
      const defaultTags = [
        { name: 'Application', value: 'Irys Web App' },
      ];
      
      // Combine default tags with user tags, ensuring no duplicates
      const userTagNames = tags.map(tag => tag.name);
      const finalTags = [
        ...defaultTags.filter(tag => !userTagNames.includes(tag.name)),
        ...tags
      ];
      
      // If data is a string
      if (typeof data === 'string') {
        // Make sure we have a Content-Type tag
        if (!finalTags.some(tag => tag.name === 'Content-Type')) {
          finalTags.push({ name: 'Content-Type', value: 'text/plain' });
        }
        
        // Prepare receipt
        const receipt = await irys.upload(data, { tags: finalTags });
        
        return {
          id: receipt.id,
          url: `${this.getGatewayUrl()}/${receipt.id}`,
          // Store the receipt for reference
          receipt: receipt
        };
      } 
      // If data is a file
      else {
        const fileType = data.type || 'application/octet-stream';
        
        // Make sure we have a Content-Type tag
        if (!finalTags.some(tag => tag.name === 'Content-Type')) {
          finalTags.push({ name: 'Content-Type', value: fileType });
        }
        
        // Prepare receipt
        const receipt = await irys.uploadFile(data, { tags: finalTags });
        
        return {
          id: receipt.id,
          url: `${this.getGatewayUrl()}/${receipt.id}`,
          // Store the receipt for reference
          receipt: receipt
        };
      }
    } catch (error) {
      console.error('[IrysService] Upload error:', error);
      throw new Error(`Failed to upload data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async retrieveData(transactionId: string): Promise<RetrievedData> {
    try {
      // Fetch data directly from gateway
      const response = await fetch(`${this.getGatewayUrl()}/${transactionId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      // Try to parse as JSON first
      try {
        const jsonData = await response.json();
        return { 
          data: jsonData,
          contentType: 'application/json',
          transactionId
        };
      } catch {
        // If not JSON, return as text or blob based on content-type
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('text')) {
          const textData = await response.text();
          return {
            data: textData,
            contentType,
            transactionId
          };
        } else {
          // Handle as binary data
          const blobData = await response.blob();
          return {
            data: blobData,
            contentType,
            transactionId
          };
        }
      }
    } catch (error) {
      console.error('[IrysService] Error retrieving data:', error);
      throw error;
    }
  }
  
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
      console.error('[IrysService] Error fetching transaction details:', error);
      throw new Error(`Failed to get transaction details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  setDevnet(isDevnet: boolean): void {
    this.isDevnet = isDevnet;
    // Reset the WebIrys instance when changing networks
    this.webIrysInstance = null;
  }

  getIsDevnet(): boolean {
    return this.isDevnet;
  }
  
  reset(): void {
    this.webIrysInstance = null;
    this.lastConnectedAccount = null;
  }
}

// Export a singleton instance
export const irysService = new IrysService(); 
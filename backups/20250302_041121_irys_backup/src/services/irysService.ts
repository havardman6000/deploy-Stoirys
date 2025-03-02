import { WebIrys } from '@irys/sdk';
import { ethers } from 'ethers';
import { UploadResult, RetrievedData, Tag } from '../types';
import { getEthereum } from '../config/polyfills';

// Add Ethereum window type
declare global {
  interface Window {
    ethereum: any;
  }
}

class IrysService {
  private isDevnet: boolean;
  
  constructor() {
    this.isDevnet = import.meta.env.VITE_IRYS_DEVNET === 'true';
  }
  
  getGatewayUrl(): string {
    return this.isDevnet ? 'https://devnet.gateway.irys.xyz' : 'https://gateway.irys.xyz';
  }
  
  getNodeUrl(): string {
    return this.isDevnet ? 'https://devnet.irys.xyz' : 'https://node1.irys.xyz';
  }
  
  async connectToIrys(): Promise<WebIrys> {
    // Connect to the Ethereum provider safely
    const ethereum = getEthereum();
    if (!ethereum) {
      throw new Error('No Ethereum provider found. Please install MetaMask or similar.');
    }
    
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      
      // Initialize WebIrys with the correct type structure
      const webIrys = new WebIrys({
        url: this.getNodeUrl(),
        token: 'ethereum',
        // @ts-ignore - The SDK types might be outdated
        provider: provider,
        wallet: { provider: signer }
      });
      
      await webIrys.ready();
      return webIrys;
    } catch (error) {
      console.error('Error connecting to Irys:', error);
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
      console.error('Error getting balance:', error);
      return '0';
    }
  }
  
  async fundNode(amount: string): Promise<any> {
    const irys = await this.connectToIrys();
    // Use the correct parsing method for the SDK
    const fundTx = await irys.fund(amount);
    return fundTx;
  }
  
  async uploadData(
    data: string | File, 
    tags: Tag[] = []
  ): Promise<UploadResult> {
    const irys = await this.connectToIrys();
    
    try {
      // If data is a string
      if (typeof data === 'string') {
        // Prepare receipt
        const receipt = await irys.upload(data, {
          tags: [
            { name: 'Content-Type', value: 'text/plain' },
            { name: 'Application', value: 'Irys Web App' },
            ...tags
          ]
        });
        
        return {
          id: receipt.id,
          url: `${this.getGatewayUrl()}/${receipt.id}`
        };
      } 
      // If data is a file
      else {
        const fileType = data.type || 'application/octet-stream';
        
        // Prepare receipt
        const receipt = await irys.uploadFile(data, {
          tags: [
            { name: 'Content-Type', value: fileType },
            { name: 'Application', value: 'Irys Web App' },
            ...tags
          ]
        });
        
        return {
          id: receipt.id,
          url: `${this.getGatewayUrl()}/${receipt.id}`
        };
      }
    } catch (error) {
      console.error('Upload error:', error);
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
      console.error('Error retrieving data:', error);
      throw error;
    }
  }

  setDevnet(isDevnet: boolean): void {
    this.isDevnet = isDevnet;
  }

  getIsDevnet(): boolean {
    return this.isDevnet;
  }
}

// Export a singleton instance
export const irysService = new IrysService(); 
export interface Tag {
  name: string;
  value: string;
}

export interface UploadResult {
  id: string;
  url: string;
  receipt?: any; // Store the full receipt for references
  transactionHash?: string; // Add the transaction hash for explorer viewing
  explorerUrl?: string; // Add the explorer URL
}

export interface RetrievedData {
  data: any;
  contentType: string;
  transactionId: string;
  directUrl?: string; // Optional direct URL for viewing content if CORS prevents direct retrieval
  tags?: Tag[]; // Add tags to show metadata like App-Name
  fileName?: string; // Optional file name for better display
  size?: number; // Optional file size in bytes
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  type: 'upload' | 'retrieve';
  name?: string;
  contentType?: string;
  size?: number;
}

export interface TransactionDetails {
  transactionId?: string;
  transactionHash?: string;
  txHash?: string; // Alternative field for transaction hash
  owner?: string;
  timestamp?: number;
  blockHeight?: number;
  blockId?: string;
  tags?: Tag[];
  explorerUrl?: string;
  ownerExplorerUrl?: string | null;
  // Additional fields for funding operations
  status?: 'success' | 'pending' | 'failed';
  message?: string;
  balanceBefore?: string;
  balanceAfter?: string;
} 
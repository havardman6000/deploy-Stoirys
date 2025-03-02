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
  transactionId: string;
  transactionHash: string;
  owner?: string;
  timestamp?: number;
  blockHeight?: number;
  blockId?: string;
  tags: Tag[];
  explorerUrl: string;
  ownerExplorerUrl: string | null;
} 
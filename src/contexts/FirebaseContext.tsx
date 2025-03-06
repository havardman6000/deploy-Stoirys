import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  db, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  orderBy,
  serverTimestamp,
  Timestamp
} from '../utils/firebase';
import { useWallet } from './WalletContext';
import { getTransactionsIndexUrl } from '../utils/firebaseIndexHelper';

// Type definitions
export interface Folder {
  id: string;
  name: string;
  walletAddress: string;
  parentId: string | null;
  createdAt: any;
  updatedAt: any;
}

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  transactionId: string;
  walletAddress: string;
  folderId: string;
  metadata?: any;
  createdAt: any;
  updatedAt: any;
}

export interface Transaction {
  id: string;
  type: 'upload' | 'fund' | 'retrieve';
  amount?: string;
  transactionId: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  walletAddress: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: any;
}

// Firebase context type definition
interface FirebaseContextType {
  // Data state
  loading: boolean;
  error: string | null;
  
  // Folder methods
  createFolder: (name: string, parentId?: string | null) => Promise<Folder | null>;
  getFolders: () => Promise<Folder[]>;
  getFolder: (id: string) => Promise<Folder | null>;
  updateFolder: (id: string, data: Partial<Folder>) => Promise<boolean>;
  deleteFolder: (id: string) => Promise<boolean>;
  
  // File methods
  saveFile: (file: File, transactionId: string, folderId: string, metadata?: any) => Promise<StoredFile | null>;
  getFiles: (folderId?: string) => Promise<StoredFile[]>;
  getFile: (id: string) => Promise<StoredFile | null>;
  updateFile: (id: string, data: Partial<StoredFile>) => Promise<boolean>;
  deleteFile: (id: string) => Promise<boolean>;
  
  // Transaction methods
  saveTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'walletAddress'>) => Promise<Transaction | null>;
  getTransactions: () => Promise<Transaction[]>;
  getTransaction: (id: string) => Promise<Transaction | null>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (transactionId: string) => Promise<boolean>;
  clearTransactions: () => Promise<boolean>;
}

// Create context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Provider component
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress } = useWallet();

  // Ensure a user document exists for the current wallet
  const ensureUserDocument = useCallback(async () => {
    if (!walletAddress) return null;
    
    try {
      const userDoc = doc(db, 'users', walletAddress);
      const userSnapshot = await getDoc(userDoc);
      
      if (!userSnapshot.exists()) {
        // Create new user document with a root folder
        const rootFolderId = `root_${walletAddress}`;
        
        // Create user document
        await setDoc(userDoc, {
          walletAddress,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        // Create root folder
        await setDoc(doc(db, 'folders', rootFolderId), {
          id: rootFolderId,
          name: 'Root',
          walletAddress,
          parentId: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log(`Created new user document and root folder for wallet: ${walletAddress}`);
      } else {
        // Update last login time
        await updateDoc(userDoc, {
          lastLogin: serverTimestamp()
        });
        console.log(`Updated existing user for wallet: ${walletAddress}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring user document:', error);
      setError('Failed to initialize user data');
      return false;
    }
  }, [walletAddress]);

  // Initialize user data when wallet connects
  useEffect(() => {
    const initUser = async () => {
      if (walletAddress) {
        setLoading(true);
        await ensureUserDocument();
        setLoading(false);
      }
    };
    
    initUser();
  }, [walletAddress, ensureUserDocument]);

  // Folder methods
  const createFolder = async (name: string, parentId: string | null = null): Promise<Folder | null> => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      // Generate a unique ID
      const folderId = `folder_${walletAddress}_${Date.now()}`;
      
      const folderData: Folder = {
        id: folderId,
        name,
        walletAddress,
        parentId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'folders', folderId), folderData);
      
      return {
        ...folderData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('Failed to create folder');
      return null;
    }
  };

  const getFolders = async (): Promise<Folder[]> => {
    if (!walletAddress) return [];
    
    try {
      const foldersQuery = query(
        collection(db, 'folders'),
        where('walletAddress', '==', walletAddress)
      );
      
      const foldersSnapshot = await getDocs(foldersQuery);
      
      return foldersSnapshot.docs.map(doc => doc.data() as Folder);
    } catch (error) {
      console.error('Error getting folders:', error);
      setError('Failed to fetch folders');
      return [];
    }
  };

  const getFolder = async (id: string): Promise<Folder | null> => {
    try {
      const folderDoc = await getDoc(doc(db, 'folders', id));
      
      if (folderDoc.exists()) {
        const folderData = folderDoc.data() as Folder;
        
        // Security check - only return if wallet matches
        if (folderData.walletAddress === walletAddress) {
          return folderData;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error getting folder:', error);
      setError('Failed to fetch folder');
      return null;
    }
  };

  const updateFolder = async (id: string, data: Partial<Folder>): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const folderRef = doc(db, 'folders', id);
      const folderDoc = await getDoc(folderRef);
      
      if (!folderDoc.exists()) return false;
      
      const folderData = folderDoc.data() as Folder;
      
      // Security check - only update if wallet matches
      if (folderData.walletAddress !== walletAddress) {
        console.error('Unauthorized folder update attempt');
        return false;
      }
      
      await updateDoc(folderRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating folder:', error);
      setError('Failed to update folder');
      return false;
    }
  };

  const deleteFolder = async (id: string): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const folderRef = doc(db, 'folders', id);
      const folderDoc = await getDoc(folderRef);
      
      if (!folderDoc.exists()) return false;
      
      const folderData = folderDoc.data() as Folder;
      
      // Security check - only delete if wallet matches
      if (folderData.walletAddress !== walletAddress) {
        console.error('Unauthorized folder deletion attempt');
        return false;
      }
      
      // Check if folder has subfolders
      const subFoldersQuery = query(
        collection(db, 'folders'),
        where('parentId', '==', id)
      );
      
      const subFoldersSnapshot = await getDocs(subFoldersQuery);
      
      if (!subFoldersSnapshot.empty) {
        setError('Cannot delete folder with subfolders');
        return false;
      }
      
      // Check if folder has files
      const filesQuery = query(
        collection(db, 'files'),
        where('folderId', '==', id)
      );
      
      const filesSnapshot = await getDocs(filesQuery);
      
      if (!filesSnapshot.empty) {
        setError('Cannot delete folder with files');
        return false;
      }
      
      await deleteDoc(folderRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      setError('Failed to delete folder');
      return false;
    }
  };

  // File methods
  const saveFile = async (
    file: File,
    transactionId: string,
    folderId: string,
    metadata: any = {}
  ): Promise<StoredFile | null> => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      // Check if folder exists and belongs to user
      const folderDoc = await getDoc(doc(db, 'folders', folderId));
      
      if (!folderDoc.exists()) {
        setError('Folder not found');
        return null;
      }
      
      const folderData = folderDoc.data() as Folder;
      
      if (folderData.walletAddress !== walletAddress) {
        setError('Unauthorized file save attempt');
        return null;
      }
      
      // Generate file ID
      const fileId = `file_${walletAddress}_${Date.now()}`;
      
      // Construct IRYS gateway URL
      const irysUrl = `https://gateway.irys.xyz/${transactionId}`;
      
      const fileData: StoredFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: irysUrl,
        transactionId,
        walletAddress,
        folderId,
        metadata,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'files', fileId), fileData);
      
      return {
        ...fileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
    } catch (error) {
      console.error('Error saving file:', error);
      setError('Failed to save file');
      return null;
    }
  };

  const getFiles = async (folderId?: string): Promise<StoredFile[]> => {
    if (!walletAddress) return [];
    
    try {
      let filesQuery;
      
      if (folderId) {
        filesQuery = query(
          collection(db, 'files'),
          where('walletAddress', '==', walletAddress),
          where('folderId', '==', folderId)
        );
      } else {
        filesQuery = query(
          collection(db, 'files'),
          where('walletAddress', '==', walletAddress)
        );
      }
      
      const filesSnapshot = await getDocs(filesQuery);
      
      return filesSnapshot.docs.map(doc => doc.data() as StoredFile);
    } catch (error) {
      console.error('Error getting files:', error);
      setError('Failed to fetch files');
      return [];
    }
  };

  const getFile = async (id: string): Promise<StoredFile | null> => {
    try {
      const fileDoc = await getDoc(doc(db, 'files', id));
      
      if (fileDoc.exists()) {
        const fileData = fileDoc.data() as StoredFile;
        
        // Security check - only return if wallet matches
        if (fileData.walletAddress === walletAddress) {
          return fileData;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error getting file:', error);
      setError('Failed to fetch file');
      return null;
    }
  };

  const updateFile = async (id: string, data: Partial<StoredFile>): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const fileRef = doc(db, 'files', id);
      const fileDoc = await getDoc(fileRef);
      
      if (!fileDoc.exists()) return false;
      
      const fileData = fileDoc.data() as StoredFile;
      
      // Security check - only update if wallet matches
      if (fileData.walletAddress !== walletAddress) {
        console.error('Unauthorized file update attempt');
        return false;
      }
      
      await updateDoc(fileRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating file:', error);
      setError('Failed to update file');
      return false;
    }
  };

  const deleteFile = async (id: string): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const fileRef = doc(db, 'files', id);
      const fileDoc = await getDoc(fileRef);
      
      if (!fileDoc.exists()) return false;
      
      const fileData = fileDoc.data() as StoredFile;
      
      // Security check - only delete if wallet matches
      if (fileData.walletAddress !== walletAddress) {
        console.error('Unauthorized file deletion attempt');
        return false;
      }
      
      await deleteDoc(fileRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Failed to delete file');
      return false;
    }
  };

  // Transaction methods
  const saveTransaction = async (
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'walletAddress'>
  ): Promise<Transaction | null> => {
    if (!walletAddress) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      // Generate ID for transaction
      const transactionId = `tx_${walletAddress}_${Date.now()}`;
      
      const transactionData: Transaction = {
        id: transactionId,
        ...transaction,
        walletAddress,
        createdAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'transactions', transactionId), transactionData);
      
      return {
        ...transactionData,
        createdAt: Timestamp.now()
      };
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError('Failed to save transaction');
      
      // Save to localStorage as fallback
      try {
        const storageKey = `transactions_${walletAddress}`;
        const existingData = localStorage.getItem(storageKey);
        const transactions = existingData ? JSON.parse(existingData) : [];
        
        const newTransaction = {
          id: `local_${Date.now()}`,
          ...transaction,
          walletAddress,
          createdAt: new Date().toISOString()
        };
        
        transactions.push(newTransaction);
        localStorage.setItem(storageKey, JSON.stringify(transactions));
        
        console.log('Saved transaction to localStorage as fallback');
        return newTransaction as any;
      } catch (localError) {
        console.error('Failed to save transaction to localStorage:', localError);
      }
      
      return null;
    }
  };

  const getTransactions = async (): Promise<Transaction[]> => {
    if (!walletAddress) return [];
    
    try {
      // First try to get from Firestore with the complex query (requires index)
      try {
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('walletAddress', '==', walletAddress),
          orderBy('createdAt', 'desc')
        );
        
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactions = transactionsSnapshot.docs.map(doc => doc.data() as Transaction);
        
        console.log(`Retrieved ${transactions.length} transactions from Firebase index query`);
        return transactions;
      } catch (indexError: any) {
        // Check if it's an index error
        if (indexError.message?.includes('index') || indexError.code === 'failed-precondition') {
          console.warn('Firebase index not created yet. Using simpler query as fallback.');
          
          // Use a simpler query that doesn't require an index
          const simpleQuery = query(
            collection(db, 'transactions'),
            where('walletAddress', '==', walletAddress)
          );
          
          const snapshot = await getDocs(simpleQuery);
          let transactions = snapshot.docs.map(doc => doc.data() as Transaction);
          
          // Sort manually since we don't have the index
          transactions = transactions.sort((a, b) => {
            // Parse timestamps or compare raw values
            const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 
                         (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
            const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 
                         (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
            
            return dateB - dateA; // Descending order
          });
          
          console.log(`Retrieved ${transactions.length} transactions from simple query`);
          return transactions;
        }
        
        // If it's a different error, rethrow it
        throw indexError;
      }
    } catch (error: any) {
      console.error('Error getting transactions from Firestore:', error);
      
      // Store the index creation URL in the error for display
      if (error.message?.includes('index')) {
        setError(`Firebase index required. Please create the index: ${getTransactionsIndexUrl()}`);
      } else {
        setError('Failed to fetch transactions from cloud');
      }
      
      // Always check localStorage as a fallback
      try {
        const storageKey = `transactions_${walletAddress}`;
        const localData = localStorage.getItem(storageKey);
        
        if (localData) {
          const localTransactions = JSON.parse(localData);
          console.log(`Found ${localTransactions.length} transactions in local storage`);
          return localTransactions;
        }
      } catch (localError) {
        console.error('Error reading local transactions:', localError);
      }
      
      return [];
    }
  };

  const getTransaction = async (id: string): Promise<Transaction | null> => {
    try {
      const transactionDoc = await getDoc(doc(db, 'transactions', id));
      
      if (transactionDoc.exists()) {
        const transactionData = transactionDoc.data() as Transaction;
        
        // Security check - only return if wallet matches
        if (transactionData.walletAddress === walletAddress) {
          return transactionData;
        }
        return null;
      }
      
      // Try to find in localStorage
      try {
        const storageKey = `transactions_${walletAddress}`;
        const localData = localStorage.getItem(storageKey);
        
        if (localData) {
          const localTransactions = JSON.parse(localData);
          const found = localTransactions.find((tx: any) => tx.id === id || tx.transactionId === id);
          
          if (found) {
            return found as Transaction;
          }
        }
      } catch (localError) {
        console.error('Error reading local transaction:', localError);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting transaction:', error);
      setError('Failed to fetch transaction');
      return null;
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      const transactionRef = doc(db, 'transactions', id);
      const transactionDoc = await getDoc(transactionRef);
      
      if (!transactionDoc.exists()) return false;
      
      const transactionData = transactionDoc.data() as Transaction;
      
      // Security check - only update if wallet matches
      if (transactionData.walletAddress !== walletAddress) {
        console.error('Unauthorized transaction update attempt');
        return false;
      }
      
      await updateDoc(transactionRef, data);
      
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction');
      return false;
    }
  };

  // Add these functions to fix the transaction clearing issues

  /**
   * Delete a specific transaction from firestore and local storage
   */
  const deleteTransaction = async (transactionId: string): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      console.log(`Attempting to delete transaction ${transactionId}`);
      
      // First try to find the transaction to get its document ID
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('walletAddress', '==', walletAddress),
        where('transactionId', '==', transactionId)
      );
      
      const snapshot = await getDocs(transactionsQuery);
      
      if (snapshot.empty) {
        console.log('Transaction not found in Firebase, checking local storage');
        
        // If not in Firebase, try to delete from localStorage
        try {
          const storageKey = `transactions_${walletAddress}`;
          const localData = localStorage.getItem(storageKey);
          
          if (localData) {
            const localTransactions = JSON.parse(localData);
            const filteredTransactions = localTransactions.filter(
              (tx: any) => tx.transactionId !== transactionId && tx.id !== transactionId
            );
            
            localStorage.setItem(storageKey, JSON.stringify(filteredTransactions));
            console.log('Deleted transaction from localStorage');
            return true;
          }
        } catch (localError) {
          console.error('Error deleting from localStorage:', localError);
        }
        
        return false;
      }
      
      // Delete all matching transactions from Firestore
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`Deleted ${deletePromises.length} transactions from Firestore`);
      
      // Also remove from localStorage to ensure consistency
      try {
        const storageKey = `transactions_${walletAddress}`;
        const localData = localStorage.getItem(storageKey);
        
        if (localData) {
          const localTransactions = JSON.parse(localData);
          const filteredTransactions = localTransactions.filter(
            (tx: any) => tx.transactionId !== transactionId && tx.id !== transactionId
          );
          
          localStorage.setItem(storageKey, JSON.stringify(filteredTransactions));
        }
      } catch (localError) {
        console.error('Error updating localStorage after Firebase deletion:', localError);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction');
      return false;
    }
  };

  /**
   * Clear all transactions for the current wallet
   */
  const clearTransactions = async (): Promise<boolean> => {
    if (!walletAddress) return false;
    
    try {
      console.log('Attempting to clear all transactions');
      
      // First get all transactions for this wallet
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('walletAddress', '==', walletAddress)
      );
      
      const snapshot = await getDocs(transactionsQuery);
      
      if (snapshot.empty) {
        console.log('No transactions found in Firebase, checking local storage');
      } else {
        // Delete all transactions from Firestore
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        console.log(`Cleared ${deletePromises.length} transactions from Firestore`);
      }
      
      // Clear localStorage transactions as well
      try {
        const storageKey = `transactions_${walletAddress}`;
        localStorage.removeItem(storageKey);
        console.log('Cleared transactions from localStorage');
      } catch (localError) {
        console.error('Error clearing localStorage:', localError);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing transactions:', error);
      setError('Failed to clear transaction history');
      return false;
    }
  };

  // Context value
  const contextValue: FirebaseContextType = {
    loading,
    error,
    
    // Folder methods
    createFolder,
    getFolders,
    getFolder,
    updateFolder,
    deleteFolder,
    
    // File methods
    saveFile,
    getFiles,
    getFile,
    updateFile,
    deleteFile,
    
    // Transaction methods
    saveTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Hook to use Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  
  if (context === undefined) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  
  return context;
}; 
//src/contexts/FirebaseContext.tsx
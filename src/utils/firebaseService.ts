import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  query,
  where,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

// Types
export interface FirebaseUser {
  walletAddress: string;
  createdAt: any; // serverTimestamp() or Date.now()
  lastLogin: any; // serverTimestamp() or Date.now()
  rootFolderId: string;
  transactions: FirebaseTransaction[];
  localOnly?: boolean;
}

export interface FirebaseFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  createdAt: any; // serverTimestamp() or Date.now()
  ownerAddress: string;
}

export interface FirebaseFile {
  id: string;
  name: string;
  size: number;
  type: string;
  transactionId: string;
  folderId: string;
  ownerAddress: string;
  uploadedAt: any; // serverTimestamp() or Date.now()
  irysUrl?: string;
}

export interface FirebaseTransaction {
  id: string;
  transactionId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  timestamp: number;
  irysUrl?: string;
}

// Collection references
const usersCollection = collection(db, 'users');
const foldersCollection = collection(db, 'folders');
const filesCollection = collection(db, 'files');

/**
 * Firebase service for managing user data and files
 */
const firebaseService = {
  /**
   * Initialize or get a user by wallet address
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<FirebaseUser>} User data
   */
  async getOrCreateUser(walletAddress: string): Promise<FirebaseUser> {
    if (!walletAddress) throw new Error('Wallet address is required');
    
    try {
      const userRef = doc(usersCollection, walletAddress);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log('Found existing user:', walletAddress);
        return userSnap.data() as FirebaseUser;
      }
      
      console.log('Creating new user for wallet:', walletAddress);
      
      // Create new user if doesn't exist
      const newUser: FirebaseUser = {
        walletAddress,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        rootFolderId: `root_${walletAddress}`,
        transactions: []
      };
      
      await setDoc(userRef, newUser);
      console.log('New user created successfully');
      
      // Create root folder for user
      await this.createFolder({
        id: newUser.rootFolderId,
        name: 'Root',
        path: '/',
        parentId: null,
        createdAt: serverTimestamp(),
        ownerAddress: walletAddress
      });
      
      return {
        ...newUser,
        createdAt: Date.now(), // For client-side use, since serverTimestamp isn't immediately available
        lastLogin: Date.now()
      };
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      // For permission errors, attempt read-only mode
      if ((error as any).code === 'permission-denied') {
        console.log('Falling back to local storage due to permission error');
        // Return minimal user object that can work with local storage only
        return {
          walletAddress,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          rootFolderId: `root_${walletAddress}`,
          transactions: [],
          localOnly: true // Flag to indicate this is a fallback
        };
      }
      throw error;
    }
  },
  
  /**
   * Update user's last login time
   * @param {string} walletAddress - User's wallet address
   */
  async updateUserLastLogin(walletAddress: string): Promise<void> {
    if (!walletAddress) return;
    
    try {
      const userRef = doc(usersCollection, walletAddress);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      console.warn('Failed to update last login:', (error as Error).message);
      // Continue without failing the app
    }
  },
  
  /**
   * Store a transaction/file upload in user's history
   * @param {string} walletAddress - User's wallet address  
   * @param {FirebaseTransaction} transaction - Transaction data
   */
  async addTransaction(walletAddress: string, transaction: FirebaseTransaction): Promise<void> {
    if (!walletAddress || !transaction) return;
    
    const userRef = doc(usersCollection, walletAddress);
    await updateDoc(userRef, {
      transactions: arrayUnion(transaction)
    });
  },
  
  /**
   * Remove a transaction from user's history
   * @param {string} walletAddress - User's wallet address
   * @param {string} transactionId - Transaction ID to remove
   */
  async removeTransaction(walletAddress: string, transactionId: string): Promise<void> {
    if (!walletAddress || !transactionId) return;
    
    const userRef = doc(usersCollection, walletAddress);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as FirebaseUser;
      const transaction = userData.transactions.find(tx => tx.id === transactionId);
      
      if (transaction) {
        await updateDoc(userRef, {
          transactions: arrayRemove(transaction)
        });
      }
    }
  },
  
  /**
   * Clear all transaction history for a user
   * @param {string} walletAddress - User's wallet address
   */
  async clearTransactionHistory(walletAddress: string): Promise<void> {
    if (!walletAddress) return;
    
    const userRef = doc(usersCollection, walletAddress);
    await updateDoc(userRef, {
      transactions: []
    });
  },
  
  /**
   * Get all transactions for a user
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<FirebaseTransaction[]>} Array of transactions
   */
  async getUserTransactions(walletAddress: string): Promise<FirebaseTransaction[]> {
    if (!walletAddress) return [];
    
    const userRef = doc(usersCollection, walletAddress);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as FirebaseUser;
      return userData.transactions || [];
    }
    
    return [];
  },
  
  /**
   * Create a folder
   * @param {FirebaseFolder} folder - Folder data
   */
  async createFolder(folder: FirebaseFolder): Promise<void> {
    if (!folder || !folder.id) throw new Error('Invalid folder data');
    
    const folderRef = doc(foldersCollection, folder.id);
    await setDoc(folderRef, folder);
  },
  
  /**
   * Get all folders for a user
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<FirebaseFolder[]>} Array of folders
   */
  async getUserFolders(walletAddress: string): Promise<FirebaseFolder[]> {
    if (!walletAddress) return [];
    
    const q = query(foldersCollection, where('ownerAddress', '==', walletAddress));
    const querySnapshot = await getDocs(q);
    
    const folders: FirebaseFolder[] = [];
    querySnapshot.forEach((doc) => {
      folders.push(doc.data() as FirebaseFolder);
    });
    
    return folders;
  },
  
  /**
   * Delete a folder
   * @param {string} folderId - Folder ID
   */
  async deleteFolder(folderId: string): Promise<void> {
    if (!folderId) return;
    
    const folderRef = doc(foldersCollection, folderId);
    await deleteDoc(folderRef);
  },
  
  /**
   * Store a file
   * @param {FirebaseFile} file - File data
   */
  async addFile(file: FirebaseFile): Promise<void> {
    if (!file || !file.id) throw new Error('Invalid file data');
    
    const fileRef = doc(filesCollection, file.id);
    await setDoc(fileRef, file);
  },
  
  /**
   * Get all files for a user
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<FirebaseFile[]>} Array of files
   */
  async getUserFiles(walletAddress: string): Promise<FirebaseFile[]> {
    if (!walletAddress) return [];
    
    const q = query(filesCollection, where('ownerAddress', '==', walletAddress));
    const querySnapshot = await getDocs(q);
    
    const files: FirebaseFile[] = [];
    querySnapshot.forEach((doc) => {
      files.push(doc.data() as FirebaseFile);
    });
    
    return files;
  },
  
  /**
   * Delete a file
   * @param {string} fileId - File ID
   */
  async deleteFile(fileId: string): Promise<void> {
    if (!fileId) return;
    
    const fileRef = doc(filesCollection, fileId);
    await deleteDoc(fileRef);
  },
  
  /**
   * Test the database connection
   * @returns {Promise<boolean>} True if the connection is successful
   */
  async testDatabaseConnection(): Promise<boolean> {
    try {
      // Try to access the users collection to test read permission
      const q = query(usersCollection, where('createdAt', '!=', null));
      const querySnapshot = await getDocs(q);
      
      // If we got here, the connection is working
      console.log('Firebase connection test successful');
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }
};

export default firebaseService; 
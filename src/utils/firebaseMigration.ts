import { db } from '../utils/firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

/**
 * Migrates data from user ID based structure to wallet address based structure
 * This utility can be run when a user connects their wallet to ensure their
 * data is properly associated with their wallet address
 */
export const migrateUserData = async (userId: string, walletAddress: string): Promise<void> => {
  try {
    console.log(`Starting migration from user ID ${userId} to wallet address ${walletAddress}`);
    
    // Check if user document exists under the old ID
    const oldUserDoc = doc(db, 'users', userId);
    const oldUserSnap = await getDoc(oldUserDoc);
    
    // Check if wallet document already exists
    const walletUserDoc = doc(db, 'users', walletAddress);
    const walletUserSnap = await getDoc(walletUserDoc);
    
    // If old data exists and wallet document doesn't exist or is empty
    if (oldUserSnap.exists()) {
      const oldUserData = oldUserSnap.data();
      
      // Create or update the wallet-based user document
      await setDoc(walletUserDoc, {
        ...oldUserData,
        walletAddress,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      
      console.log(`Migrated user profile data for ${walletAddress}`);
      
      // Migrate folders
      const oldFoldersCollection = collection(db, 'users', userId, 'folders');
      const oldFoldersSnapshot = await getDocs(oldFoldersCollection);
      
      for (const folderDoc of oldFoldersSnapshot.docs) {
        const folderData = folderDoc.data();
        await setDoc(
          doc(db, 'users', walletAddress, 'folders', folderDoc.id),
          {
            ...folderData,
            lastUpdated: new Date().toISOString()
          }
        );
        console.log(`Migrated folder ${folderDoc.id}`);
      }
      
      // Migrate files
      const oldFilesCollection = collection(db, 'users', userId, 'files');
      const oldFilesSnapshot = await getDocs(oldFilesCollection);
      
      for (const fileDoc of oldFilesSnapshot.docs) {
        const fileData = fileDoc.data();
        await setDoc(
          doc(db, 'users', walletAddress, 'files', fileDoc.id),
          {
            ...fileData,
            lastUpdated: new Date().toISOString()
          }
        );
        console.log(`Migrated file ${fileDoc.id}`);
      }
      
      console.log(`Migration complete for user ${walletAddress}`);
      
      // Optionally, you can delete the old data after confirming successful migration
      // Uncomment these lines once you've tested the migration
      /*
      await deleteDoc(oldUserDoc);
      
      for (const folderDoc of oldFoldersSnapshot.docs) {
        await deleteDoc(doc(db, 'users', userId, 'folders', folderDoc.id));
      }
      
      for (const fileDoc of oldFilesSnapshot.docs) {
        await deleteDoc(doc(db, 'users', userId, 'files', fileDoc.id));
      }
      
      console.log(`Deleted old data for user ${userId}`);
      */
    } else {
      console.log(`No data to migrate for user ID ${userId}`);
    }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

/**
 * Ensures all user data is properly linked to the wallet address
 * This is useful for ensuring consistency across different browsers
 */
export const validateUserData = async (userId: string, walletAddress: string): Promise<boolean> => {
  try {
    // Check data under wallet address
    const walletUserDoc = doc(db, 'users', walletAddress);
    const walletUserSnap = await getDoc(walletUserDoc);
    
    // If no wallet document exists yet, perform migration
    if (!walletUserSnap.exists()) {
      await migrateUserData(userId, walletAddress);
      return true;
    }
    
    // Check if there's any data under the user ID that might need migration
    if (userId && userId !== walletAddress) {
      const oldUserDoc = doc(db, 'users', userId);
      const oldUserSnap = await getDoc(oldUserDoc);
      
      if (oldUserSnap.exists()) {
        // If there's data under the old ID, perform migration
        await migrateUserData(userId, walletAddress);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Data validation error:', error);
    return false;
  }
}; 
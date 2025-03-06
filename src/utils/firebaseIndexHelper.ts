/**
 * Firebase Index Helper
 * 
 * This utility provides guidance on creating the necessary Firestore indexes
 * required by the application. When Firestore queries combine WHERE and ORDER BY
 * clauses, they often require composite indexes to work properly.
 */

/**
 * Returns the URL to create the required composite index for transactions collection
 * This index is required for querying transactions by walletAddress and ordering by createdAt
 */
export const getTransactionsIndexUrl = (): string => {
  return "https://console.firebase.google.com/v1/r/project/stoirys-drive/firestore/indexes?create_composite=ClJwcm9qZWN0cy9zdG9pcnlzLWRyaXZlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy90cmFuc2FjdGlvbnMvaW5kZXhlcy9fEAEaEQoNd2FsbGV0QWRkcmVzcxABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI";
};

/**
 * Returns instructions for creating the required Firestore indexes
 */
export const getIndexCreationInstructions = (): string => {
  return `
To create the required Firestore index:

1. Click the link in the error message or go to the Firebase Console
2. Navigate to Firestore Database > Indexes
3. Click "Add Index"
4. For Collection ID, select "transactions"
5. Add the following fields:
   - walletAddress (Ascending)
   - createdAt (Descending)
6. Click "Create"

The index may take a few minutes to build. Until it's ready, the app will use local storage as a fallback.
  `;
};

/**
 * Returns the Firebase console URL
 */
export const getFirebaseIndexUrl = (): string => {
  return "https://console.firebase.google.com/project/stoirys-drive/firestore/indexes";
}; 
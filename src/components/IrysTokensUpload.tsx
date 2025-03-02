import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useIrys } from '../hooks/useIrys';
import { Tag, UploadResult } from '../types';
import IrysTokenFundingForm from './wallet/IrysTokenFundingForm';
import Card from './common/Card';
import Button from './common/Button';
import { useHistory } from '../hooks/useHistory';
import { classNames } from '../utils/classNames';

// Define the constants and helper functions for text size tracking
const MAX_TEXT_SIZE = 95 * 1024; // 95KB for text

// Calculate percentage of maximum size
const calculatePercentage = (current: number, max: number): number => {
  return Math.min(Math.round((current / max) * 100), 100);
};

// Color for progress bar based on percentage
const getProgressColor = (percentage: number): string => {
  if (percentage < 50) return 'bg-green-500';
  if (percentage < 80) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Format memory size to human-readable format
const formatMemorySize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

const IrysTokensUpload: React.FC = () => {
  const { 
    isLoading, 
    error: irysError, 
    balance, 
    uploadDataWithIrysTokens,
    isWalletConnected,
    connectWallet,
    fetchBalance,
    getIrysTestnetTokens
  } = useIrys();
  
  const [uploadData, setUploadData] = useState<string>('');
  const [textMemoryUsage, setTextMemoryUsage] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([{ name: 'App-Name', value: 'Stoirys' }]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'text' | 'file'>('text');
  const [showFundingForm, setShowFundingForm] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRequestingTokens, setIsRequestingTokens] = useState(false);
  const [tokenRequestMessage, setTokenRequestMessage] = useState<string | null>(null);
  
  const { addHistoryItem } = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Check balance on component mount and when wallet connects
  useEffect(() => {
    if (isWalletConnected) {
      refreshIrysBalance();
    }
  }, [isWalletConnected]);

  // Update error state when irysError changes
  useEffect(() => {
    if (irysError) {
      setError(irysError);
    }
  }, [irysError]);

  // Manual refresh for the IRYS token balance
  const refreshIrysBalance = async () => {
    setLoadingBalance(true);
    try {
      // Force a fresh balance check by calling fetchBalance
      await fetchBalance();
      console.log('Refreshed IRYS token balance:', balance);
    } catch (err) {
      console.error('Error refreshing IRYS token balance:', err);
    } finally {
      setLoadingBalance(false);
    }
  };
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check file size limit (95KB)
      if (file.size > 95 * 1024) {
        alert(`File size exceeds the 95KB limit. Selected file is ${(file.size / 1024).toFixed(1)}KB.`);
        return;
      }
      setSelectedFile(file);
      
      // Update Content-Type tag to match the file type
      const updatedTags = [...tags];
      const contentTypeIndex = updatedTags.findIndex(tag => tag.name === 'Content-Type');
      if (contentTypeIndex >= 0) {
        updatedTags[contentTypeIndex] = { name: 'Content-Type', value: file.type || 'application/octet-stream' };
      } else {
        updatedTags.push({ name: 'Content-Type', value: file.type || 'application/octet-stream' });
      }
      setTags(updatedTags);
    }
  }, [tags]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100 MB max
    multiple: false
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size limit (95KB)
      if (file.size > 95 * 1024) {
        alert(`File size exceeds the 95KB limit. Selected file is ${(file.size / 1024).toFixed(1)}KB.`);
        e.target.value = ''; // Clear the file input
        return;
      }
      setSelectedFile(file);
    }
  };
  
  // Handle text change and calculate memory usage
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    
    // Calculate memory usage
    const memoryUsage = new TextEncoder().encode(text).length;
    
    // Only update if under the limit
    if (memoryUsage <= MAX_TEXT_SIZE) {
      setUploadData(text);
      setTextMemoryUsage(memoryUsage);
    } else {
      // Don't update if over the limit
      alert("Text exceeds the maximum size of 95KB. Please reduce the content.");
    }
  };
  
  // Upload using Irys testnet tokens (L1 transaction)
  const handleUpload = async () => {
    // Validate that we have data to upload
    if (uploadType === 'text' && !uploadData) {
      setError('Please enter some data to upload');
      return;
    }
    
    if (uploadType === 'file' && !selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    // Reset states
    setError(null);
    setSuccessMessage(null);
    setIsUploading(true);
    
    try {
      // Ensure wallet is connected
      if (!isWalletConnected) {
        await connectWallet();
      }
      
      // Refresh balance before upload to ensure we have the latest
      await refreshIrysBalance();
      
      // Perform the upload based on type
      let dataToUpload: string | File | null = null;
      
      if (uploadType === 'text') {
        if (!uploadData) throw new Error('No text data to upload');
        dataToUpload = uploadData;
      } else {
        if (!selectedFile) throw new Error('No file selected');
        
        // For larger files, provide feedback
        if (selectedFile.size > 5 * 1024 * 1024) {
          setLoadingMessage('Preparing file for upload. This may take a moment for larger files...');
        }
        
        dataToUpload = selectedFile;
      }
      
      if (!dataToUpload) {
        throw new Error('No data to upload');
      }
      
      // Provide feedback during upload
      setLoadingMessage('Uploading to Irys network...');
      
      // Add Content-Type tag if it's a file
      let finalTags = [...tags];
      if (uploadType === 'file' && selectedFile) {
        // Ensure we have a proper content type
        const contentType = selectedFile.type || 'application/octet-stream';
        console.log(`[IrysTokensUpload] Setting Content-Type for file: ${contentType}`);
        
        // Find and replace or add Content-Type tag
        const contentTypeIndex = finalTags.findIndex(tag => tag.name.toLowerCase() === 'content-type');
        if (contentTypeIndex >= 0) {
          finalTags[contentTypeIndex] = { name: 'Content-Type', value: contentType };
        } else {
          finalTags.push({ name: 'Content-Type', value: contentType });
        }
      } else if (uploadType === 'text') {
        // For text, set Content-Type to text/plain if not specified
        const contentTypeIndex = finalTags.findIndex(tag => tag.name.toLowerCase() === 'content-type');
        if (contentTypeIndex === -1) {
          finalTags.push({ name: 'Content-Type', value: 'text/plain' });
        }
      }
      
      console.log('[IrysTokensUpload] Starting upload with tags:', finalTags);
      const result = await uploadDataWithIrysTokens(dataToUpload, finalTags);
      
      console.log('[IrysTokensUpload] Upload successful:', result);
      setUploadResult(result);
      
      // Add to history
      if (addHistoryItem && result && result.id) {
        const historyItem = {
          id: result.id,
          type: 'upload' as const,
          url: result.url || `https://storage-explorer.irys.xyz/tx/${result.id}`,
          data: {
            contentType: finalTags.find(tag => tag.name === 'Content-Type')?.value || 'unknown',
            name: uploadType === 'file' ? selectedFile?.name : 'Text content'
          }
        };
        addHistoryItem(historyItem);
      }
      
      // Reset form if desired
      if (uploadType === 'text') {
        setUploadData('');
      } else {
        setSelectedFile(null);
      }
      
      // Refresh balance after upload
      setTimeout(() => refreshIrysBalance(), 3000);
      
    } catch (error) {
      console.error('[IrysTokensUpload] Upload error:', error);
      
      // Handle different types of errors with specific feedback
      const errorMsg = error instanceof Error ? error.message : 'Unknown error during upload';
      
      if (errorMsg.includes('Not enough balance') || errorMsg.includes('402')) {
        setError('You don\'t have enough IRYS tokens in your wallet for this upload. Please request IRYS testnet tokens below.');
        setShowFundingForm(true);
      } else if (errorMsg.includes('buffer')) {
        setError('Error processing file data. Please try a different file or use text upload instead.');
      } else if (errorMsg.includes('wallet')) {
        setError('Wallet connection issue. Please ensure your wallet is connected properly.');
      } else if (errorMsg.includes('user rejected') || errorMsg.includes('user denied') || errorMsg.includes('ACTION_REJECTED') || errorMsg.toLowerCase().includes('rejected') || errorMsg.includes('4001')) {
        setError('You declined the transaction in your wallet. To upload content, you need to approve the transaction when prompted.');
      } else {
        setError(errorMsg);
      }
      
    } finally {
      setIsUploading(false);
      setLoadingMessage(null);
    }
  };
  
  // Request IRYS tokens
  const handleRequestTokens = async () => {
    try {
      setError(null);
      if (!isWalletConnected) {
        await connectWallet();
      }
      
      const result = await getIrysTestnetTokens();
      console.log('Token request result:', result);
      
      // Refresh balance after getting tokens
      await refreshIrysBalance();
      
      // Show success message
      setSuccessMessage('Successfully received IRYS testnet tokens!');
    } catch (err: any) {
      console.error('Error requesting IRYS tokens:', err);
      setError(err.message || 'Failed to request IRYS tokens');
    }
  };
  
  // Handle tag change - keeping this for internal tag management
  const handleTagChange = (index: number, field: 'name' | 'value', value: string) => {
    const updatedTags = [...tags];
    updatedTags[index][field] = value;
    setTags(updatedTags);
  };

  // Add a new tag - keeping this for internal tag management
  const handleAddTag = () => {
    if (newTagName && newTagValue) {
      setTags([...tags, { name: newTagName, value: newTagValue }]);
      setNewTagName('');
      setNewTagValue('');
    }
  };

  // Remove a tag - keeping this for internal tag management
  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };
  
  // Handle funding form visibility toggle
  const toggleFundingForm = () => {
    setShowFundingForm(prev => !prev);
  };
  
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className="bg-white rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold">Upload with IRYS Tokens</h2>
            <p className="text-gray-600">
              Upload data directly to decentralized storage using IRYS testnet tokens. Your uploads will be permanently stored on the network.
            </p>
            
            {/* Balance Display */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">Current IRYS Token Balance: {balance}</h3>
              </div>
              
              <div className="mt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={refreshIrysBalance}
                  isLoading={loadingBalance}
                  fullWidth
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Check IRYS Token Balance</span>
                  </span>
                </Button>
              </div>
            </div>
            
            {/* Toggle between Text and File upload */}
            <div className="flex space-x-2 mt-4 mb-2">
              <button
                onClick={() => setUploadType('text')}
                className={`flex-1 px-4 py-3 rounded-md text-base ${
                  uploadType === 'text' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Text Upload
              </button>
              <button
                onClick={() => setUploadType('file')}
                className={`flex-1 px-4 py-3 rounded-md text-base ${
                  uploadType === 'file' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                File Upload
              </button>
            </div>
            
            {/* Upload Form */}
            {uploadType === 'text' ? (
              <div className="space-y-3">
                <textarea
                  value={uploadData}
                  onChange={handleTextChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base md:text-sm"
                  placeholder="Enter text data to upload..."
                  rows={6}
                  style={{ fontSize: '16px' }}
                />
                <div className="mt-2 text-sm text-gray-500 flex flex-col">
                  <div className="flex justify-between">
                    <span>Memory usage: {formatMemorySize(textMemoryUsage)}</span>
                    <span>{uploadData.length} characters</span>
                  </div>
                  
                  {/* Progress bar for text memory usage */}
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(calculatePercentage(textMemoryUsage, MAX_TEXT_SIZE))}`} 
                      style={{ width: `${calculatePercentage(textMemoryUsage, MAX_TEXT_SIZE)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-right">
                    {calculatePercentage(textMemoryUsage, MAX_TEXT_SIZE)}% of {formatMemorySize(MAX_TEXT_SIZE)} limit
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer min-h-[140px] flex flex-col justify-center
                    ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {selectedFile ? (
                    <div>
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-800 font-medium">{selectedFile.name}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm">Size: {(selectedFile.size / 1024).toFixed(2)} KB</span>
                        <div className="bg-gray-200 h-2 rounded-full flex-grow mx-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${selectedFile.size > 75 * 1024 ? 'bg-amber-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(100, (selectedFile.size / (95 * 1024)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">95 KB</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-red-500 text-sm hover:text-red-700 px-3 py-2 mt-1 border border-red-200 rounded-md"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Tap to select a file</p>
                      <p className="text-gray-700 hidden sm:block">Or drag & drop</p>
                      <p className="text-gray-500 text-sm mt-1">Max file size: 95 KB</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <hr className="my-4 border-gray-200" />
            
            {/* Upload Button */}
            <Button
              variant="info"
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 text-base md:py-2 md:text-sm"
              fullWidth
              onClick={handleUpload}
              isLoading={isUploading || isLoading}
              disabled={
                (uploadType === 'text' && !uploadData) ||
                (uploadType === 'file' && !selectedFile) ||
                isUploading ||
                isLoading
              }
            >
              Upload with IRYS Tokens
            </Button>

            {/* Loading Message */}
            {loadingMessage && (
              <div className="flex items-center justify-center py-2 text-purple-700">
                <div className="animate-spin mr-2">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span>{loadingMessage}</span>
              </div>
            )}
            
            {/* Error Message - Improved UI */}
            {error && (
              <div className="mt-4 overflow-hidden rounded-lg border animate-fadeIn">
                {/* Error Header - Adapts based on error type */}
                <div className={`px-4 py-3 flex items-center ${
                  (error.includes("declined") || error.includes("rejected") || error.includes("denied")) 
                    ? "bg-amber-50 border-b border-amber-200" 
                    : "bg-red-50 border-b border-red-200"
                }`}>
                  {/* Icon based on error type */}
                  {(error.includes("declined") || error.includes("rejected") || error.includes("denied")) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  
                  {/* Error title */}
                  <h3 className={`font-medium ${
                    (error.includes("declined") || error.includes("rejected") || error.includes("denied"))
                      ? "text-amber-800"
                      : "text-red-800"
                  }`}>
                    {(error.includes("declined") || error.includes("rejected") || error.includes("denied"))
                      ? "Transaction Declined"
                      : error.includes("Not enough") 
                        ? "Insufficient Balance" 
                        : error.includes("wallet")
                          ? "Wallet Connection Issue"
                          : "Upload Error"}
                  </h3>
                </div>
                
                {/* Error Content */}
                <div className="px-4 py-3 bg-white">
                  {/* User-friendly error description */}
                  <p className="text-gray-700">
                    {(error.includes("declined") || error.includes("rejected") || error.includes("denied"))
                      ? "You declined the transaction in your wallet. This is not an application error."
                      : error}
                  </p>
                  
                  {/* Additional help based on error type */}
                  {(error.includes("declined") || error.includes("rejected") || error.includes("denied")) && (
                    <div className="mt-3 bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="font-medium text-gray-700">To complete your upload:</p>
                      <ol className="list-decimal ml-5 mt-1 text-gray-600">
                        <li>Try uploading again by clicking the "Upload" button</li>
                        <li>When your wallet popup appears, click "Confirm" or "Sign"</li>
                        <li>This transaction is required to store your content on the Irys network</li>
                      </ol>
                    </div>
                  )}
                  
                  {error.includes("Not enough") && (
                    <div className="mt-3">
                      <p className="text-gray-600">You need IRYS tokens to upload content to the network.</p>
                      <button 
                        onClick={() => setShowFundingForm(true)}
                        className="mt-2 px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors w-full sm:w-auto text-base"
                      >
                        Get IRYS Tokens
                      </button>
                    </div>
                  )}
                  
                  {error.includes("Token transfer failed") && (
                    <div className="mt-3">
                      <p className="text-gray-700 font-medium">This usually means:</p>
                      <ul className="list-disc ml-5 mt-1 text-gray-600">
                        <li>You may not have enough IRYS tokens in your wallet</li>
                        <li>Your wallet rejected the transaction</li>
                        <li>There was a network issue during the token transfer</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Success Message - Redesigned to avoid redundancy */}
            {uploadResult && (
              <div className="mt-4">
                <div className="bg-green-50 border border-green-200 p-5 rounded-md animate-fadeIn">
                  <div className="flex items-start mb-3">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Upload Successful!</h3>
                      <p className="text-green-700 mt-1">
                        {uploadType === 'text' ? 'Your text has been' : `"${selectedFile?.name}" has been`} permanently stored on the Irys network.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-green-100 space-y-3">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <span className="font-medium text-gray-700">Transaction ID:</span>
                      <span className="font-mono text-sm text-gray-800 break-all">{uploadResult.id}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
                      <span className="font-medium text-gray-700">Access Options:</span>
                      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                        <a 
                          href={`https://storage-explorer.irys.xyz/tx/${uploadResult.id}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 hover:underline px-4 py-2 border border-purple-200 rounded-md justify-center sm:justify-start"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open Explorer
                        </a>
                        
                        <a 
                          href={uploadResult.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 hover:underline px-4 py-2 border border-purple-200 rounded-md justify-center sm:justify-start"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Content
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Upload another button */}
                  <button 
                    onClick={() => {
                      setUploadResult(null);
                      setSuccessMessage(null);
                      if (uploadType === 'text') {
                        setUploadData('');
                        if (textAreaRef.current) textAreaRef.current.focus();
                      } else {
                        setSelectedFile(null);
                      }
                    }}
                    className="mt-4 text-sm font-medium text-green-800 hover:text-green-900 flex items-center px-4 py-2 border border-green-200 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Upload another {uploadType === 'text' ? 'text' : 'file'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Show success message only for token requests, not for uploads */}
            {!uploadResult && successMessage && (
              <div className="bg-green-50 p-4 rounded-md border border-green-200 mt-4">
                <p className="text-green-600">{successMessage}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IrysTokensUpload; 
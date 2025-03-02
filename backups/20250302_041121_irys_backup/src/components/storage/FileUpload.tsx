import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../common/Button';
import { useIrys } from '../../hooks/useIrys';
import { useHistory } from '../../hooks/useHistory';
import { Tag, UploadResult } from '../../types';
import UploadResultDisplay from '../common/UploadResultDisplay';

interface FileUploadProps {
  onUploadSuccess?: (result: { id: string; url: string }) => void;
  maxSize?: number; // In bytes
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadSuccess, 
  maxSize = 10 * 1024 * 1024 // Reduce default to 10MB from 30MB
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [walletStatus, setWalletStatus] = useState<{ isConnected: boolean; isChecking: boolean }>({ 
    isConnected: false, 
    isChecking: false 
  });
  const [tags, setTags] = useState<Tag[]>([
    { name: 'Content-Type', value: '' },
    { name: 'App-Name', value: 'Irys Storage App' }
  ]);
  
  const { uploadData, isLoading, error, isWalletConnected, verifyWalletConnected } = useIrys();
  const { addHistoryItem } = useHistory();

  // Check wallet connection status when component mounts
  useEffect(() => {
    const checkWallet = async () => {
      setWalletStatus(prev => ({ ...prev, isChecking: true }));
      try {
        const status = await verifyWalletConnected();
        console.log('Wallet connection status:', status);
        setWalletStatus({ 
          isConnected: status.isConnected && status.isCorrectNetwork, 
          isChecking: false 
        });
      } catch (err) {
        console.error('Error checking wallet:', err);
        setWalletStatus({ isConnected: false, isChecking: false });
      }
    };
    
    checkWallet();
  }, [verifyWalletConnected]);

  // Update Content-Type tag when file changes
  useEffect(() => {
    if (file) {
      const contentTypeIndex = tags.findIndex(tag => tag.name === 'Content-Type');
      if (contentTypeIndex >= 0) {
        const newTags = [...tags];
        newTags[contentTypeIndex].value = file.type;
        setTags(newTags);
      }
    }
  }, [file]);

  // Update error message when hook error changes
  useEffect(() => {
    if (error) {
      setUploadError(error);
    }
  }, [error]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check if file is too large
      if (file.size > maxSize) {
        setUploadError(`File is too large (${formatFileSize(file.size)}). Maximum allowed size is ${formatFileSize(maxSize)}.`);
        return;
      }
      
      // Clear errors when a valid file is dropped
      setUploadError(null);
      setFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      // Suggest title based on filename
      const titleIndex = tags.findIndex(tag => tag.name === 'Title');
      if (titleIndex >= 0) {
        const newTags = [...tags];
        // Remove extension and replace hyphens/underscores with spaces
        const suggestedTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        newTags[titleIndex].value = suggestedTitle;
        setTags(newTags);
      }
    }
  }, [tags, maxSize]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({ 
    onDrop,
    maxSize,
    multiple: false
  });

  const handleTagChange = (index: number, field: 'name' | 'value', value: string) => {
    const newTags = [...tags];
    newTags[index][field] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, { name: '', value: '' }]);
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    try {
      // First check wallet status
      setWalletStatus(prev => ({ ...prev, isChecking: true }));
      const walletStatus = await verifyWalletConnected();
      console.log('Wallet status before upload:', walletStatus);
      setWalletStatus({ 
        isConnected: walletStatus.isConnected && walletStatus.isCorrectNetwork, 
        isChecking: false 
      });
      
      if (!walletStatus.isConnected) {
        setUploadError(walletStatus.error || 'Wallet not connected. Please connect your wallet first.');
        return;
      }
      
      if (!walletStatus.isCorrectNetwork) {
        setUploadError(`Please switch to the Sepolia network. Currently connected to ${walletStatus.chainName || 'unknown network'}.`);
        return;
      }

      // Filter out any empty tags
      const validTags = tags.filter(tag => tag.name && tag.value);
      
      // Add a file size tag for reference
      validTags.push({ name: 'File-Size-Bytes', value: file.size.toString() });
      
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null) return 5;
          if (prev >= 95) return prev;
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 500);

      try {
        console.log('Starting upload with file:', file.name, file.type, file.size);
        const result = await uploadData(file, validTags);
        console.log('Upload successful:', result);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadResult(result);
        
        // Notify parent component
        if (onUploadSuccess) {
          onUploadSuccess({
            id: result.id,
            url: result.url
          });
        }
        
        // Add to history
        addHistoryItem({
          id: result.id,
          url: result.url,
          type: 'upload',
          name: file.name,
          contentType: file.type,
          size: file.size
        });
        
        // Reset the form after a delay
        setTimeout(() => {
          setFile(null);
          setPreview(null);
          setTags([
            { name: 'Content-Type', value: '' },
            { name: 'App-Name', value: 'Irys Storage App' }
          ]);
          setUploadProgress(null);
        }, 1500);
      } catch (error: any) {
        clearInterval(progressInterval);
        console.error('Upload error:', error);
        
        // Handle different types of errors
        if (error.message?.includes('insufficient funds')) {
          setUploadError('Insufficient funds in your wallet. Please add more Sepolia ETH to continue.');
        } else if (error.message?.includes('user rejected')) {
          setUploadError('Transaction was rejected. Please confirm the transaction in your wallet.');
        } else if (error.message?.includes('network')) {
          setUploadError('Network error. Please check your connection and try again.');
        } else {
          setUploadError(`Upload failed: ${error.message || 'Unknown error'}`);
        }
        
        setUploadProgress(null);
      }
    } catch (error: any) {
      console.error('Error in upload process:', error);
      setUploadError(`Error: ${error.message || 'Unknown error'}`);
      setUploadProgress(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Determine file icon based on file type
  const getFileIcon = () => {
    if (!file) return null;
    
    if (file.type.startsWith('image/')) {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (file.type.includes('pdf')) {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (file.type.includes('text') || file.type.includes('json')) {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  // Clear upload result
  const handleClearResult = () => {
    setUploadResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {/* File Drop Zone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/70 hover:bg-primary/5'}`}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            // File preview
            <div className="flex flex-col items-center justify-center">
              {getFileIcon()}
              <p className="mt-2 text-sm font-medium text-text-primary">{file?.name}</p>
              <p className="text-xs text-text-secondary mt-1">
                {file ? formatFileSize(file.size) : ''}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
              >
                Remove File
              </Button>
            </div>
          ) : (
            // Upload prompt
            <div className="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-text-primary font-medium">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Upload any file up to {formatFileSize(maxSize)}
              </p>
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">File Tags</h3>
          
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium min-w-24">
                {tag.name}
              </div>
              <input
                type="text"
                value={tag.value}
                onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                placeholder="Tag value"
              />
              {index > 1 && (
                <button 
                  onClick={() => removeTag(index)} 
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          
          {/* Add Tag Button */}
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={addTag}
            >
              Add Tag
            </Button>
          </div>
        </div>
        
        {/* Upload button and progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <Button
              fullWidth
              onClick={handleUpload}
              disabled={!file || isLoading || uploadProgress !== null || walletStatus.isChecking}
              isLoading={isLoading || uploadProgress !== null || walletStatus.isChecking}
              className={`${walletStatus.isConnected && file ? 'bg-primary hover:bg-primary/90 shadow-md' : ''} ${walletStatus.isConnected && file ? 'animate-pulse-slow' : ''}`}
            >
              Upload File {walletStatus.isConnected && file ? '(Ready)' : ''}
            </Button>
          </div>
          
          {/* Debug info */}
          <div className="text-xs text-text-secondary mt-1">
            Wallet: {walletStatus.isConnected ? 'Connected' : 'Not Connected'} 
            {walletStatus.isChecking && ' (Checking...)'}
          </div>
          
          {/* Upload progress */}
          {uploadProgress !== null && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">Uploading...</span>
                <span className="text-sm font-medium text-text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Connection status */}
          {!walletStatus.isConnected && !walletStatus.isChecking && (
            <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-100">
              Please connect your wallet before uploading.
            </div>
          )}
          
          {/* Upload result */}
          {uploadResult && (
            <UploadResultDisplay 
              result={uploadResult} 
              onDismiss={handleClearResult} 
            />
          )}
          
          {/* Upload error */}
          {uploadError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">
              {uploadError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 
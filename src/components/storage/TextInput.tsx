import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import { useIrys } from '../../hooks/useIrys';
import { useTags } from '../../hooks/useTags';
import { UploadResult } from '../../types';
import { historyService } from '../../services/historyService';
import UploadResultDisplay from '../common/UploadResultDisplay';
import './TextInput.css';

interface TextInputProps {
  onUploadSuccess?: (id: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onUploadSuccess }) => {
  const [text, setText] = useState<string>('');
  const [tagsStr, setTagsStr] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { parseTags } = useTags();
  const { 
    uploadData, 
    isLoading, 
    isWalletConnected, 
    connectWallet,
    verifyWalletConnected
  } = useIrys();

  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    
    // Initial connection check
    checkConnectionStatus();
    
    // Set up periodic connection checks
    connectionCheckRef.current = setInterval(checkConnectionStatus, 10000);
    
    return () => {
      setIsMounted(false);
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, []);
  
  // Function to check wallet connection status
  const checkConnectionStatus = async () => {
    if (!isMounted) return;
    
    console.log('[TextInput] Checking wallet connection status...');
    try {
      await verifyWalletConnected();
      console.log('[TextInput] Wallet connection verified');
    } catch (error) {
      console.log('[TextInput] Wallet connection check error:', error);
    }
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Handle tags change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsStr(e.target.value);
  };

  // Clear upload result
  const handleClearResult = () => {
    setUploadResult(null);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!text.trim()) {
      alert('Please enter some text to upload');
      return;
    }

    try {
      // Check wallet connection status right before upload
      console.log('[TextInput] Verifying wallet connection before upload...');
      const connected = await verifyWalletConnected();
      
      if (!connected) {
        console.log('[TextInput] Wallet not connected, showing connection prompt');
        
        // Show confirmation dialog to connect wallet
        if (window.confirm('Your wallet is not connected. Would you like to connect it now?')) {
          console.log('[TextInput] User confirmed wallet connection');
          
          try {
            await connectWallet();
            console.log('[TextInput] Wallet connected successfully');
          } catch (connError) {
            console.error('[TextInput] Wallet connection error:', connError);
            alert(`Failed to connect wallet: ${connError instanceof Error ? connError.message : 'Unknown error'}`);
            return;
          }
        } else {
          console.log('[TextInput] User declined wallet connection');
          alert('Wallet connection is required to upload data');
          return;
        }
      }

      // Process tags
      let tags = parseTags(tagsStr);
      
      // Add default content-type tag if not specified
      if (!tags.some(tag => tag.name.toLowerCase() === 'content-type')) {
        tags = [...tags, { name: 'Content-Type', value: 'text/plain' }];
      }
      
      // Add app tag
      tags = [...tags, { name: 'App-Name', value: 'IrysStorageApp' }];
      
      console.log('[TextInput] Uploading text with tags:', tags);
      
      // Perform the upload
      const result = await uploadData(text, tags);
      
      // Store the result in state
      setUploadResult(result);
      
      // Update history
      historyService.addHistoryItem({
        id: result.id,
        name: `Text upload (${new Date().toLocaleString()})`,
        type: 'upload',
        size: new Blob([text]).size,
        tags: tags,
        timestamp: Date.now()
      });
      
      // Clear inputs
      setText('');
      setTagsStr('');
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(result.id);
      }
    } catch (error) {
      console.error('[TextInput] Upload error:', error);
      
      let errorMessage = 'Upload failed: ';
      
      if (error instanceof Error) {
        if (error.message.includes('402 error')) {
          errorMessage += 'Wallet might need more ETH to cover the transaction. The upload uses pay-as-you-go funding directly from your wallet.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-1">
          Text Content
        </label>
        <textarea
          id="text-content"
          value={text}
          onChange={handleTextChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          rows={10}
          placeholder="Enter text to upload..."
        />
        <div className="mt-1 text-sm text-gray-500">
          {text.length} characters | {new Blob([text]).size} bytes
        </div>
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (Metadata)
        </label>
        <div className="text-xs text-gray-500 mb-1">
          Optional - format: key1=value1, key2=value2
        </div>
        <input
          id="tags"
          type="text"
          value={tagsStr}
          onChange={handleTagsChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          placeholder="Tags (e.g. key1=value1, key2=value2)"
        />
      </div>
      
      {!isWalletConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
          Your wallet is not connected. You'll be prompted to connect when uploading.
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleUpload}
          isLoading={isLoading}
          disabled={!text.trim()}
          className="w-full"
        >
          Upload Text (Pay-as-you-go)
        </Button>
        
        <p className="text-xs text-gray-500 italic">
          Note: Upload is funded directly from your wallet at the time of upload. No pre-funding required.
        </p>
      </div>
      
      {/* Display upload result if available */}
      {uploadResult && (
        <UploadResultDisplay 
          result={uploadResult} 
          onDismiss={handleClearResult} 
        />
      )}
      
      {!isWalletConnected && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          Error: Wallet connection required for uploads
        </div>
      )}
    </div>
  );
};

export default TextInput; 
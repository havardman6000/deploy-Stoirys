import React, { useState, useRef, useEffect } from 'react';
import { useIrys } from '../contexts/IrysContext';
import Card from './common/Card';
import Button from './common/Button';
import { useHistory } from '../hooks/useHistory';
import { useWallet } from '../contexts/WalletContext';
import { FaUpload, FaSpinner, FaTimes, FaFileUpload, FaFileImage, FaFilePdf, FaFileAlt, FaFile, FaKeyboard } from 'react-icons/fa';
import { useFirebase } from '../contexts/FirebaseContext';

// Constants for file size limits
const FREE_TIER_MAX_SIZE = 95 * 1024; // 95KB

// Format wei to ETH with appropriate units
const formatWeiToEther = (weiValue: string) => {
  // For sponsored uploads (under 95KB), display "FREE"
  if (weiValue === "FREE") {
    return "FREE (Sponsored Upload)";
  }
  
  if (!weiValue) return '0 ETH';
  
  try {
    // Handle the case where value is already in ETH format (decimal number)
    if (weiValue.includes('.')) {
      const etherValue = parseFloat(weiValue);
      
      if (etherValue === 0) {
        return '0 ETH';
      } else if (etherValue < 0.000001) {
        // Convert scientific notation to fixed decimal for very small values
        return `${etherValue.toFixed(10)} ETH (minimal)`;
      }
      
      return `${etherValue.toFixed(6)} ETH`;
    }
    
    // For actual wei values (integers)
    const wei = BigInt(weiValue.toString());
    
    // Convert wei to ether
    const ether = Number(wei) / 1e18;
    
    if (ether === 0) {
      return '0 ETH';
    } else if (ether < 0.000001) {
      // Convert scientific notation to fixed decimal for very small values
      return `${ether.toFixed(10)} ETH (minimal)`;
    }
    
    return `${ether.toFixed(6)} ETH`;
  } catch (e) {
    console.error('Error formatting wei to ether:', e);
    return '? ETH';
  }
};

// Format file size to human-readable format
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

interface FileUploadProps {
  onUploadSuccess?: (result: any) => void;
}

// Add interfaces for the text upload state
interface TextUploadState {
  content: string;
  filename: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const { isConnected, uploadFile, calculateUploadCost, isUploading, uploadProgress, connectToIrys } = useIrys();
  const { isConnected: isWalletConnected, connectWallet, walletAddress } = useWallet();
  const { addHistoryItem } = useHistory();
  const { saveTransaction, saveFile } = useFirebase();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCost, setUploadCost] = useState<string>("0");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [tags, setTags] = useState<{name: string, value: string}[]>([
    { name: 'App-Name', value: 'Stoirys' },
    { name: 'Content-Type', value: 'application/octet-stream' }
  ]);
  const [newTagName, setNewTagName] = useState<string>('');
  const [newTagValue, setNewTagValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Add state for text upload
  const [isTextUpload, setIsTextUpload] = useState<boolean>(false);
  const [textUpload, setTextUpload] = useState<TextUploadState>({
    content: '',
    filename: 'document.txt'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset upload cost when selected file changes
  useEffect(() => {
    if (selectedFile) {
      calculateFileCost(selectedFile);
    } else if (isTextUpload && textUpload.content) {
      const contentBlob = new Blob([textUpload.content], { type: 'text/plain' });
      calculateFileCost(new File([contentBlob], textUpload.filename, { type: 'text/plain' }));
    } else {
      setUploadCost("0");
    }
  }, [selectedFile, isTextUpload, textUpload.content]);
  
  // Calculate file cost based on size
  const calculateFileCost = async (file: File) => {
    if (!file) return;
    
    setIsCalculating(true);
    try {
      const cost = await calculateUploadCost(file.size);
      setUploadCost(cost);
    } catch (error: any) {
      console.error("Error calculating cost:", error);
      setError(`Failed to calculate cost: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Handle file selection
  const handleFileSelect = async (file: File) => {
    if (!file) return;
    
    setSelectedFile(file);
    setIsTextUpload(false);
    
    // Update Content-Type tag
    const updatedTags = [...tags];
    const contentTypeIndex = updatedTags.findIndex(tag => tag.name === 'Content-Type');
    if (contentTypeIndex >= 0) {
      updatedTags[contentTypeIndex] = { name: 'Content-Type', value: file.type || 'application/octet-stream' };
    } else {
      updatedTags.push({ name: 'Content-Type', value: file.type || 'application/octet-stream' });
    }
    setTags(updatedTags);
    
    // Calculate upload cost
    await calculateFileCost(file);
  };

  // Toggle to text upload mode
  const toggleTextUpload = () => {
    if (!isTextUpload) {
      setSelectedFile(null);
      setIsTextUpload(true);
      
      // Update Content-Type tag for text
      const updatedTags = [...tags];
      const contentTypeIndex = updatedTags.findIndex(tag => tag.name === 'Content-Type');
      if (contentTypeIndex >= 0) {
        updatedTags[contentTypeIndex] = { name: 'Content-Type', value: 'text/plain' };
      } else {
        updatedTags.push({ name: 'Content-Type', value: 'text/plain' });
      }
      setTags(updatedTags);
    } else {
      setIsTextUpload(false);
    }
  };
  
  // Handle text content change
  const handleTextContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextUpload({
      ...textUpload,
      content: e.target.value
    });
    
    // Calculate cost when content changes significantly
    if (e.target.value && e.target.value.length % 100 === 0) {
      const contentBlob = new Blob([e.target.value], { type: 'text/plain' });
      calculateFileCost(new File([contentBlob], textUpload.filename, { type: 'text/plain' }));
    }
  };
  
  // Handle text filename change
  const handleTextFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filename = e.target.value.trim() || 'document.txt';
    setTextUpload({
      ...textUpload,
      filename: filename.endsWith('.txt') ? filename : `${filename}.txt`
    });
  };
  
  // Handle file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };
  
  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  // Add custom tag
  const addCustomTag = () => {
    if (newTagName.trim() && newTagValue.trim()) {
      // Check if tag with the same name already exists
      const tagExists = tags.some(tag => tag.name === newTagName.trim());
      
      if (!tagExists) {
        setTags([
          ...tags, 
          { name: newTagName.trim(), value: newTagValue.trim() }
        ]);
        setNewTagName('');
        setNewTagValue('');
      }
    }
  };
  
  // Remove custom tag
  const removeCustomTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  // Handle file upload
  const handleUpload = async () => {
    setError(null);
    setSuccessMessage(null);
    
    // Create a file from text content if in text upload mode
    const fileToUpload = isTextUpload 
      ? new File([new Blob([textUpload.content], { type: 'text/plain' })], textUpload.filename, { type: 'text/plain' })
      : selectedFile;
    
    // Validate file selection
    if (!fileToUpload) {
      setError('Please select a file or enter text to upload');
      return;
    }
    
    // Ensure wallet is connected
    if (!isWalletConnected) {
      try {
        const connected = await connectWallet();
        if (!connected) {
          setError('Please connect your wallet to upload');
          return;
        }
      } catch (error: any) {
        setError(`Wallet connection error: ${error.message}`);
        return;
      }
    }
    
    // Ensure Irys is connected
    if (!isConnected) {
      try {
        await connectToIrys();
      } catch (error: any) {
        setError(`Irys connection error: ${error.message}`);
        return;
      }
    }
    
    try {
      // Prepare metadata
      const fileMetadata = {
        name: fileToUpload.name,
        size: fileToUpload.size,
        type: fileToUpload.type,
        lastModified: fileToUpload.lastModified,
        ...tags.reduce((acc, tag) => {
          acc[tag.name] = tag.value;
          return acc;
        }, {} as Record<string, string>)
      };
      
      // Set uploading state
      setIsCalculating(true);
      setUploadCost("0");
      
      console.log('Starting upload to Irys...');
      
      // Upload to IRYS
      const transactionId = await uploadFile(fileToUpload, fileMetadata);
      
      console.log(`Upload successful! Transaction ID: ${transactionId}`);
      
      // Create transaction data with gateway URL
      const irysUrl = `https://gateway.irys.xyz/${transactionId}`;
      const timestamp = Date.now();
      
      // Save to history via localStorage (as a backup)
      const historyItem = {
        id: transactionId,
        type: 'upload' as const,
        url: irysUrl,
        timestamp,
        name: fileToUpload.name,
        contentType: fileToUpload.type,
        size: fileToUpload.size
      };
      
      console.log('Saving to localStorage history:', historyItem);
      addHistoryItem(historyItem);
      
      // Try to save to Firebase
      try {
        if (saveTransaction && walletAddress) {
          console.log('Saving transaction to Firebase with wallet:', walletAddress);
          
          const transaction: {
            type: 'upload';
            transactionId: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            status: 'completed' | 'pending' | 'failed';
          } = {
            type: 'upload',
            transactionId,
            fileName: fileToUpload.name,
            fileUrl: irysUrl,
            fileSize: fileToUpload.size,
            status: 'completed'
          };
          
          const result = await saveTransaction(transaction);
          console.log('Transaction saved to Firebase successfully:', result);
        } else {
          console.warn('Firebase saveTransaction not available or wallet not connected, saved to localStorage only');
        }
      } catch (firebaseError) {
        console.error('Failed to save transaction to Firebase:', firebaseError);
        console.log('Transaction was saved to localStorage as fallback');
      }
      
      // Set success state
      setSuccessMessage(`File uploaded successfully! Transaction ID: ${transactionId}`);
      if(onUploadSuccess) onUploadSuccess(transactionId);
      
      // Reset form
      if (!isTextUpload) {
        setSelectedFile(null);
        fileInputRef.current!.value = '';
      }
      
      setTags([
        { name: 'App-Name', value: 'Stoirys' },
        { name: 'Content-Type', value: 'application/octet-stream' }
      ]);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#00ffd5]">Upload Document</h2>
      
      {/* Upload toggle: File or Text */}
      <div className="flex justify-center mb-6 bg-[#1a1b1e] rounded-lg border border-[#3a3b3e] overflow-hidden">
        <button
          className={`flex-1 px-4 py-2 ${!isTextUpload ? 'bg-[#00ffd5] text-black font-medium' : 'text-gray-300 hover:text-white'}`}
          onClick={() => setIsTextUpload(false)}
        >
          <FaFileUpload className="inline mr-2" />
          Upload File
        </button>
        <button
          className={`flex-1 px-4 py-2 ${isTextUpload ? 'bg-[#00ffd5] text-black font-medium' : 'text-gray-300 hover:text-white'}`}
          onClick={toggleTextUpload}
        >
          <FaKeyboard className="inline mr-2" />
          Enter Text
        </button>
      </div>
      
      {/* File Upload UI */}
      {!isTextUpload ? (
        <div 
          className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer mb-6 transition-colors duration-200 flex flex-col items-center justify-center min-h-[200px] ${
            isDragging 
              ? 'border-[#00ffd5] bg-[#00ffd5]/10' 
              : selectedFile 
                ? 'border-[#3a3b3e] bg-[#1a1b1e]' 
                : 'border-[#3a3b3e] hover:border-[#00ffd5]/50 bg-[#1a1b1e]'
          }`}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInputChange} 
            className="hidden" 
          />
          
          {selectedFile ? (
            <div className="p-4 rounded-lg bg-[#2a2b2e] border border-[#3a3b3e] w-full max-w-xl mx-auto">
              <div className="flex items-center">
                <div className="mr-3 text-[#00ffd5]">
                  {selectedFile.type.includes('image') ? (
                    <FaFileImage size={24} />
                  ) : selectedFile.type.includes('pdf') ? (
                    <FaFilePdf size={24} />
                  ) : selectedFile.type.includes('text') ? (
                    <FaFileAlt size={24} />
                  ) : (
                    <FaFile size={24} />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium text-white truncate">{selectedFile.name}</div>
                  <div className="text-xs text-gray-400">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                  </div>
                </div>
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-white transition-colors p-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-[#00ffd5] mb-3">
                <FaFileUpload size={40} />
              </div>
              <p className="text-lg font-medium text-white">Drag and drop a file here, or click to select</p>
              <p className="text-sm text-gray-400 mt-2">PDF, DOCX, images, and other files supported</p>
            </>
          )}
        </div>
      ) : (
        /* Text Upload UI */
        <div className="mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Filename
            </label>
            <input
              type="text"
              value={textUpload.filename}
              onChange={handleTextFilenameChange}
              placeholder="document.txt"
              className="w-full p-2 rounded-md bg-[#1a1b1e] border border-[#3a3b3e] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00ffd5]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content
            </label>
            <textarea
              value={textUpload.content}
              onChange={handleTextContentChange}
              placeholder="Enter your text content here..."
              className="w-full p-3 rounded-md bg-[#1a1b1e] border border-[#3a3b3e] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00ffd5] min-h-[200px]"
            />
          </div>
        </div>
      )}
      
      {/* Upload cost section - now centered */}
      {(selectedFile || (isTextUpload && textUpload.content)) && (
        <div className="mt-4 p-4 rounded bg-[#1a1b1e] border border-[#3a3b3e] text-center max-w-xl mx-auto mb-6">
          <div className="text-sm font-medium text-[#00ffd5] mb-2">Upload Cost</div>
          <div className="flex items-center justify-center">
            {isCalculating ? (
              <div className="flex items-center text-gray-400">
                <FaSpinner className="animate-spin mr-2" />
                Calculating...
              </div>
            ) : (
              <div className="text-xl font-medium text-white">
                {(selectedFile?.size || (isTextUpload && textUpload.content ? new Blob([textUpload.content]).size : 0)) < FREE_TIER_MAX_SIZE 
                  ? <span className="text-[#00ffd5]">FREE (Sponsored Upload)</span>
                  : formatWeiToEther(uploadCost)
                }
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Files up to 95KB: <span className="text-[#00ffd5]">FREE</span> (sponsored uploads)<br />
            Files larger than 95KB: Requires ETH payment based on file size
          </div>
        </div>
      )}
      
      {/* Tags section - improved UI */}
      {(selectedFile || isTextUpload) && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#00ffd5]">Tags</h3>
            <div className="text-xs text-gray-400">Metadata tags added to your file</div>
          </div>
          
          {/* Existing tags */}
          <div className="mb-4 space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center bg-[#2a2b2e] border border-[#3a3b3e] rounded-lg p-2">
                <div className="flex-1 truncate">
                  <span className="text-[#00ffd5] mr-2">{tag.name}:</span>
                  <span className="text-gray-300">{tag.value}</span>
                </div>
                {/* Allow removing custom tags, but keep required tags */}
                {!['App-Name', 'Content-Type'].includes(tag.name) && (
                  <button 
                    type="button" 
                    className="ml-2 text-gray-500 hover:text-red-400 p-1" 
                    onClick={() => removeCustomTag(index)}
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload button */}
      {(selectedFile || (isTextUpload && textUpload.content)) && (
        <div className="flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={isCalculating || (!selectedFile && (!isTextUpload || !textUpload.content))}
            className="w-full md:w-auto bg-[#00ffd5] hover:bg-[#00e6c0] text-black px-8 py-3 text-lg flex items-center justify-center"
          >
            {isCalculating ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Uploading... {uploadProgress > 0 ? `${Math.round(uploadProgress)}%` : ''}
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Upload progress bar */}
      {isCalculating && uploadProgress > 0 && (
        <div className="w-full bg-[#1a1b1e] rounded-full h-2.5 mt-4 overflow-hidden">
          <div 
            className="bg-[#00ffd5] h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {/* Error and success messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
          <div className="font-medium">Upload failed</div>
          <div className="text-sm">{error}</div>
        </div>
      )}
      
      {successMessage && (
        <div className="mt-4 p-3 bg-green-900/50 border border-green-700 text-green-200 rounded-lg">
          <div className="font-medium">Upload successful!</div>
          <div className="text-sm">{successMessage}</div>
        </div>
      )}
    </Card>
  );
};

export default FileUpload; 
//src/components/FileUpload.tsx
import { useState, useRef, useCallback, useEffect } from 'react';
import { useIrys } from '../../hooks/useIrys';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { addHistoryItem } from '../../services/historyService';
import TextInput from './TextInput';
import UploadResultDisplay from '../common/UploadResultDisplay';
import { UploadResult } from '../../types';

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const StorageTab = () => {
  const { uploadData, isLoading, fundNode, isWalletConnected, isDevnet } = useIrys();
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'file' | 'text'>('file');
  const [tags, setTags] = useState<{ name: string; value: string }[]>([
    { name: 'Content-Type', value: '' },
    { name: 'App-Name', value: 'Irys Storage App' },
  ]);
  const [showFundingUi, setShowFundingUi] = useState(false);
  const [fundAmount, setFundAmount] = useState('0.005');
  const [newTagName, setNewTagName] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [fundingSuccess, setFundingSuccess] = useState(false);
  const [fundingError, setFundingError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileId, setFileId] = useState('');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const navigate = useNavigate();

  // Update content type tag when file changes
  useEffect(() => {
    if (file) {
      const updatedTags = [...tags];
      const contentTypeTagIndex = updatedTags.findIndex(tag => tag.name === 'Content-Type');
      if (contentTypeTagIndex !== -1) {
        updatedTags[contentTypeTagIndex] = { ...updatedTags[contentTypeTagIndex], value: file.type || 'application/octet-stream' };
        setTags(updatedTags);
      }
    }
  }, [file]);

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadSuccess(false);
      setUploadError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false
  });

  // Handle tag addition
  const handleAddTag = () => {
    if (newTagName && newTagValue) {
      setTags([...tags, { name: newTagName, value: newTagValue }]);
      setNewTagName('');
      setNewTagValue('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    
    setUploadSuccess(false);
    setUploadError('');
    setUploadResult(null);
    
    try {
      const result = await uploadData(file, tags);
      if (result && result.id) {
        setFileId(result.id);
        setUploadSuccess(true);
        setUploadResult(result);
        
        // Add to history
        addHistoryItem({
          id: result.id,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          timestamp: Date.now(),
          tags: tags
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Unknown error occurred during upload');
      
      if (error instanceof Error && error.message.includes('Not enough funds')) {
        setShowFundingUi(true);
      }
    }
  };

  // Handle wallet funding
  const handleFund = async () => {
    setFundingError('');
    setFundingSuccess(false);
    
    try {
      await fundNode(fundAmount);
      setFundingSuccess(true);
    } catch (error) {
      console.error('Funding error:', error);
      setFundingError(error instanceof Error ? error.message : 'Unknown error occurred during funding');
    }
  };

  // Navigate to retrieval with current file ID
  const handleViewFile = () => {
    navigate(`/?tx=${fileId}`);
  };

  // Clear upload result
  const handleClearResult = () => {
    setUploadResult(null);
  };

  return (
    <div className="space-y-4">
      <Card title="Upload Content" className="bg-white">
        <div className="p-4 mb-4 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
          <h3 className="font-medium text-sm mb-2">Pay-as-you-go Uploads</h3>
          <p className="text-sm">
            This app now uses pay-as-you-go uploads on the Sepolia testnet. When you upload content:
          </p>
          <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
            <li>No pre-funding is required</li>
            <li>Your wallet pays directly at upload time</li>
            <li>Make sure you have enough Sepolia ETH for gas and storage costs</li>
            <li>Each transaction will require approval in your wallet</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          {/* Upload Type Selector */}
          <div className="flex border-b border-border-light mb-4">
            <button
              onClick={() => setUploadType('file')}
              className={`px-4 py-2 text-sm font-medium ${
                uploadType === 'file' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setUploadType('text')}
              className={`px-4 py-2 text-sm font-medium ${
                uploadType === 'text' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Upload Text
            </button>
          </div>
          
          {/* Content based on selected upload type */}
          {uploadType === 'file' ? (
            /* File Upload UI - existing code */
            <>
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-border-light hover:border-primary/50 hover:bg-slate-50'}
                  ${file ? 'bg-primary/5 border-primary/30' : ''}`}
              >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center justify-center space-y-2">
                  {file ? (
                    <>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <DocumentIcon />
                      </div>
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-text-secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <UploadIcon />
                      </div>
                      <p className="text-sm font-medium text-text-primary">
                        {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Support for a single file, up to 100MB in size
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Tags section - when in file mode */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">File Tags</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="grid gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded p-2 text-sm">
                        <div className="flex items-center">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">{tag.name}</span>
                          <span className="ml-2 text-text-secondary truncate max-w-xs">{tag.value}</span>
                        </div>
                        {/* Don't allow removal of Content-Type and App-Name */}
                        {(tag.name !== 'Content-Type' && tag.name !== 'App-Name') && (
                          <button 
                            onClick={() => handleRemoveTag(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Tag value"
                      value={newTagValue}
                      onChange={(e) => setNewTagValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
                    />
                    <Button 
                      onClick={handleAddTag} 
                      disabled={!newTagName || !newTagValue}
                      variant="secondary"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Add Tag
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Upload button */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  onClick={handleUpload}
                  isLoading={isLoading}
                  disabled={!file || isLoading || !isWalletConnected}
                  fullWidth
                  className="flex-1"
                >
                  Upload File
                </Button>
                
                {uploadSuccess && (
                  <Button
                    onClick={handleViewFile}
                    variant="secondary"
                    className="flex-1"
                  >
                    View File
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Text Upload UI */
            <TextInput 
              onUploadSuccess={(id) => {
                setFileId(id);
                setUploadSuccess(true);
              }} 
            />
          )}
          
          {/* Success and error messages */}
          {uploadSuccess && uploadType === 'file' && uploadResult && (
            <UploadResultDisplay result={uploadResult} onDismiss={handleClearResult} />
          )}
          
          {uploadError && (
            <div className="mt-2 p-3 bg-red-50 text-red-700 rounded text-sm">
              <p className="font-medium">Upload failed</p>
              <p className="text-xs mt-1">{uploadError}</p>
            </div>
          )}
          
          {/* Funding UI */}
          {showFundingUi && (
            <div className="mt-6">
              <Card title="Fund Your Account" className="bg-slate-50 border-slate-200">
                <p className="text-sm text-text-secondary mb-4">
                  You need to fund your account to upload files. This is a one-time operation 
                  per session and funds can be withdrawn at any time.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm text-text-secondary">
                        {isDevnet ? 'SepoliaETH' : 'IRYS'}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleFund}
                    isLoading={isLoading}
                    className="whitespace-nowrap"
                  >
                    Fund Account
                  </Button>
                </div>
                
                {fundingSuccess && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 rounded text-sm">
                    Funding successful! You can now upload files.
                  </div>
                )}
                
                {fundingError && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                    {fundingError}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StorageTab; 
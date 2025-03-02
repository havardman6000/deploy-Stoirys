import React from 'react';
import { UploadResult } from '../../types';

interface UploadResultDisplayProps {
  result: UploadResult;
  onDismiss?: () => void;
}

const UploadResultDisplay: React.FC<UploadResultDisplayProps> = ({ result, onDismiss }) => {
  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Extract the clean ID from a potentially complex object
  const extractCleanId = (value: any): string => {
    try {
      // Handle null or undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      // Handle string values
      if (typeof value === 'string') {
        // Remove quotes if they exist and any JSON syntax
        return value.replace(/^"(.+)"$/, '$1').replace(/[{}"]/g, '');
      }
      
      // Handle object values with id property
      if (typeof value === 'object') {
        if (value.id) {
          return typeof value.id === 'string' 
            ? value.id.replace(/^"(.+)"$/, '$1').replace(/[{}"]/g, '')
            : String(value.id);
        }
        
        // Try to convert to string if possible
        const objString = String(value);
        if (objString !== '[object Object]') {
          return objString.replace(/[{}"]/g, '');
        }
        
        // Try to extract from JSON representation
        try {
          const jsonString = JSON.stringify(value);
          const idMatch = jsonString.match(/"id":"([^"]+)"/);
          if (idMatch && idMatch[1]) {
            return idMatch[1];
          }
        } catch (e) {
          console.error('Error parsing object:', e);
        }
      }
      
      // If we can't extract cleanly, convert to string and clean up
      const str = String(value).replace(/[{}"]/g, '');
      
      // Try to extract ID using regex if it's in a complex string
      const idMatch = str.match(/id:([^,}]+)/);
      if (idMatch && idMatch[1]) {
        return idMatch[1].trim();
      }
      
      return str === '[object Object]' ? '' : str;
    } catch (e) {
      console.error('Error extracting clean ID:', e);
      return '';
    }
  };

  // Open URL in new tab
  const openLink = (url: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  // Extract clean values - ensure we get proper string values
  const transactionId = extractCleanId(result.id);
  const transactionHash = result.transactionHash ? extractCleanId(result.transactionHash) : transactionId;
  
  // Always construct clean URLs directly using the transaction ID
  // This is the most reliable approach rather than trying to parse them from result
  const gatewayUrl = transactionId ? `https://gateway.irys.xyz/${transactionId}` : '';
  const explorerUrl = transactionId ? `https://explorer.irys.xyz/tx/${transactionId}` : '';

  // Don't render anything if we couldn't extract a transaction ID
  if (!transactionId) {
    console.error('Could not extract transaction ID from result:', result);
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 mt-4 shadow-sm">
        <div className="text-red-800">
          Error displaying transaction details. Please check the console for more information.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-6 mt-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-green-800 font-bold text-lg">Upload Successful!</h3>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="text-green-700 hover:text-green-900"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="space-y-4 divide-y divide-green-200">
        {/* Transaction ID */}
        <div className="pb-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            Transaction ID:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100">
              {transactionId}
            </code>
            <button 
              onClick={() => copyToClipboard(transactionId)}
              className="ml-2 p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
              title="Copy Transaction ID"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Transaction Hash */}
        <div className="py-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Transaction Hash:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100">
              {transactionHash}
            </code>
            <button 
              onClick={() => copyToClipboard(transactionHash)}
              className="ml-2 p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
              title="Copy Transaction Hash"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Gateway URL */}
        <div className="py-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Gateway URL:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100">
              {gatewayUrl}
            </code>
            <div className="flex-shrink-0 ml-2 space-x-1">
              <button 
                onClick={() => copyToClipboard(gatewayUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Copy Gateway URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
              <button 
                onClick={() => openLink(gatewayUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Open Gateway URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Explorer Link */}
        <div className="pt-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Explorer:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100 truncate">
              {explorerUrl}
            </code>
            <div className="flex-shrink-0 ml-2 space-x-1">
              <button 
                onClick={() => copyToClipboard(explorerUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Copy Explorer URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
              <button 
                onClick={() => openLink(explorerUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Open Explorer URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResultDisplay; 
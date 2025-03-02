import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { UploadResult } from '../../types';

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const StorageTab = () => {
  const navigate = useNavigate();

  // Function to redirect to IRYS Tokens tab
  const redirectToIrysTokensTab = () => {
    // Update the app state through parent component using a custom event
    const event = new CustomEvent('changeActiveTab', { 
      detail: { tab: 'fund' }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="bg-purple-100 rounded-full p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-3">IRYS Token Uploads</h2>
          <p className="text-gray-600 max-w-md mb-6">
            This application exclusively uses IRYS testnet tokens for all uploads. Your data will be stored permanently as secure, decentralized storage through the IRYS network.
          </p>

          <div className="space-y-4 w-full max-w-md">
            <h3 className="text-xl font-medium text-purple-700">Benefits of IRYS Token Uploads:</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                <span>Permanent decentralized storage</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                <span>True L1 transactions for maximum reliability</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                <span>No additional ETH required</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                <span>Simple one-step upload process</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Button 
              variant="info" 
              size="lg"
              onClick={redirectToIrysTokensTab}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Go to IRYS Token Upload
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StorageTab; 
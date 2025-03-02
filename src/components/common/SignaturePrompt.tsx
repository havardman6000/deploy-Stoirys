import React, { useEffect, useState } from 'react';
import Card from './Card';

const SignaturePrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  useEffect(() => {
    const checkSignatureRequest = () => {
      try {
        const signatureRequested = sessionStorage.getItem('signatureRequested') === 'true';
        const requestTimeStr = sessionStorage.getItem('signatureRequestTime');
        
        if (signatureRequested && requestTimeStr) {
          const requestTime = parseInt(requestTimeStr, 10);
          const elapsed = Math.floor((Date.now() - requestTime) / 1000);
          
          setIsVisible(true);
          setTimeElapsed(elapsed);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error checking signature status:', error);
      }
    };
    
    // Check immediately
    checkSignatureRequest();
    
    // Check periodically
    const interval = setInterval(checkSignatureRequest, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) {
    return null;
  }
  
  // Only show the prompt after a short delay to avoid flickering
  // for quick signatures
  if (timeElapsed < 2) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md">
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium mb-3">Waiting for Signature</h3>
          
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
          
          <p className="mb-4">
            Please check your wallet and confirm the signature request.
          </p>
          
          <div className="text-sm text-gray-500">
            Waiting for {timeElapsed} seconds...
          </div>
          
          <div className="mt-4 text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <p className="font-medium text-yellow-700">Tip</p>
            <p className="text-yellow-600">
              If you don't see a popup, check if your MetaMask extension is minimized
              or look for the MetaMask icon in your browser toolbar.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignaturePrompt; 
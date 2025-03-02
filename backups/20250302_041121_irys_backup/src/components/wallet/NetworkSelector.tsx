import React from 'react';
import { useIrys } from '../../hooks/useIrys';
import Button from '../common/Button';

const NetworkSelector: React.FC = () => {
  const { isDevnet, toggleNetwork, isLoading, fetchBalance } = useIrys();

  const handleNetworkToggle = () => {
    toggleNetwork();
    // After toggling the network, give it a moment and then force a balance refresh
    setTimeout(() => {
      fetchBalance().catch(err => {
        console.error('[NetworkSelector] Error fetching balance after network toggle:', err);
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Network:</span>
        <div className="flex space-x-2">
          <Button
            onClick={handleNetworkToggle}
            disabled={isLoading || !isDevnet}
            variant={isDevnet ? "secondary" : "primary"}
            size="sm"
          >
            Devnet
          </Button>
          <Button
            onClick={handleNetworkToggle}
            disabled={isLoading || isDevnet}
            variant={!isDevnet ? "secondary" : "primary"}
            size="sm"
          >
            Sepolia Testnet
          </Button>
        </div>
      </div>
      
      {!isDevnet && (
        <div className="text-xs text-primary bg-blue-50 p-2 rounded border border-blue-100">
          <p className="font-medium">Pay-as-you-go mode active on Sepolia</p>
          <p>Uploads are funded directly from your wallet at transaction time.</p>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector; 
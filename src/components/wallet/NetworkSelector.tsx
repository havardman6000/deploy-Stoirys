import React from 'react';
import { useIrys } from '../../hooks/useIrys';

const NetworkSelector: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-xs text-primary bg-purple-50 p-2 rounded border border-purple-100">
        <p className="font-medium">IRYS Network Information:</p>
        <ul className="list-disc ml-4 mt-1 text-xs">
          <li>All uploads use IRYS tokens</li>
          <li>Data is stored permanently on the network</li>
          <li>No gas fees required</li>
        </ul>
        <p className="mt-1 text-xs">Use the "IRYS Tokens" tab to upload your files</p>
      </div>
    </div>
  );
};

export default NetworkSelector; 
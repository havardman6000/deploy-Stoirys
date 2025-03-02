import React from 'react';
import Card from '../common/Card';

const IrysFaucetGuide: React.FC = () => {
  const faucetUrl = 'https://irys.xyz/faucet';
  
  return (
    <Card className="mb-6">
      <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Need IRYS Tokens?</h3>
        <p className="text-gray-700 mb-3">
          IRYS tokens enable permanent, decentralized storage with a single transaction. Follow these steps to get free IRYS testnet tokens:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mb-4">
          <li className="text-gray-700">
            Visit the{' '}
            <a 
              href={faucetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-medium underline"
            >
              IRYS Token Faucet
            </a>
          </li>
          <li className="text-gray-700">Enter your wallet address</li>
          <li className="text-gray-700">Request IRYS tokens</li>
          <li className="text-gray-700">Wait a few seconds for tokens to arrive</li>
        </ol>
        <div className="bg-white p-3 rounded-md border border-purple-200 text-sm">
          <p className="font-medium text-purple-700 mb-1">💡 Tips:</p>
          <ul className="list-disc pl-4 text-gray-600">
            <li>IRYS testnet tokens are for testing only and have no real-world value</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default IrysFaucetGuide; 
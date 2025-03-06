import React from 'react';
import Card from '../common/Card';

const IrysFaucetGuide: React.FC = () => {
  const sepoliaFaucets = [
    {
      name: "Alchemy Sepolia Faucet",
      url: "https://sepoliafaucet.com/",
      description: "Get free Sepolia ETH with Alchemy (requires sign-in)"
    },
    {
      name: "Infura Sepolia Faucet",
      url: "https://www.infura.io/faucet/sepolia",
      description: "Claim Sepolia ETH through Infura's faucet"
    },
    {
      name: "Chainlink Faucet",
      url: "https://faucets.chain.link/sepolia",
      description: "Get Sepolia ETH from Chainlink (social verification required)"
    }
  ];
  
  return (
    <Card className="mb-6">
      <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Sepolia ETH?</h3>
        <p className="text-gray-700 mb-3">
          Sepolia ETH is required to pay for transactions on the Sepolia testnet, including uploads to Irys. Here's how to get some:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mb-4">
          {sepoliaFaucets.map((faucet, index) => (
            <li key={index} className="text-gray-700">
              <a 
                href={faucet.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {faucet.name}
              </a> 
              <span className="block text-sm text-gray-600 mt-1">{faucet.description}</span>
            </li>
          ))}
        </ol>
        <div className="bg-white p-3 rounded-md border border-blue-200 text-sm">
          <p className="font-medium text-blue-700 mb-1">💡 Tips:</p>
          <ul className="list-disc pl-4 text-gray-600">
            <li>Most faucets have daily limits, so try different ones if needed</li>
            <li>Sepolia testnet ETH has no real-world value</li>
            <li>Small amounts (0.05-0.1 ETH) are usually sufficient for testing</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default IrysFaucetGuide; 
//src/components/wallet/IrysFaucetGuide.tsx
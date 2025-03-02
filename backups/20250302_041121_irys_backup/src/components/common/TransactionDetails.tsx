import React, { useState, useEffect } from 'react';
import { irysServiceSafe as irysService } from '../../services/irysServiceSafe';
import { TransactionDetails as TxDetails } from '../../types';
import Card from './Card';
import Button from './Button';

interface TransactionDetailsProps {
  transactionId: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transactionId }) => {
  const [details, setDetails] = useState<TxDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!transactionId) return;
    
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const txDetails = await irysService.getTransactionDetails(transactionId);
        setDetails(txDetails);
      } catch (err) {
        console.error('Error fetching transaction details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transaction details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [transactionId]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  if (isLoading) {
    return (
      <Card title="Transaction Details">
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card title="Transaction Details">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>Error: {error}</p>
        </div>
      </Card>
    );
  }
  
  if (!details) {
    return (
      <Card title="Transaction Details">
        <div className="p-4">
          <p className="text-gray-500">No transaction details available.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Transaction Details">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Transaction ID</h3>
          <div className="flex items-center mt-1">
            <code className="bg-gray-100 p-2 rounded font-mono text-sm w-full overflow-x-auto">
              {details.transactionId}
            </code>
            <button 
              onClick={() => copyToClipboard(details.transactionId)}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700">Transaction Hash (Signature)</h3>
          <div className="flex items-center mt-1">
            <code className="bg-gray-100 p-2 rounded font-mono text-sm w-full overflow-x-auto">
              {details.transactionHash}
            </code>
            <button 
              onClick={() => copyToClipboard(details.transactionHash)}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {details.owner && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Owner</h3>
            <p className="font-mono text-sm mt-1 break-all">{details.owner}</p>
          </div>
        )}
        
        {details.timestamp && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Timestamp</h3>
            <p className="text-sm mt-1">{formatTimestamp(details.timestamp)}</p>
          </div>
        )}
        
        {details.blockHeight && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Block Height</h3>
            <p className="text-sm mt-1">{details.blockHeight}</p>
          </div>
        )}
        
        {details.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Tags</h3>
            <div className="mt-1 border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left font-medium text-gray-500">Name</th>
                    <th className="py-2 px-4 text-left font-medium text-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {details.tags.map((tag, index) => (
                    <tr key={index} className="bg-white">
                      <td className="py-2 px-4 font-mono">{tag.name}</td>
                      <td className="py-2 px-4 font-mono">{tag.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex space-x-3 pt-2">
          <Button 
            onClick={() => window.open(details.explorerUrl, '_blank')}
            variant="primary"
            size="sm"
          >
            View in Explorer
          </Button>
          
          {details.ownerExplorerUrl && (
            <Button 
              onClick={() => window.open(details.ownerExplorerUrl!, '_blank')}
              variant="secondary"
              size="sm"
            >
              View Owner
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionDetails; 
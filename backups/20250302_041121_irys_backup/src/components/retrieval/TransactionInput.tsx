import React, { useState } from 'react';
import Button from '../common/Button';
import { useIrys } from '../../hooks/useIrys';

interface TransactionInputProps {
  onRetrieve: (transactionId: string) => void;
}

const TransactionInput: React.FC<TransactionInputProps> = ({ onRetrieve }) => {
  const [transactionId, setTransactionId] = useState<string>('');
  const { isLoading, isDevnet } = useIrys();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert('Please enter a transaction ID');
      return;
    }
    onRetrieve(transactionId.trim());
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="transaction-id" className="block text-sm font-medium text-gray-700">
            Transaction ID
          </label>
          <input
            id="transaction-id"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter the Irys transaction ID to retrieve data..."
          />
          <div className="text-sm text-gray-500">
            <span>Network: </span>
            <span className="px-2 py-0.5 bg-gray-200 rounded">
              {isDevnet ? 'Devnet' : 'Sepolia Testnet'}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          fullWidth
        >
          Retrieve Data
        </Button>
      </form>
    </div>
  );
};

export default TransactionInput; 
import React, { useState, useEffect } from 'react';
import { useIrys } from '../contexts/IrysContext';
import { useWallet } from '../contexts/WalletContext';
import Card from './common/Card';
import Button from './common/Button';
import { FaWallet, FaSpinner, FaInfoCircle } from 'react-icons/fa';

// Helper to format wei to ether with appropriate units
const formatWeiToEther = (weiValue: string | undefined) => {
  if (!weiValue) return '0 ETH';
  
  try {
    // Handle the case where value is already in ETH format (decimal number)
    if (weiValue.includes('.')) {
      const etherValue = parseFloat(weiValue);
      
      if (etherValue === 0) {
        return '0 ETH';
      } else if (etherValue < 0.000001) {
        return `${etherValue.toExponential(6)} ETH`;
      }
      
      return `${etherValue.toFixed(6)} ETH`;
    }
    
    // For actual wei values (integers)
    const wei = BigInt(weiValue.toString());
    
    // Convert wei to ether
    const ether = Number(wei) / 1e18;
    
    if (ether === 0) {
      return '0 ETH';
    } else if (ether < 0.000001) {
      return `${ether.toExponential(6)} ETH`;
    }
    
    return `${ether.toFixed(6)} ETH`;
  } catch (e) {
    console.error('Error formatting wei to ether:', e);
    return '? ETH';
  }
};

interface IrysBalanceProps {
  minimal?: boolean;
}

const IrysBalance: React.FC<IrysBalanceProps> = ({ minimal = false }) => {
  const { isConnected, connectToIrys, balance, refreshBalance, fundIrys } = useIrys();
  const { isConnected: isWalletConnected, connectWallet } = useWallet();
  
  const [fundAmount, setFundAmount] = useState<string>('0.01');
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingTx, setPendingTx] = useState<{ hash: string, amount: string } | null>(null);
  
  // Refresh balance when wallet or Irys connection changes
  useEffect(() => {
    if (isWalletConnected && isConnected) {
      handleRefreshBalance();
    }
  }, [isWalletConnected, isConnected]);
  
  // Check for pending transactions in localStorage on component mount
  useEffect(() => {
    const storedTxHash = localStorage.getItem('last_funding_tx_hash');
    const storedTxTime = localStorage.getItem('last_funding_time');
    const storedAmount = localStorage.getItem('last_funding_amount');
    
    if (storedTxHash && storedTxTime && storedAmount) {
      // Only consider transactions from the last 30 minutes
      const txTime = parseInt(storedTxTime);
      const now = Date.now();
      const thirtyMinutesMs = 30 * 60 * 1000;
      
      if (now - txTime < thirtyMinutesMs) {
        setPendingTx({
          hash: storedTxHash,
          amount: storedAmount
        });
      } else {
        // Clear old transaction data
        localStorage.removeItem('last_funding_tx_hash');
        localStorage.removeItem('last_funding_time');
        localStorage.removeItem('last_funding_amount');
      }
    }
  }, []);
  
  // Handle refresh balance
  const handleRefreshBalance = async () => {
    if (!isWalletConnected) {
      setError('Wallet not connected');
      return;
    }
    
    if (!isConnected) {
      try {
        await connectToIrys();
      } catch (error: any) {
        setError(`Failed to connect to Irys: ${error.message}`);
        return;
      }
    }
    
    setIsRefreshing(true);
    setError(null);
    
    try {
      await refreshBalance();
    } catch (error: any) {
      setError(`Failed to fetch balance: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle fund button click
  const handleFund = async () => {
    setError(null);
    setSuccess(null);
    
    if (!isWalletConnected) {
      try {
        await connectWallet();
      } catch (error: any) {
        setError(`Failed to connect wallet: ${error.message}`);
        return;
      }
    }
    
    if (!isConnected) {
      try {
        await connectToIrys();
      } catch (error: any) {
        setError(`Failed to connect to Irys: ${error.message}`);
        return;
      }
    }
    
    // Validate fund amount
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setIsFunding(true);
    
    try {
      const result = await fundIrys(fundAmount);
      console.log('Funding result:', result);
      
      // Check if we received a pending transaction result using type assertion
      if (result && typeof result === 'object' && 
          'status' in (result as any) && (result as any).status === 'pending') {
        const pendingResult = result as any;
        // Set pending transaction state
        setPendingTx({
          hash: pendingResult.txHash || '',
          amount: fundAmount
        });
        
        // Show pending message instead of error
        const txHashDisplay = pendingResult.txHash ? pendingResult.txHash.substring(0, 10) : '';
        setSuccess(`Transaction submitted and processing. It may take a few minutes to complete. ${txHashDisplay ? `Transaction ID: ${txHashDisplay}...` : ''}`);
      } else {
        // Normal success case
        setSuccess(`Successfully funded ${fundAmount} ETH to your Irys balance`);
        setPendingTx(null);
      }
      
      // Refresh balance after funding
      await refreshBalance();
      
      // Reset fund amount
      setFundAmount('0.01');
    } catch (error: any) {
      console.error('Funding error:', error);
      
      // Check if the error contains information about a pending transaction
      if (error.message && error.message.includes('processing') && error.message.includes('transaction')) {
        // Extract transaction hash if possible
        const hashMatch = error.message.match(/\((0x[a-fA-F0-9]+)/);
        const txHash = hashMatch ? hashMatch[1] : '';
        
        if (txHash) {
          setPendingTx({
            hash: txHash,
            amount: fundAmount
          });
          
          // Show as a success with pending status instead of an error
          setSuccess(`Transaction submitted and processing. It may take a few minutes to complete. Transaction ID: ${txHash.substring(0, 10)}...`);
        } else {
          // No hash but still pending
          setSuccess("Transaction submitted and processing. Please wait a few minutes for it to complete.");
        }
      } else if (error.message && error.message.includes('unable to resolve blockHeight')) {
        // This specific error often means the transaction is actually processing
        setSuccess("Transaction submitted and processing. The network is confirming your transaction. Please wait a few minutes.");
      } else {
        // Regular error handling
        setError(`Funding failed: ${error.message}`);
      }
    } finally {
      setIsFunding(false);
    }
  };
  
  // Minimal view
  if (minimal) {
    return (
      <div className="flex items-center space-x-2">
        <FaWallet className="text-gray-500" />
        <span className="font-medium">
          {isRefreshing ? (
            <FaSpinner className="animate-spin inline mr-1" />
          ) : (
            formatWeiToEther(balance || '0')
          )}
        </span>
        <button
          onClick={handleRefreshBalance}
          className="text-primary hover:text-primary-dark"
          title="Refresh balance"
          disabled={isRefreshing}
        >
          ↻
        </button>
      </div>
    );
  }
  
  // Full view
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Irys Balance</h2>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <div className="text-gray-400 mb-1">Current Balance</div>
          <div className="text-3xl font-bold flex items-center text-[#00ffd5]">
            {isRefreshing ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              formatWeiToEther(balance || '0')
            )}
            <button
              onClick={handleRefreshBalance}
              className="ml-2 text-[#00ffd5] hover:text-[#00e6c0] text-sm"
              disabled={isRefreshing}
            >
              ↻
            </button>
          </div>
        </div>
        
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <label htmlFor="fundAmount" className="block text-sm font-medium text-gray-300 mb-1">
              Fund Amount (ETH)
            </label>
            <input
              id="fundAmount"
              type="number"
              min="0.001"
              step="0.001"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent bg-[#1a1b1e] text-white border-[#3a3b3e]"
            />
          </div>
          <Button
            onClick={handleFund}
            disabled={isFunding || !fundAmount || parseFloat(fundAmount) <= 0}
            className="px-4 py-2 bg-[#00ffd5] hover:bg-[#00e6c0] text-black"
          >
            {isFunding ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Funding...
              </>
            ) : (
              'Fund'
            )}
          </Button>
        </div>
      </div>
      
      {/* New: Important Information Section */}
      <div className="bg-[#1a1b1e] p-4 rounded-lg border border-[#3a3b3e] mb-6">
        <h4 className="text-[#00ffd5] font-medium mb-3 flex items-center">
          <FaInfoCircle className="mr-2" />
          Important Information About Funding
        </h4>
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-4 w-4 text-[#00ffd5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="ml-2">
              <span className="font-medium text-[#00ffd5]">Stay on this page</span> until the funding transaction is complete. Navigating away may interrupt the process.
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-4 w-4 text-[#00ffd5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="ml-2">
              Balance updates may take <span className="font-medium text-[#00ffd5]">1-2 minutes</span> to reflect after funding. Click the refresh button next to your balance to check for updates.
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-4 w-4 text-[#00ffd5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="ml-2">
              If your balance doesn't update after 2 minutes, try refreshing the page or reconnecting your wallet.
            </p>
          </div>
        </div>
      </div>
      
      {/* Information */}
      <div className="bg-[#1a1b1e] text-gray-300 border border-[#3a3b3e] p-4 rounded-md flex">
        <FaInfoCircle className="flex-shrink-0 mt-1 mr-3 text-[#00ffd5]" />
        <div className="text-sm">
          <p className="font-medium text-[#00ffd5]">About Irys Balance</p>
          <p className="mt-1">
            Your Irys balance is used to pay for uploads larger than 95KB. 
            Funding your Irys balance allows you to upload files without having to pay each time.
          </p>
          <p className="mt-1">
            The balance shown is specific to the Sepolia network and can only be used for uploads on this network.
          </p>
        </div>
      </div>
      
      {/* Pending Transaction Status */}
      {pendingTx && (
        <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 text-yellow-200 rounded">
          <div className="flex items-center mb-2">
            <div className="animate-pulse mr-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-yellow-200">Transaction Pending</h3>
          </div>
          <p className="mb-2">
            Your funding transaction of {pendingTx.amount} ETH is still processing on the Sepolia network. 
            This can take several minutes to complete depending on network congestion.
          </p>
          <div className="flex items-center mt-3 space-x-3">
            <a 
              href={`https://sepolia.etherscan.io/tx/${pendingTx.hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-yellow-200 hover:text-yellow-100 underline"
            >
              <span className="mr-1">View on Etherscan</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={handleRefreshBalance}
              className="inline-flex items-center text-yellow-200 hover:text-yellow-100"
            >
              <span className="mr-1">Check Balance</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Error messages with MetaMask disclaimer */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded">
          <div className="flex items-start">
            <svg className="h-5 w-5 flex-shrink-0 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium">{error}</p>
              
              {/* MetaMask transaction disclaimer */}
              <div className="mt-3 text-sm bg-red-950 p-3 rounded border border-red-700/50">
                <p className="font-medium mb-1">Important MetaMask Transaction Note:</p>
                <p>Please check if your transaction is still pending in MetaMask. If the transaction completes in your wallet, your Irys account will be funded automatically within a few minutes, even if you see an error here.</p>
                <div className="mt-2 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You can refresh your balance later to confirm the update.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-900/50 border border-green-700 text-green-200 rounded">
          {success}
        </div>
      )}
    </Card>
  );
};

export default IrysBalance; 
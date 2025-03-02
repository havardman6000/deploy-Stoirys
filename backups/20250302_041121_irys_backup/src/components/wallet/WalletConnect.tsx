import React, { useState, useEffect, useRef } from 'react';
import { useIrys } from '../../hooks/useIrys';
import Button from '../common/Button';
import  from './NetworkSelector';
import { useIrysContext } from '../../providers/IrysProvider';
import { getEthereum } from '../../config/polyfills';
import { irysServiceSafe } from '../../services/irysServiceSafe';

interface WalletConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnectionChange }) => {
  const [address, setAddress] = useState<string | null>(null);
  const { 
    fetchBalance, 
    isLoading: irysLoading, 
    fundNode, 
    isDevnet, 
    balance,
    setWalletConnection,
    connectWallet,
    disconnectWallet,
    verifyWalletConnected,
    isWalletConnected,
    error: irysError
  } = useIrys();
  const { isEthereumAvailable, networkError } = useIrysContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [fundAmount, setFundAmount] = useState<string>('0.01');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lastConnectionAttempt, setLastConnectionAttempt] = useState<number>(0);
  const [userDisconnected, setUserDisconnected] = useState<boolean>(false);
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [isRequestingTokens, setIsRequestingTokens] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fundingStatus, setFundingStatus] = useState<'processing' | 'pending_verification' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState<string | null>(null);

  // Check wallet connection on first render and when connection state might have changed
  useEffect(() => {
    // Initial connection check
    checkConnection();
    
    // Check connection state when window gains focus
    const handleFocus = () => {
      // Only check if it's been more than 2 seconds since last connect attempt
      // to avoid repeated checks during rapid focus changes
      const now = Date.now();
      if (now - lastConnectionAttempt > 2000) {
        checkConnection();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);  // Empty dependency array - only run on mount

  // Set up wallet event listeners
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('[WalletConnect] Accounts changed:', accounts);
      if (accounts.length === 0) {
        // User disconnected their wallet
        console.log('[WalletConnect] Wallet disconnected');
        setAddress(null);
        setWalletConnection(false);
        disconnectWallet();
      } else {
        // User switched to a different account
        console.log('[WalletConnect] New account:', accounts[0]);
        setAddress(accounts[0]);
        setWalletConnection(true);
        // Update balance for new account
        fetchBalance().catch(console.error);
      }
    };

    const handleChainChanged = () => {
      // When the chain changes, refresh the page as recommended by MetaMask
      console.log('[WalletConnect] Chain changed, refreshing state');
      checkConnection();
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      // Clean up listeners
      if (ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [fetchBalance, disconnectWallet, setWalletConnection]); // Add proper dependencies

  // Report connection status to parent component when address changes
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(!!address);
    }
  }, [address, onConnectionChange]);

  // Update error message when irysError changes
  useEffect(() => {
    if (irysError) {
      setErrorMessage(irysError);
    }
  }, [irysError]);

  // Use a debounced version of the connection check to prevent infinite loops
  const checkConnection = async () => {
    // Check if user has explicitly disconnected in this session or a previous one
    const userDisconnectedPreviously = localStorage.getItem('wallet_user_disconnected') === 'true';
    
    if (userDisconnected || userDisconnectedPreviously) {
      console.log('[WalletConnect] User has disconnected, skipping auto-reconnect');
      return;
    }

    setLastConnectionAttempt(Date.now());
    try {
      console.log('[WalletConnect] Checking wallet connection status');
      const ethereum = getEthereum();
      if (!ethereum) {
        console.log('[WalletConnect] No ethereum provider found');
        setAddress(null);
        setWalletConnection(false);
        return;
      }
      
      // Don't use the stored state, make a fresh check every time to ensure consistency
      // IMPORTANT: This only checks existing permissions, doesn't request new ones
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      console.log('[WalletConnect] Active accounts:', accounts);
      
      if (accounts && accounts.length > 0) {
        console.log('[WalletConnect] Wallet is connected with address:', accounts[0]);
        
        // Set the address in UI
        if (address !== accounts[0]) {
          setAddress(accounts[0]);
        }
        
        // CRITICAL: Only set wallet connection state if we have an account AND
        // make sure we verify the wallet connection
        if (!isWalletConnected) {
          // Verify actual wallet connection instead of assuming it's connected
          const walletStatus = await verifyWalletConnected();
          console.log('[WalletConnect] Verified connection status:', walletStatus);
          setWalletConnection(walletStatus.isConnected);
        }
        
        // Only try to fetch balance if truly connected
        if (isWalletConnected) {
          fetchBalance().catch(err => {
            console.error('[WalletConnect] Error fetching balance:', err);
          });
        }
      } else {
        // No connected accounts found - definitely not connected
        console.log('[WalletConnect] No connected accounts found');
        if (address !== null) {
          setAddress(null);
        }
        if (isWalletConnected) {
          setWalletConnection(false);
        }
      }
    } catch (error) {
      console.error('[WalletConnect] Error checking connection:', error);
      setAddress(null);
      setWalletConnection(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConnectWallet = async () => {
    // User is explicitly connecting, reset the disconnected flag
    setUserDisconnected(false);
    
    // IMPORTANT: Reset any cached wallet state
    if (address) {
      setAddress(null);
    }
    
    // Clear any stored wallet connection state
    try {
      localStorage.removeItem('wallet_user_disconnected');
      // Also clear any other wallet-related items that might be in localStorage
      localStorage.removeItem('wallet_address');
      localStorage.removeItem('wallet_connected');
    } catch (err) {
      console.error('[WalletConnect] Error removing state from localStorage:', err);
    }
    
    // Clear any previous error messages
    setErrorMessage(null);
    setLastConnectionAttempt(Date.now());
    
    try {
      console.log('[WalletConnect] Initiating fresh wallet connection');
      
      // Check if ethereum provider exists
      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error('No Ethereum provider found. Please install MetaMask.');
      }
      
      // FORCE a fresh connection request using eth_requestAccounts
      console.log('[WalletConnect] Requesting accounts with user prompt...');
      
      // This should trigger the MetaMask popup
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts',
        params: [] // Force a fresh request
      });
      
      if (accounts && accounts.length > 0) {
        console.log('[WalletConnect] Connection successful with accounts:', accounts);
        
        // Update UI and state
        setAddress(accounts[0]);
        setWalletConnection(true);
        
        // Connect to Irys and get balance
        try {
          await fetchBalance();
        } catch (balanceError) {
          console.error('[WalletConnect] Failed to fetch balance:', balanceError);
          if (balanceError instanceof Error) {
            setErrorMessage(`Connected to wallet, but couldn't load balance: ${balanceError.message}`);
          }
        }
      } else {
        throw new Error('No accounts available after connection request');
      }
    } catch (error) {
      console.error('[WalletConnect] Error connecting wallet:', error);
      
      // Reset states on error
      setAddress(null);
      setWalletConnection(false);
      
      // Set a user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('rejected')) {
          setErrorMessage('Wallet connection was rejected. Please try again and approve the connection request.');
        } else if (error.message.includes('wallet') || error.message.includes('account')) {
          setErrorMessage(error.message);
        } else if (error.message.includes('Irys')) {
          setErrorMessage(`Wallet connected, but Irys connection failed: ${error.message}`);
        } else {
          setErrorMessage(`Connection error: ${error.message}`);
        }
      } else {
        setErrorMessage('An unknown error occurred while connecting your wallet.');
      }
    }
  };

  const handleDisconnectWallet = async () => {
    console.log('[WalletConnect] User initiated wallet disconnect');
    
    // Set the user disconnected flag so we won't auto-reconnect
    setUserDisconnected(true);
    
    // Clear the address state immediately to update UI
    setAddress(null);
    
    // Clear any error messages
    setErrorMessage(null);
    
    // Force clear any stored state
    try {
      // Clear all wallet-related localStorage entries
      localStorage.setItem('wallet_disconnected', 'true');
      localStorage.removeItem('wallet_address');
      localStorage.removeItem('wallet_connected');
      
      // Clear any additional localStorage items that might be related to wallet
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('wallet') || key.includes('irys') || key.includes('ethereum'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (err) {
      console.error('[WalletConnect] Error updating localStorage on disconnect:', err);
    }
    
    // Call the disconnectWallet method from the useIrys hook
    // This will update the isWalletConnected state, reset the balance,
    // and clean up the WebIrys connection
    await disconnectWallet();
    
    // Close the dropdown
    setShowDropdown(false);
    
    // Explicitly update UI states
    setWalletConnection(false);
    
    // Try to force provider disconnect if needed
    const forceDisconnect = async () => {
      if (!getEthereum()) return;
      
      try {
        const ethereum = getEthereum();
        
        // Check if still connected
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts && accounts.length > 0) {
          console.log('[WalletConnect] Still connected after disconnect, accounts:', accounts);
          
          // Try additional disconnection methods
          // For MetaMask and similar wallets
          if (typeof ethereum._handleDisconnect === 'function') {
            await ethereum._handleDisconnect();
            console.log('[WalletConnect] Called ethereum._handleDisconnect()');
          }
          
          // Clear cached accounts if possible
          if (ethereum.selectedAddress) {
            try {
              // This is a hack, but might work for some wallets
              Object.defineProperty(ethereum, 'selectedAddress', {
                value: null,
                writable: true,
              });
              console.log('[WalletConnect] Cleared ethereum.selectedAddress');
            } catch (err) {
              console.error('[WalletConnect] Could not clear selectedAddress:', err);
            }
          }
          
          // Last resort: prompt for page refresh
          alert("Your wallet is still connected. The page will refresh to complete disconnection.");
          window.location.reload();
        } else {
          console.log('[WalletConnect] Successfully disconnected, no accounts found');
        }
      } catch (err) {
        console.error('[WalletConnect] Error in forceDisconnect:', err);
      }
    };
    
    // Give the regular disconnect a moment to work
    setTimeout(forceDisconnect, 500);
  };

  const handleFund = async () => {
    if (!fundAmount || loading) return;
    
    try {
      setLoading(true);
      setErrorMessage(null);
      setFundingStatus('processing');
      
      console.log('[WalletConnect] Starting to fund with amount:', fundAmount);
      
      // Check if we have a pending transaction from a previous attempt
      const lastFundingTime = localStorage.getItem('last_funding_time');
      const lastFundingTxHash = localStorage.getItem('last_funding_tx_hash');
      
      // If we have a recent transaction (less than 5 minutes old), show it to the user
      if (lastFundingTime && lastFundingTxHash) {
        const timeSinceFunding = Date.now() - parseInt(lastFundingTime);
        if (timeSinceFunding < 5 * 60 * 1000) { // 5 minutes
          console.log(`[WalletConnect] Recent funding transaction found: ${lastFundingTxHash}`);
          setFundingStatus('pending_verification');
          
          // Show a message about the pending transaction
          setMessage(`Your recent funding transaction (${lastFundingTxHash.substring(0, 8)}...) is still processing. Please wait a few minutes for it to be confirmed.`);
          
          // Refresh balance in case it was updated
          await fetchBalance();
          
          // Return early, but keep loading state for a moment to show we tried
          setTimeout(() => setLoading(false), 2000);
          return;
        }
      }
      
      // If no recent transaction or it's old, proceed with new funding
      const result = await fundNode(fundAmount);
      
      console.log('[WalletConnect] Funding result:', result);
      
      // If transaction is pending, show appropriate message
      if (result && result.status === 'pending') {
        setFundingStatus('pending_verification');
        setMessage(`Your transaction is processing. It may take a few minutes to be confirmed on the blockchain. Transaction ID: ${result.txHash?.substring(0, 8)}...`);
        
        // Schedule balance checks
        scheduleBalanceChecks();
      } else {
        setFundingStatus('success');
        setMessage('Funding completed! Your balance will update shortly.');
        
        // Refresh balance immediately and then again after a delay
        await fetchBalance();
        scheduleBalanceChecks();
      }
      
      // Clear the input
      setFundAmount('');
    } catch (error) {
      console.error('[WalletConnect] Funding error:', error);
      setFundingStatus('failed');
      
      if (error instanceof Error) {
        // Check if this is a verification error but the transaction might be valid
        if (error.message.includes('failed to post funding tx') || 
            error.message.includes('tx doesn\'t exist')) {
          setMessage('Your transaction was submitted but verification is pending. Please check your wallet for the transaction status and try refreshing your balance in a few minutes.');
          
          // Schedule balance checks anyway
          scheduleBalanceChecks();
        } else {
          // Standard error handling
          setErrorMessage(error.message || 'Unknown error during funding');
        }
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Schedule multiple balance checks with increasing delays
  const scheduleBalanceChecks = () => {
    const delays = [5000, 15000, 30000, 60000]; // 5s, 15s, 30s, 60s
    
    delays.forEach(delay => {
      setTimeout(() => {
        console.log(`[WalletConnect] Scheduled balance check after ${delay}ms`);
        fetchBalance().catch(err => {
          console.warn('[WalletConnect] Error in scheduled balance check:', err);
        });
      }, delay);
    });
  };

  // Function to request tokens from the Irys devnet faucet
  const handleRequestDevnetTokens = async () => {
    if (!isDevnet) {
      setErrorMessage('Faucet is only available on devnet');
      return;
    }
    
    if (!address) {
      setErrorMessage('Please connect your wallet first');
      return;
    }
    
    setIsRequestingTokens(true);
    setErrorMessage(null);
    
    try {
      console.log('[WalletConnect] Requesting devnet tokens for:', address);
      const success = await irysServiceSafe.requestDevnetTokens(address);
      
      if (success) {
        // Refresh balance after requesting tokens
        await fetchBalance();
        setErrorMessage('Successfully requested devnet tokens! Your balance should update shortly.');
      } else {
        // If faucet request failed but didn't throw an error
        setErrorMessage(
          'Failed to get tokens from the devnet faucet. Please try again in a few moments, or try uploading directly without pre-funding.'
        );
      }
    } catch (error) {
      console.error('[WalletConnect] Error requesting devnet tokens:', error);
      
      // More helpful error message with alternative instructions
      setErrorMessage(
        'Could not reach the devnet faucet. You can still upload files without pre-funding using the "pay-as-you-go" option during upload.'
      );
    } finally {
      setIsRequestingTokens(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Render an error message if there is one
  const renderError = () => {
    if (!errorMessage) return null;
    
    // Determine if this is an error message or an informational message
    const isError = errorMessage.toLowerCase().includes('error') || 
                    errorMessage.toLowerCase().includes('failed') ||
                    errorMessage.toLowerCase().includes('invalid') ||
                    errorMessage.toLowerCase().includes('rejected');
    
    const bgColor = isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700';
    const title = isError ? 'Error' : 'Information';
    
    return (
      <div className={`p-3 border rounded-lg text-sm mb-4 ${bgColor}`}>
        <p className="font-medium mb-1">{title}</p>
        <p>{errorMessage}</p>
      </div>
    );
  };

  if (networkError) {
    return (
      <div className="p-4 bg-red-100 rounded-lg shadow text-center">
        <p className="text-red-800 mb-2">Network connection error:</p>
        <p className="text-red-600">{networkError}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
          variant="secondary"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  if (!isEthereumAvailable) {
    return (
      <div className="p-4 bg-yellow-100 rounded-lg shadow text-center">
        <p className="text-yellow-800 mb-2">Ethereum provider not detected</p>
        <p className="text-yellow-700">
          Please install MetaMask or another Ethereum wallet to use this application.
        </p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <div>
      {renderError()}
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
        {!address ? (
          <Button
            onClick={handleConnectWallet}
            className="font-medium rounded-full px-6 py-2 transform transition duration-150 hover:scale-105"
            isLoading={irysLoading}
          >
            Connect Wallet
          </Button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 bg-white font-medium text-gray-700 transform transition duration-150 hover:shadow-sm"
            >
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" title="Connected"></div>
                <span>{formatAddress(address)}</span>
              </div>
              <svg
                className={`h-4 w-4 text-gray-400 transform transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-lg shadow-lg z-10 origin-top-right animate-popIn">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Connected Account</span>
                  </div>
                  <div className="font-mono text-sm break-all">{address}</div>
                </div>
                
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Balance</span>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={fetchBalance} 
                      isLoading={irysLoading}
                      className="px-2 py-1 text-xs"
                    >
                      Refresh
                    </Button>
                  </div>
                  <div className="text-lg font-semibold">{parseFloat(balance).toFixed(6)} IRYS</div>
                  
                  <div className="mt-3 mb-3 p-3 bg-green-50 rounded-md text-sm text-green-700 border border-green-100">
                    <p className="font-semibold mb-1">Upload Without Pre-funding</p>
                    <p className="text-xs">
                      You can upload files directly using the pay-as-you-go method which funds the upload from your wallet at the time of upload.
                      No need to pre-fund your account!
                    </p>
                  </div>
                  
                  {!isDevnet && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md text-xs text-blue-700">
                      <p className="font-medium">Sepolia Testnet</p>
                      <p>Using Sepolia testnet for uploads with your connected Ethereum wallet.</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-col">
                    <div className="flex items-center mb-2">
                      <input
                        type="number"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        step="0.01"
                        min="0.01"
                        className="p-2 text-sm border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Amount to fund"
                      />
                      <span className="bg-gray-100 text-gray-700 font-medium text-sm px-3 py-2 rounded-r-md">
                        IRYS
                      </span>
                    </div>
                    <div className="mt-2">
                      <Button
                        onClick={handleFund}
                        isLoading={loading}
                        size="sm"
                        variant="primary"
                        fullWidth
                        className="mb-2"
                      >
                        Fund (Optional)
                      </Button>
                      
                      {isDevnet && (
                        <>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={handleRequestDevnetTokens}
                            isLoading={isRequestingTokens}
                            disabled={isRequestingTokens || !address}
                            fullWidth
                            className="mb-2"
                          >
                            Get Free Devnet Tokens
                          </Button>
                          <p className="text-xs text-gray-600 mb-3">
                            Even without tokens, you can upload files with the "pay-as-you-go" option
                            which will fund directly from your wallet at upload time.
                          </p>
                        </>
                      )}
                      
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={fetchBalance}
                          isLoading={irysLoading}
                          fullWidth
                          className="py-3 relative animate-pulse-slow border-2 border-blue-600"
                        >
                          <span className="flex items-center justify-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-2" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Check Balance
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <Button 
                    onClick={handleDisconnectWallet} 
                    variant="danger" 
                    size="sm"
                    fullWidth
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <NetworkSelector />
      </div>
    </div>
  );
};

export default WalletConnect; 
//src/components/wallet/WalletConnect.tsx
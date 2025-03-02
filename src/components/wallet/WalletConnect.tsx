import React, { useState, useEffect, useRef } from 'react';
import { useIrys } from '../../hooks/useIrys';
import Button from '../common/Button';
import NetworkSelector from './NetworkSelector';
import { useIrysContext } from '../../providers/IrysProvider';
import { getEthereum } from '../../config/polyfills';

interface WalletConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnectionChange }) => {
  const [address, setAddress] = useState<string | null>(null);
  const { 
    fetchBalance, 
    isLoading: irysLoading, 
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lastConnectionAttempt, setLastConnectionAttempt] = useState<number>(0);
  const [userDisconnected, setUserDisconnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [networkName, setNetworkName] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState<string | null>(null);

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

  // Update walletAddress when address changes
  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    } else {
      setWalletAddress('');
    }
  }, [address]);

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
      
      // Try to add the Irys network if it doesn't exist
      try {
        setLoading(true);
        setMessage("Checking for Irys network...");
        
        // First check if we're on the right network
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        
        // Irys now uses Testnet with chain ID 0x4f6 (hex for 1270)
        const irysNetworkId = '0x4f6';
        
        if (chainId !== irysNetworkId) {
          // We need to switch to Irys network or add it if it doesn't exist
          setMessage("Switching to Irys network...");
          
          try {
            // Try to switch to the Irys network
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: irysNetworkId }],
            });
            console.log('[WalletConnect] Successfully switched to Irys network');
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902 || switchError.message.includes('wallet_addEthereumChain')) {
              setMessage("Adding Irys network to your wallet...");
              
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: irysNetworkId,
                      chainName: 'Irys Network',
                      nativeCurrency: {
                        name: 'IRYS',
                        symbol: 'IRYS',
                        decimals: 18,
                      },
                      rpcUrls: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'],
                      blockExplorerUrls: ['https://storage-explorer.irys.xyz'],
                    },
                  ],
                });
                console.log('[WalletConnect] Successfully added Irys network');
              } catch (addError) {
                console.error('[WalletConnect] Error adding Irys network:', addError);
                throw new Error('Could not add Irys network to your wallet. Please add it manually.');
              }
            } else {
              console.error('[WalletConnect] Error switching to Irys network:', switchError);
              throw switchError;
            }
          }
        }
        
        setMessage("Requesting wallet connection...");
      } catch (networkError) {
        console.error('[WalletConnect] Network setup error:', networkError);
        setErrorMessage(`Network error: ${networkError instanceof Error ? networkError.message : 'Could not configure network'}`);
        setLoading(false);
        return;
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

  const handleNetworkChange = (network: string) => {
    setNetworkName(network);
    setShowNetworkSelector(false);
  };

  const toggleShowAddress = () => {
    setShowAddress(!showAddress);
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
      {showNetworkSelector && (
        <NetworkSelector />
      )}

      {isWalletConnected ? (
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
          <div className="flex space-x-2 items-center">
            {/* Wallet Info */}
            <div 
              className="flex items-center bg-gray-100 rounded-lg px-3 py-2 text-gray-800"
              onClick={toggleShowAddress}
            >
              <span className="relative flex h-3 w-3 mr-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isWalletConnected ? 'bg-green-400' : 'bg-red-400'
                } opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  isWalletConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
              </span>
              <span className="text-sm truncate max-w-[100px] sm:max-w-[150px]">
                {showAddress 
                  ? walletAddress
                  : walletAddress 
                    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                    : 'Connecting...'
                }
              </span>
            </div>
            
            {/* Disconnect button */}
            <button
              onClick={disconnectWallet}
              className="text-xs text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <span className="hidden sm:inline">Disconnect</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Network Info - Simplified */}
          <button 
            className="flex items-center bg-purple-100 rounded-lg px-3 py-2 text-purple-800 cursor-pointer"
            onClick={() => setShowNetworkSelector(!showNetworkSelector)}
          >
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <span className="text-sm mr-1">IRYS Network</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="text-white bg-purple-600 px-4 py-2 sm:py-1.5 rounded-lg hover:bg-purple-700 flex items-center text-base sm:text-sm"
          disabled={irysLoading}
        >
          {irysLoading ? (
            <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          )}
          Connect Wallet
        </button>
      )}
      
      {/* Error Modal */}
      {walletError && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Wallet Connection Error
              </h3>
              <button
                onClick={() => setWalletError(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4 text-gray-700">
              <p>{walletError}</p>
            </div>
            
            <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-100">
              <h4 className="font-medium text-red-700 mb-2">Troubleshooting steps:</h4>
              <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                <li>Make sure you have MetaMask installed and unlocked</li>
                <li>Try refreshing the page and connecting again</li>
                <li>Check if you're on a supported network (Ethereum, Polygon, Arbitrum)</li>
                <li>Ensure your wallet is properly set up and has some ETH for gas</li>
              </ul>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setWalletError(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Close
              </button>
              <button
                onClick={connectWallet}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 
//src/components/wallet/WalletConnect.tsx
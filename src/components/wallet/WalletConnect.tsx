import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useIrys } from '../../contexts/IrysContext';
import Button from '../common/Button';
import { FaWallet, FaSpinner, FaChevronDown, FaExternalLinkAlt, FaCopy, FaSignOutAlt, FaCheck, FaEthereum } from 'react-icons/fa';

interface WalletConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnectionChange }) => {
  // Get wallet state from context
  const { 
    isConnected: isWalletConnected,
    walletAddress, 
    balance: walletBalance,
    connectWallet: connectWalletContext,
    disconnectWallet: disconnectWalletContext,
    chainId,
    switchToSepoliaNetwork
  } = useWallet();

  // Get Irys state from context
  const { 
    isConnected: isIrysConnected,
    connectToIrys,
    disconnectFromIrys,
    balance: irysBalance,
    isLoading: irysLoading,
    errorMessage: irysError
  } = useIrys();

  // Component state
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAddress, setShowAddress] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add a state to show post-disconnect message
  const [showDisconnectMessage, setShowDisconnectMessage] = useState(false);

  // Create a ref for the wallet button
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add state to track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Check for disconnection message in localStorage on component mount
  useEffect(() => {
    const disconnectMessage = localStorage.getItem('wallet-disconnect-message');
    if (disconnectMessage) {
      // Show the disconnect message
      setShowDisconnectMessage(true);
      // Remove the message from localStorage
      localStorage.removeItem('wallet-disconnect-message');
      // Hide the message after 10 seconds
      setTimeout(() => {
        setShowDisconnectMessage(false);
      }, 10000);
    }
  }, []);

  // Notify parent of connection change
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(isWalletConnected);
      
      // Hide any wallet connection notifications when connected
      if (isWalletConnected) {
        const notifications = document.querySelectorAll('.wallet-notification');
        notifications.forEach(notification => {
          if (notification instanceof HTMLElement) {
            notification.style.display = 'none';
          }
        });
      }
    }
  }, [isWalletConnected, onConnectionChange]);

  // Handle error messages
  useEffect(() => {
    if (irysError) {
      setErrorMessage(irysError);
    }
  }, [irysError]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    // Use a more generic type for the event handler that works with both MouseEvent and TouchEvent
    const handleClickOutside = (event: Event) => {
      // On mobile, we want to be more aggressive about closing the dropdown
      if (
        showDropdown && 
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        console.log('Clicked outside dropdown, closing');
        setShowDropdown(false);
      }
    };

    // Add event listeners for both mousedown and touchstart to handle mobile better
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDropdown]);

  // Toggle address display
  const toggleAddressDisplay = () => {
    setShowAddress(!showAddress);
  };

  // Copy wallet address to clipboard
  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
        .then(() => {
          // Show a brief "Copied!" message
          const addressElement = document.getElementById('wallet-address');
          if (addressElement) {
            const originalText = addressElement.innerText;
            addressElement.innerText = 'Copied!';
            setTimeout(() => {
              addressElement.innerText = originalText;
            }, 1000);
          }
        })
        .catch(err => {
          console.error('Failed to copy address: ', err);
        });
    }
  };

  // Connect wallet
  const handleConnect = async () => {
    if (isConnecting) return; // Prevent multiple clicks
    
    setIsConnecting(true);
    setErrorMessage(null);
    
    try {
      // First, connect the wallet
      const connected = await connectWalletContext();
      
      if (connected) {
        // If we're not on Sepolia, switch to it
        if (chainId !== BigInt(11155111)) { // Sepolia chain ID
          await switchToSepoliaNetwork();
        }
        
        // Then connect to Irys
        await connectToIrys();
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      setErrorMessage(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const handleDisconnect = async () => {
    try {
      console.log("[WalletConnect] User initiated wallet disconnect");

      // Set the user disconnected flag through the context
      disconnectWalletContext();
      
      // First disconnect from Irys
      disconnectFromIrys();

      // Close the dropdown
      setShowDropdown(false);
      
      // Clear any error messages
      setErrorMessage(null);
      
      // Force clear any stored state in localStorage
      try {
        // Clear all wallet-related localStorage entries
        localStorage.setItem('wallet_disconnected', 'true');
        localStorage.removeItem('wallet_address');
        localStorage.removeItem('wallet_connected');
        localStorage.removeItem('walletconnect');
        localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
        
        // Clear any additional localStorage items that might be related to wallet
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('wallet') || key.includes('irys') || key.includes('ethereum'))) {
            localStorage.removeItem(key);
          }
        }
      } catch (err) {
        console.error("[WalletConnect] Error updating localStorage on disconnect:", err);
      }
      
      // Dispatch the wallet disconnection event for App.tsx to handle
      document.dispatchEvent(new CustomEvent('wallet-disconnected'));
      
      // Try to force provider disconnect if needed
      const forceDisconnect = async () => {
        if (!window.ethereum) return;
        
        try {
          const ethereum = window.ethereum;
          
          // Check if still connected
          if (ethereum.request) {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            
            if (accounts && accounts.length > 0) {
              console.log("[WalletConnect] Still connected after disconnect, accounts:", accounts);
              
              // Try additional disconnection methods
              // For MetaMask and similar wallets
              if (typeof (ethereum as any)._handleDisconnect === 'function') {
                await (ethereum as any)._handleDisconnect();
                console.log("[WalletConnect] Called ethereum._handleDisconnect()");
              }
              
              // Clear cached accounts if possible
              if ((ethereum as any).selectedAddress) {
                try {
                  // This is a hack, but might work for some wallets
                  Object.defineProperty(ethereum as any, 'selectedAddress', {
                    value: null,
                    writable: true,
                  });
                  console.log("[WalletConnect] Cleared ethereum.selectedAddress");
                } catch (err) {
                  console.error("[WalletConnect] Could not clear selectedAddress:", err);
                }
              }
              
              // Try to clear permissions (new addition from logs analysis)
              if ((ethereum as any)._metamask && typeof (ethereum as any)._metamask.clearPermissions === 'function') {
                try {
                  await (ethereum as any)._metamask.clearPermissions();
                  console.log("[WalletConnect] Cleared permissions via _metamask.clearPermissions()");
                } catch (permError) {
                  console.error("[WalletConnect] Error clearing permissions:", permError);
                }
              }
              
              // Try to revoke eth_accounts permission specifically (from logs)
              try {
                // This is used in add-info.md and works according to your logs
                if (ethereum.request) {
                  await ethereum.request({
                    method: 'wallet_revokePermissions',
                    params: [{ eth_accounts: {} }]
                  });
                  console.log("[WalletConnect] Revoked eth_accounts permission");
                }
              } catch (revokeError) {
                console.error("[WalletConnect] Error revoking permissions:", revokeError);
              }
              
              // Auto-refresh page as in add-info.md (without confirmation)
              console.log("[WalletConnect] Refreshing page to complete disconnection");
              localStorage.setItem('wallet-disconnect-message', 'Wallet disconnection completed via page refresh');
              window.location.reload();
            } else {
              console.log("[WalletConnect] Successfully disconnected, no accounts found");
              // Show message about successful disconnection
              setShowDisconnectMessage(true);
              setTimeout(() => setShowDisconnectMessage(false), 10000);
            }
          }
        } catch (err) {
          console.error("[WalletConnect] Error in forceDisconnect:", err);
        }
      };
      
      // Execute the force disconnect logic
      await forceDisconnect();
      
    } catch (error) {
      console.error("[WalletConnect] Error during disconnect:", error);
    }
  };

  // View on block explorer
  const viewOnExplorer = () => {
    if (walletAddress) {
      // Sepolia Etherscan
      window.open(`https://sepolia.etherscan.io/address/${walletAddress}`, '_blank');
    }
  };

  // Format address for display
  const formatAddress = (address: string | null | undefined) => {
    if (!address) return '';
    
    // For mobile view (very concise)
    if (windowWidth < 640) {
      return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
    }
    
    // For tablet/desktop (slightly more characters)
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Toggle dropdown function with enhanced logging
  const toggleDropdown = (e: React.MouseEvent) => {
    console.log("Toggle dropdown clicked");
    console.log("Current dropdown state:", showDropdown);
    
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling
    
    setShowDropdown(prev => !prev);
  };

  // Add useEffect to log state changes
  useEffect(() => {
    console.log(`Dropdown state changed to: ${showDropdown}`);
  }, [showDropdown]);

  // Connect button (disconnected state)
  if (!isWalletConnected) {
    return (
      <div>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center justify-center space-x-2"
        >
          <FaWallet className="h-5 w-5" />
          <span className="sm:inline">{isConnecting ? 'Connecting...' : <span><span className="hidden sm:inline">Connect </span>Wallet</span>}</span>
          {isConnecting && <FaSpinner className="animate-spin ml-1 h-5 w-5" />}
        </Button>
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      </div>
    );
  }

  // Connected wallet UI
  if (isWalletConnected) {
    return (
      <div className="relative z-50">
        <div className="flex items-center space-x-2">
          {/* Wallet Info Button - Responsive design */}
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center space-x-1 sm:space-x-2 py-1 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span id="wallet-address" className="text-xs sm:text-sm font-medium">
              {walletAddress ? formatAddress(walletAddress) : 'Connected'}
            </span>
            <FaChevronDown className="h-3 w-3 text-gray-500" />
          </button>
          
          {/* Quick Disconnect Button - Hidden on small screens */}
          <button
            onClick={handleDisconnect}
            className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors md:flex hidden"
            title="Disconnect Wallet"
          >
            <FaSignOutAlt className="h-4 w-4" />
          </button>
        </div>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-[calc(100vw-24px)] sm:w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden max-w-xs"
            style={{ borderRadius: '0.5rem' }}
          >
            {/* Wallet Address Section */}
            <div className="p-3 sm:p-4 border-b border-gray-700">
              <div className="mb-1 sm:mb-2 text-gray-400 text-xs">Connected Wallet</div>
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs sm:text-sm text-gray-300 truncate max-w-[180px]">
                  {walletAddress}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={copyAddressToClipboard}
                    className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700"
                    title="Copy address"
                  >
                    <FaCopy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={viewOnExplorer}
                    className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700"
                    title="View on Etherscan"
                  >
                    <FaExternalLinkAlt className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Balances Section */}
            <div className="p-3 sm:p-4 border-b border-gray-700">
              <div className="mb-1 sm:mb-2 text-gray-400 text-xs">Wallet Balances</div>
              
              {/* ETH Balance */}
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#00ffd5]">ETH Balance:</span>
                  <span className="text-xs sm:text-sm font-mono text-gray-300">
                    {walletBalance ? walletBalance : '...'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {walletBalance ? 'ETH' : 'Loading...'}
                </div>
              </div>
              
              {/* Irys Balance */}
              <div className="mb-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#00ffd5]">Irys Balance:</span>
                  <span className="text-xs sm:text-sm font-mono text-gray-300">
                    {irysBalance || '...'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {irysBalance ? 'ETH' : 'Loading...'}
                </div>
              </div>
            </div>
            
            {/* Disconnect Button */}
            <div className="p-3 sm:p-4">
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center space-x-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 rounded transition-colors"
              >
                <FaSignOutAlt className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Disconnect Wallet</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="absolute right-0 mt-2 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 z-40 w-64">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default WalletConnect; 
//src/components/wallet/WalletConnect.tsx
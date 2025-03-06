import React from 'react';
import { FaCopy, FaExternalLinkAlt, FaSignOutAlt } from 'react-icons/fa';

interface WalletDropdownProps {
  ethBalance: string;
  irysBalance: string;
  onDisconnect: () => void;
}

const WalletDropdown: React.FC<WalletDropdownProps> = ({
  ethBalance,
  irysBalance,
  onDisconnect
}) => {
  return (
    <div className="bg-[#111215] border border-[#3a3b3e] rounded-lg shadow-lg p-4 min-w-[240px]">
      <div className="flex items-center justify-between border-b border-[#3a3b3e] pb-3 mb-3">
        <div className="flex items-center">
          <div className="h-2 w-2 bg-[#00ffd5] rounded-full mr-2"></div>
          <span className="text-[#00ffd5] font-medium">Connected to Sepolia</span>
        </div>
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-[#00ffd5]">
            <FaCopy className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-[#00ffd5]">
            <FaExternalLinkAlt className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-[#1a1b1e] p-2 rounded">
          <div className="text-[#00ffd5] text-sm mb-1">ETH Balance:</div>
          <div className="text-white font-medium">{ethBalance || '0.00'} ETH</div>
        </div>
        
        <div className="bg-[#1a1b1e] p-2 rounded">
          <div className="text-[#00ffd5] text-sm mb-1">Irys Balance:</div>
          <div className="text-white font-medium">{irysBalance || '0.00'} ETH</div>
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDisconnect();
          return false;
        }}
        className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
      >
        <FaSignOutAlt className="h-5 w-5" />
        <span>Disconnect Wallet</span>
      </button>
    </div>
  );
};

export default WalletDropdown; 
//src/components/WalletDropdown.tsx
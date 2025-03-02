import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { irysServiceSafe as irysService } from '../services/irysServiceSafe';
import { getEthereum } from '../config/polyfills';

interface IrysContextType {
  isIrysAvailable: boolean;
  isEthereumAvailable: boolean;
  networkError: string | null;
}

const IrysContext = createContext<IrysContextType>({
  isIrysAvailable: false,
  isEthereumAvailable: false,
  networkError: null
});

export const useIrysContext = () => useContext(IrysContext);

interface IrysProviderProps {
  children: ReactNode;
}

export const IrysProvider: React.FC<IrysProviderProps> = ({ children }) => {
  const [isIrysAvailable, setIsIrysAvailable] = useState<boolean>(false);
  const [isEthereumAvailable, setIsEthereumAvailable] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    // Check if ethereum is available
    const ethereum = getEthereum();
    setIsEthereumAvailable(!!ethereum);

    // Check if Irys can be connected
    const checkIrysConnection = async () => {
      try {
        // Just check basic connectivity, don't persist the connection
        await irysService.getNodeUrl();
        setIsIrysAvailable(true);
        setNetworkError(null);
      } catch (error) {
        console.error('Irys connection check failed:', error);
        setIsIrysAvailable(false);
        setNetworkError(
          error instanceof Error 
            ? error.message 
            : 'Failed to connect to Irys network'
        );
      }
    };

    checkIrysConnection();
  }, []);

  const value = {
    isIrysAvailable,
    isEthereumAvailable,
    networkError
  };

  return (
    <IrysContext.Provider value={value}>
      {children}
    </IrysContext.Provider>
  );
}; 
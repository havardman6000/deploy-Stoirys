import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import WalletConnect from './components/wallet/WalletConnect';
import StorageTab from './components/storage/StorageTab';
import RetrievalTab from './components/retrieval/RetrievalTab';
import { useIrys } from './hooks/useIrys';
import { HistoryItem } from './types';
import History from './components/common/History';
import ErrorBoundary from './components/common/ErrorBoundary';
import SignaturePrompt from './components/common/SignaturePrompt';

// Icons for sidebar
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" transform="rotate(180 10 10)" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

// App component
function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'retrieve' | 'history'>('upload');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { isDevnet } = useIrys();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check for tx parameter in URL and set active tab to retrieve if present
  useEffect(() => {
    const txParam = searchParams.get('tx');
    if (txParam) {
      setActiveTab('retrieve');
    }
  }, [searchParams]);

  const handleSelectFromHistory = (id: string) => {
    setActiveTab('retrieve');
    setSearchParams({ tx: id });
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsWalletConnected(connected);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'upload':
        return <StorageTab />;
      case 'retrieve':
        return <RetrievalTab />;
      case 'history':
        return <History onSelectItem={handleSelectFromHistory} />;
      default:
        return <StorageTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="bg-white border-b border-border-light py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary">IRYS</h1>
            <div className="ml-4 hidden md:flex items-center px-3 py-1.5 rounded-md bg-slate-100">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary text-white">
                {isDevnet ? 'DEVNET' : 'TESTNET'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                className="bg-slate-50 pl-10 pr-4 py-2 rounded-md border border-border-light focus:outline-none focus:ring-1 focus:ring-primary/30 w-64"
                placeholder="Search files..."
              />
            </div>
            <WalletConnect onConnectionChange={handleConnectionChange} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row py-6 gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg border border-border-light overflow-hidden">
            <div className="p-4 border-b border-border-light">
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Navigation</h3>
            </div>
            <div className="py-2">
              <button 
                className={`sidebar-item w-full text-left ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <UploadIcon />
                <span>Upload</span>
              </button>
              <button 
                className={`sidebar-item w-full text-left ${activeTab === 'retrieve' ? 'active' : ''}`}
                onClick={() => setActiveTab('retrieve')}
              >
                <DownloadIcon />
                <span>Retrieve</span>
              </button>
              <button 
                className={`sidebar-item w-full text-left ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <HistoryIcon />
                <span>History</span>
              </button>
            </div>
          </nav>
          
          {/* Network info */}
          <div className="mt-4 bg-white rounded-lg border border-border-light p-4">
            <h3 className="text-sm font-medium mb-2">Network Status</h3>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" title="Connected"></div>
              <span className="text-sm text-text-secondary">
                {isDevnet ? 'Connected to Devnet (Sepolia ETH)' : 'Connected to Testnet (Sepolia ETH)'}
              </span>
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              <p>Using pay-as-you-go uploads directly from your wallet.</p>
              <p className="mt-1">No pre-funding required - uploads are paid for at the time of transaction.</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="*" element={renderActiveTab()} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
      
      {/* Signature prompt overlay - will only show when needed */}
      <SignaturePrompt />
    </div>
  );
}

export default App;

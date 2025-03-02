import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import WalletConnect from './components/wallet/WalletConnect';
import StorageTab from './components/storage/StorageTab';
import RetrievalTab from './components/retrieval/RetrievalTab';
import History from './components/common/History';
import logo from './assets/irys-logo.svg';
import { useIrys } from './hooks/useIrys';
import IrysTokensUpload from './components/IrysTokensUpload';
import SignaturePrompt from './components/common/SignaturePrompt';
import IrysFaucetGuide from './components/wallet/IrysFaucetGuide';
import ErrorBoundary from './components/common/ErrorBoundary';

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

// Add a new icon for the Irys Tokens tab
const TokenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
  </svg>
);

// Define allowed tabs
type AllowedTabs = 'upload' | 'retrieve' | 'fund' | 'history';

// App component
function App() {
  const [activeTab, setActiveTab] = useState<AllowedTabs>('upload');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDevnet } = useIrys();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for tx parameter in URL and set active tab to retrieve if present
  useEffect(() => {
    const tx = searchParams.get('tx');
    if (tx) {
      setActiveTab('retrieve');
    }
  }, [searchParams]);

  // Update wallet connection status
  const handleConnectionChange = (connected: boolean) => {
    setIsWalletConnected(connected);
  };

  // Handle search in header
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setActiveTab('retrieve');
      // Pass query to retrieve tab using URL parameter
      navigate(`/?tx=${searchQuery.trim()}`);
    }
  };

  // Handle selecting an item from history
  const handleSelectFromHistory = (id: string) => {
    setSearchParams({ tx: id });
    setActiveTab('retrieve');
  };

  // Listen for tab change events from child components
  useEffect(() => {
    // Listen for changeActiveTab custom event
    const handleChangeTab = (event: CustomEvent) => {
      const { tab } = event.detail;
      if (tab && (tab === 'upload' || tab === 'retrieve' || tab === 'fund' || tab === 'history')) {
        setActiveTab(tab as AllowedTabs);
      }
    };

    window.addEventListener('changeActiveTab', handleChangeTab as EventListener);

    return () => {
      window.removeEventListener('changeActiveTab', handleChangeTab as EventListener);
    };
  }, []);

  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'upload':
        return <StorageTab />;
      case 'retrieve':
        return <RetrievalTab />;
      case 'fund':
        return <IrysTokensUpload />;
      case 'history':
        return <History onSelectItem={handleSelectFromHistory} />;
      default:
        return <StorageTab />;
    }
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Global Header - always visible */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Irys Logo" className="h-10 md:h-12" />
            
            {/* Mobile Menu Toggle Button */}
            <button 
              className="ml-3 p-2 rounded-md text-gray-500 md:hidden"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-xl mx-4 hidden sm:block">
            <input
              type="text"
              placeholder="Search or enter TX ID..."
              className="w-full p-2 pl-8 pr-3 text-sm border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Wallet Connect Button - without network information */}
          <div className="pl-0 sm:pl-4">
            <WalletConnect onConnectionChange={handleConnectionChange} />
          </div>
        </div>
        
        {/* Mobile Search - Only visible on smaller screens */}
        <div className="mt-4 sm:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search or enter TX ID..."
              className="w-full p-2 pl-8 pr-3 text-base border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{ fontSize: '16px' }} /* Ensuring at least 16px font size for mobile */
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Mobile Menu - Fullscreen overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-white md:hidden pt-16">
            <nav className="p-4">
              <div className="space-y-4">
                <button
                  onClick={() => { setActiveTab('upload'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-base rounded-md ${
                    activeTab === 'upload'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 bg-gray-50'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'upload' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>Upload</span>
                </button>

                <button
                  onClick={() => { setActiveTab('retrieve'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-base rounded-md ${
                    activeTab === 'retrieve'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 bg-gray-50'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'retrieve' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Retrieve</span>
                </button>

                <button
                  onClick={() => { setActiveTab('fund'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-base rounded-md ${
                    activeTab === 'fund'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 bg-gray-50'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'fund' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Irys Tokens</span>
                </button>

                <button
                  onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 text-base rounded-md ${
                    activeTab === 'history'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 bg-gray-50'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'history' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>History</span>
                </button>
              </div>
              
              {/* Mobile Feature Section */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  IRYS Network Features
                </h3>
                <a
                  href="https://storage-explorer.irys.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-3 text-base font-medium rounded-md mt-2"
                >
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 inline-block"></span>
                  IRYS L1 Transactions
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
      
      <div className="flex h-[calc(100vh-68px)] md:h-[calc(100vh-68px)] overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <div className="h-full flex flex-col">
            {/* Network Information */}
            {/* <div className="p-4 bg-gray-50">
              <div className="bg-primary/5 p-3 rounded-md">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  IRYS Network Information:
                </h3>
                <ul className="list-disc pl-5 text-sm text-blue-600">
                  <li>All uploads use IRYS tokens</li>
                  <li>Data is stored permanently on the network</li>
                  <li>No gas fees required</li>
                </ul>
              </div>
            </div> */}

            {/* Navigation */}
            <nav className="mt-6 px-4 flex-1">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === 'upload'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'upload' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>Upload</span>
                </button>

                <button
                  onClick={() => setActiveTab('retrieve')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === 'retrieve'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'retrieve' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Retrieve</span>
                </button>

                <button
                  onClick={() => setActiveTab('fund')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === 'fund'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'fund' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Irys Tokens</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === 'history'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${
                      activeTab === 'history' ? 'text-white' : 'text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>History</span>
                </button>
              </div>
            </nav>

            {/* IRYS Network Features */}
            <div className="px-4 py-3 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                IRYS Network Features
              </h3>
              <nav className="mt-1">
                <div className="space-y-1">
                  <a
                    href="https://storage-explorer.irys.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center px-3 py-2 text-sm font-medium rounded-md"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    IRYS L1 Transactions
                  </a>
                </div>
              </nav>
            </div>

            {/* IRYS Faucet Guide */}
            <div className="px-4 py-3 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                How to Get IRYS Tokens
              </h3>
              <div className="bg-purple-50 p-3 rounded-md text-sm">
                <a 
                  href="https://irys.xyz/faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Visit IRYS Faucet
                </a>
                <ol className="mt-2 ml-4 space-y-1 text-purple-700 list-decimal">
                  <li>Enter the faucet site</li>
                  <li>Enter your wallet address</li>
                  <li>Request IRYS tokens</li>
                  <li>Wait a few seconds for tokens to arrive</li>
                </ol>
              </div>
            </div>

            {/* Add IrysFaucetGuide at the bottom of the sidebar */}
            {import.meta.env.VITE_IRYS_DEVNET === 'true' && (
              <div className="mt-auto px-4 py-4">
                <IrysFaucetGuide />
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <ErrorBoundary>
            <Routes>
              <Route path="*" element={renderActiveTab()} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex flex-col items-center justify-center py-3 ${
              activeTab === 'upload' ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-xs mt-1">Upload</span>
          </button>
          
          <button
            onClick={() => setActiveTab('retrieve')}
            className={`flex flex-col items-center justify-center py-3 ${
              activeTab === 'retrieve' ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="text-xs mt-1">Retrieve</span>
          </button>
          
          <button
            onClick={() => setActiveTab('fund')}
            className={`flex flex-col items-center justify-center py-3 ${
              activeTab === 'fund' ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs mt-1">Tokens</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center py-3 ${
              activeTab === 'history' ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs mt-1">History</span>
          </button>
        </div>
      </div>

      {/* Display IrysFaucetGuide in sidebar on devnet */}
      {isDevnet && (
        <div className="fixed bottom-20 left-4 z-10 max-w-xs md:hidden">
          <IrysFaucetGuide />
        </div>
      )}
      
      {/* Signature prompt component */}
      <SignaturePrompt />
    </div>
  );
}

export default App;

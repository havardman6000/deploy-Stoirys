import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import WalletConnect from './components/wallet/WalletConnect';
import StorageTab from './components/storage/StorageTab';
import RetrievalTab from './components/retrieval/RetrievalTab';
import History from './components/History';
import logo from './assets/stoirys-logo.svg';
import { useIrys } from './contexts/IrysContext';
import FileUpload from './components/FileUpload';
import IrysBalance from './components/IrysBalance';
import DocumentList from './components/DocumentList';
import SignaturePrompt from './components/common/SignaturePrompt';
import IrysFaucetGuide from './components/wallet/IrysFaucetGuide';
import ErrorBoundary from './components/common/ErrorBoundary';
import { WalletProvider } from './contexts/WalletContext';
import { IrysProvider } from './contexts/IrysContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import LandingBanner from './components/LandingBanner';
import AboutStoirys from './components/AboutStoirys';
import AboutIrys from './components/AboutIrys';
import { useWallet } from './contexts/WalletContext';
import { Toaster } from 'react-hot-toast';

// Define updated color theme
const CYBERPUNK_THEME = {
  background: '#1a1b1e',
  surface: '#2a2b2e',
  border: '#3a3b3e',
  primary: '#00ffd5',
  primaryHover: '#00e6c0',
  text: '#ffffff',
  textSecondary: '#cccccc',
};

// Icons for sidebar
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TokenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Add new icons for About sections
const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IrysIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

// Update AllowedTabs to include 'home'
type AllowedTabs = 'home' | 'upload' | 'retrieve' | 'documents' | 'fund' | 'history' | 'about' | 'about-irys';

// App component
function App() {
  const [activeTab, setActiveTab] = useState<AllowedTabs>('home');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDevnet } = useIrys();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [connectionInProgress, setConnectionInProgress] = useState(false);
  const [forceHideNotification, setForceHideNotification] = useState(false);
  
  // Check for URL hash to set active tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      console.log("[App] Hash changed to:", hash);
      
      if (hash) {
        const validTabs: AllowedTabs[] = ['home', 'upload', 'retrieve', 'documents', 'fund', 'history', 'about', 'about-irys'];
        if (validTabs.includes(hash as AllowedTabs)) {
          console.log("[App] Setting active tab from hash to:", hash);
          setActiveTab(hash as AllowedTabs);
          // Make sure we also clear any saved tab in localStorage after using it
          localStorage.removeItem('stoirys-active-tab');
        }
      }
    };
    
    // Initial check
    handleHashChange();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    console.log("[App] Added hashchange event listener");
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      console.log("[App] Removed hashchange event listener");
    };
  }, []);

  // Check for saved active tab in localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('stoirys-active-tab');
    if (savedTab && savedTab !== activeTab) {
      setActiveTab(savedTab as AllowedTabs);
      // Clear after using
      localStorage.removeItem('stoirys-active-tab');
    }
  }, []);

  // Check for tx parameter in URL and set active tab to retrieve if present
  useEffect(() => {
    const tx = searchParams.get('tx');
    if (tx) {
      setActiveTab('retrieve');
    }
  }, [searchParams]);

  // Update wallet connection status with simplified approach
  const handleConnectionChange = (connected: boolean) => {
    console.log(`Wallet connection changed: ${connected ? 'Connected' : 'Disconnected'}`);
    
    setIsWalletConnected(connected);
    setConnectionInProgress(false);
    
    // If the wallet is connected, reset the notification state
    if (connected) {
      console.log("Connected: Updating wallet state");
      setForceHideNotification(false);
    } else {
      console.log("Disconnected: Updating wallet state");
      setForceHideNotification(false);
    }
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
      if (tab && (tab === 'upload' || tab === 'retrieve' || tab === 'documents' || tab === 'fund' || tab === 'history')) {
        setActiveTab(tab as AllowedTabs);
      }
    };

    window.addEventListener('changeActiveTab', handleChangeTab as EventListener);

    return () => {
      window.removeEventListener('changeActiveTab', handleChangeTab as EventListener);
    };
  }, []);

  // Handle click on "Learn More" button in the home page
  const navigateToAboutStoirys = () => {
    setActiveTab('about');
    setIsMobileMenuOpen(false);
  };

  // Make navigateToAboutStoirys available in the React context and listen for tab change events
  useEffect(() => {
    // Add navigateToAboutStoirys to window for access from other components
    // @ts-ignore
    window.navigateToAboutStoirys = navigateToAboutStoirys;
    
    // Make setActiveTab available globally for direct access
    // @ts-ignore
    window.setActiveTab = (tab: string) => {
      console.log("[App] Global setActiveTab called with:", tab);
      if (['home', 'upload', 'retrieve', 'documents', 'fund', 'history', 'about', 'about-irys'].includes(tab)) {
        setActiveTab(tab as AllowedTabs);
        return true;
      }
      console.log("[App] Invalid tab requested:", tab);
      return false;
    };
    
    // Listen for custom tab change events
    const handleTabChangeEvent = (event: CustomEvent) => {
      console.log("Tab change event received:", event);
      console.log("Event detail:", event.detail);
      
      if (event.detail && event.detail.tab) {
        console.log("Setting active tab to:", event.detail.tab);
        setActiveTab(event.detail.tab as AllowedTabs);
        
        // Verify the tab change
        setTimeout(() => {
          console.log("Active tab after event:", activeTab);
        }, 100);
      } else {
        console.log("Invalid event detail structure:", event.detail);
      }
    };
    
    console.log("Adding tab change event listeners for all event types");
    document.addEventListener('change-tab', handleTabChangeEvent as EventListener);
    document.addEventListener('changeTab', handleTabChangeEvent as EventListener);
    document.addEventListener('tab-change', handleTabChangeEvent as EventListener);
    
    return () => {
      console.log("Removing tab change event listeners");
      // @ts-ignore
      window.navigateToAboutStoirys = undefined;
      // @ts-ignore
      window.setActiveTab = undefined;
      document.removeEventListener('change-tab', handleTabChangeEvent as EventListener);
      document.removeEventListener('changeTab', handleTabChangeEvent as EventListener);
      document.removeEventListener('tab-change', handleTabChangeEvent as EventListener);
    };
  }, []);

  // Log active tab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  // Listen for wallet disconnection events
  useEffect(() => {
    const handleWalletDisconnection = () => {
      console.log("App detected wallet disconnection event");
      
      // Ensure wallet state reflects disconnection
      setIsWalletConnected(false);
      
      // Clear localStorage values related to wallet connection
      localStorage.removeItem('wallet-connection-state');
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
      
      // Also set a flag to prevent reconnection
      localStorage.setItem('wallet-manual-disconnect', 'true');
      
      // Reset error notifications
      setForceHideNotification(false);
      
      // Always navigate to home page on disconnect
      setActiveTab('home');
    };
    
    // Add event listener for wallet disconnection
    document.addEventListener('wallet-disconnected', handleWalletDisconnection);
    
    // Check for manual disconnect flag on page load
    if (localStorage.getItem('wallet-manual-disconnect') === 'true') {
      // User previously manually disconnected, ensure we stay disconnected
      setIsWalletConnected(false);
    }
    
    return () => {
      document.removeEventListener('wallet-disconnected', handleWalletDisconnection);
    };
  }, [activeTab]);

  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-semibold text-[#00ffd5] mb-4">Secure File Storage Platform</h2>
              <LandingBanner />
            </div>
          </div>
        );
      case 'upload':
        return <FileUpload onUploadSuccess={handleSelectFromHistory} />;
      case 'retrieve':
        return <RetrievalTab />;
      case 'documents':
        return <DocumentList searchQuery={searchQuery} />;
      case 'fund':
        return <IrysBalance />;
      case 'history':
        return <History />;
      case 'about':
        return <AboutStoirys />;
      case 'about-irys':
        return <AboutIrys />;
      default:
        return null;
    }
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to set active tab and close mobile menu
  const setActiveTabAndCloseMobileMenu = (tab: AllowedTabs) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when a tab is selected
  };

  // Main app structure
  const AppContent = () => (
    <div className="min-h-screen bg-[#1a1b1e] text-white flex flex-col">
      <Toaster position="top-right" />
      {/* Global Wallet Connection Notification - Fixed at top */}
      {!isWalletConnected && !forceHideNotification && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#00ffd5] to-[#00e6c0] text-[#1a1b1e] py-2 px-4 shadow-md flex items-center justify-center">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium hidden sm:inline">Please connect your wallet to use all features</span>
            <span className="font-medium sm:hidden">Connect wallet</span>
          </div>
        </div>
      )}
      
      {/* Main content with conditional padding */}
      <div className={`flex flex-1 ${!isWalletConnected && !forceHideNotification ? 'pt-10' : ''}`}>
        {/* Sidebar */}
        <nav className={`fixed md:static inset-0 z-20 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out bg-[#2a2b2e] md:w-64 lg:w-72 p-4 border-r border-[#3a3b3e] overflow-y-auto`}>
          <div className="sticky top-0 z-10 flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#00ffd5] to-[#00e6c0] text-[#1a1b1e]">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-[#1a1b1e] text-[#00ffd5]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold">Stoirys</span>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md hover:bg-[#1a1b1e]/10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <div className="px-4 py-4 flex-1">
              <div className="space-y-1">
                <NavItem 
                  active={activeTab === 'home'} 
                  icon={<HomeIcon />} 
                  label="Home" 
                  onClick={() => setActiveTabAndCloseMobileMenu('home')}
                />
                <NavItem 
                  active={activeTab === 'upload'} 
                  icon={<UploadIcon />} 
                  label="Upload" 
                  onClick={() => setActiveTabAndCloseMobileMenu('upload')}
                />
                <NavItem 
                  active={activeTab === 'retrieve'} 
                  icon={<DownloadIcon />} 
                  label="Retrieve" 
                  onClick={() => setActiveTabAndCloseMobileMenu('retrieve')}
                />
                <NavItem 
                  active={activeTab === 'fund'} 
                  icon={<TokenIcon />} 
                  label="Irys Balance" 
                  onClick={() => setActiveTabAndCloseMobileMenu('fund')}
                />
                <NavItem 
                  active={activeTab === 'history'} 
                  icon={<HistoryIcon />} 
                  label="History" 
                  onClick={() => setActiveTabAndCloseMobileMenu('history')}
                />
                <NavItem 
                  active={activeTab === 'about'} 
                  icon={<AboutIcon />} 
                  label="What is Stoirys?" 
                  onClick={() => setActiveTabAndCloseMobileMenu('about')}
                />
                <NavItem 
                  active={activeTab === 'about-irys'} 
                  icon={<IrysIcon />} 
                  label="What is Irys?" 
                  onClick={() => setActiveTabAndCloseMobileMenu('about-irys')}
                />
              </div>
            </div>

            {/* Network Features */}
            <div className="px-4 py-3 border-t border-[#3a3b3e]">
              <h3 className="text-xs font-semibold text-[#00ffd5] uppercase tracking-wider mb-2">
                IRYS Network Features
              </h3>
              <a
                href="https://irys.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3a3b3e] text-[#00ffd5] hover:bg-[#4a4b4e] flex items-center px-3 py-2 text-sm font-medium rounded-md mb-2"
              >
                <span className="w-2 h-2 bg-[#00ffd5] rounded-full mr-2"></span>
                IRYS Devnet Transactions
              </a>
            </div>

            {/* Faucet Guide */}
            <div className="px-4 py-3 border-t border-[#3a3b3e]">
              <h3 className="text-xs font-semibold text-[#00ffd5] uppercase tracking-wider mb-2">
                Need Sepolia ETH?
              </h3>
              <div className="mb-3">
                <div className="flex flex-col space-y-2">
                  <a 
                    href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ffd5] hover:text-[#00e6c0] flex items-center px-1 py-1 text-sm font-medium"
                  >
                    <span className="w-2 h-2 bg-[#00ffd5] rounded-full mr-2"></span>
                    Google Cloud Faucet
                  </a>
                  <a 
                    href="https://sepoliafaucet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ffd5] hover:text-[#00e6c0] flex items-center px-1 py-1 text-sm font-medium"
                  >
                    <span className="w-2 h-2 bg-[#00ffd5] rounded-full mr-2"></span>
                    Alchemy Faucet
                  </a>
                </div>
              </div>
            </div>

            {/* Version Information */}
            <div className="px-4 py-2 text-xs text-gray-400 border-t border-[#3a3b3e]">
              <p>Stoirys - Irys Devnet</p>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <header className="bg-[#2a2b2e] border-b border-[#3a3b3e] p-3 sm:p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={toggleMobileMenu} className="md:hidden mr-3 text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-[#00ffd5] truncate flex items-center">
                  {activeTab === 'home' ? (
                    <>
                      <div className="h-6 w-6 mr-2 flex items-center justify-center rounded-md bg-[#1a1b1e] text-[#00ffd5] sm:hidden">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <span className="hidden sm:inline">Decentralized Storage Platform</span>
                      <span className="sm:hidden">Stoirys</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        {activeTab === 'upload' && 'Upload Files to IRYS Network'}
                        {activeTab === 'retrieve' && 'Retrieve Files from IRYS Network'}
                        {activeTab === 'documents' && 'Your Documents'}
                        {activeTab === 'fund' && 'Fund Your IRYS Balance'}
                        {activeTab === 'history' && 'Transaction History'}
                        {activeTab === 'about' && 'About Stoirys'}
                        {activeTab === 'about-irys' && 'About Irys Network'}
                      </span>
                      <span className="sm:hidden">
                        {activeTab === 'upload' && 'Upload Files'}
                        {activeTab === 'retrieve' && 'Retrieve Files'}
                        {activeTab === 'documents' && 'Documents'}
                        {activeTab === 'fund' && 'Fund Balance'}
                        {activeTab === 'history' && 'History'}
                        {activeTab === 'about' && 'About Stoirys'}
                        {activeTab === 'about-irys' && 'About Irys'}
                      </span>
                    </>
                  )}
                </h1>
              </div>
              <div className="flex items-center">
                <WalletConnect onConnectionChange={handleConnectionChange} />
              </div>
            </div>
          </header>

          <main className="overflow-y-auto p-3 sm:p-4 md:p-6">
            <ErrorBoundary>
              {renderActiveTab()}
            </ErrorBoundary>
          </main>
        </div>

        {/* Signature Prompt */}
        <SignaturePrompt />
      </div>
    </div>
  );

  return (
    <WalletProvider>
      <IrysProvider>
        <FirebaseProvider>
          <AppContent />
        </FirebaseProvider>
      </IrysProvider>
    </WalletProvider>
  );
}

// Update NavItem component styling
const NavItem = ({ 
  active, 
  icon, 
  label, 
  onClick 
}: { 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
}) => (
  <button
    className={`w-full flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
      active 
      ? 'bg-[#3a3b3e] text-[#00ffd5]'
      : 'text-gray-300 hover:bg-[#3a3b3e] hover:text-[#00ffd5]'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center min-w-0">
      <span className="flex-shrink-0">{icon}</span>
      <span className="ml-2 whitespace-nowrap">{label}</span>
    </div>
  </button>
);

export default App;
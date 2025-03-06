import React from 'react';
import Button from './common/Button';

const LandingBanner: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-[#00ffd5]/20 to-[#00b0bd]/20 text-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md border border-[#3a3b3e]">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#00ffd5]">Welcome to Stoirys</h1>
            <p className="mb-4 text-gray-300">
              Your permanent, decentralized storage solution on the Ethereum blockchain.
              Store files permanently with a single transaction on Irys Network.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="bg-[#1a1b1e]/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-[#00ffd5]">
                Decentralized Storage
              </div>
              <div className="bg-[#1a1b1e]/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-[#00ffd5]">
                Ethereum Powered
              </div>
              <div className="bg-[#1a1b1e]/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-[#00ffd5]">
                Permanent Data Layer
              </div>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <div className="absolute inset-0 bg-[#00ffd5]/10 backdrop-blur-sm rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-[#00ffd5]/20 backdrop-blur-sm rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 bg-[#00ffd5]/30 backdrop-blur-sm rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 sm:w-16 sm:h-16 text-[#00ffd5]" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1b1e]/70 backdrop-blur-sm p-3 rounded-lg border border-[#3a3b3e]">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-[#00ffd5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <h3 className="font-semibold text-[#00ffd5]">Upload</h3>
            </div>
            <p className="text-sm text-gray-300">Upload any file permanently to the decentralized web</p>
          </div>
          <div className="bg-[#1a1b1e]/70 backdrop-blur-sm p-3 rounded-lg border border-[#3a3b3e]">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-[#00ffd5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <h3 className="font-semibold text-[#00ffd5]">Retrieve</h3>
            </div>
            <p className="text-sm text-gray-300">Access your files anytime with transaction IDs</p>
          </div>
          <div className="bg-[#1a1b1e]/70 backdrop-blur-sm p-3 rounded-lg border border-[#3a3b3e]">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-[#00ffd5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <h3 className="font-semibold text-[#00ffd5]">Secure</h3>
            </div>
            <p className="text-sm text-gray-300">Blockchain security with immutable storage</p>
          </div>
        </div>
      </div>

      {/* How to use section */}
      <div className="bg-[#2a2b2e] p-6 rounded-lg shadow-sm border border-[#3a3b3e]">
        <h2 className="text-xl font-bold text-[#00ffd5] mb-4">How to Use Stoirys</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1b1e] p-4 rounded-lg border border-[#3a3b3e]">
            <div className="flex items-center justify-center bg-[#00ffd5]/20 rounded-full w-10 h-10 mb-3">
              <span className="text-[#00ffd5] font-semibold">1</span>
            </div>
            <h3 className="text-lg font-medium text-[#00ffd5] mb-2">Connect Wallet</h3>
            <p className="text-sm text-gray-300">
              Click the Connect button in the top right to link your Ethereum wallet to Stoirys
            </p>
          </div>
          <div className="bg-[#1a1b1e] p-4 rounded-lg border border-[#3a3b3e]">
            <div className="flex items-center justify-center bg-[#00ffd5]/20 rounded-full w-10 h-10 mb-3">
              <span className="text-[#00ffd5] font-semibold">2</span>
            </div>
            <h3 className="text-lg font-medium text-[#00ffd5] mb-2">Fund Your Balance</h3>
            <p className="text-sm text-gray-300">
              Add Sepolia ETH to your Irys balance to pay for storage costs
            </p>
          </div>
          <div className="bg-[#1a1b1e] p-4 rounded-lg border border-[#3a3b3e]">
            <div className="flex items-center justify-center bg-[#00ffd5]/20 rounded-full w-10 h-10 mb-3">
              <span className="text-[#00ffd5] font-semibold">3</span>
            </div>
            <h3 className="text-lg font-medium text-[#00ffd5] mb-2">Upload Files</h3>
            <p className="text-sm text-gray-300">
              Drag and drop or select files to upload permanently to the network
            </p>
          </div>
          <div className="bg-[#1a1b1e] p-4 rounded-lg border border-[#3a3b3e]">
            <div className="flex items-center justify-center bg-[#00ffd5]/20 rounded-full w-10 h-10 mb-3">
              <span className="text-[#00ffd5] font-semibold">4</span>
            </div>
            <h3 className="text-lg font-medium text-[#00ffd5] mb-2">Retrieve Anytime</h3>
            <p className="text-sm text-gray-300">
              Access your files using transaction IDs or through the history tab
            </p>
          </div>
        </div>
      </div>
      
      {/* Payment info section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2a2b2e] p-6 rounded-lg shadow-sm border border-[#3a3b3e]">
          <h2 className="text-xl font-bold text-[#00ffd5] mb-4">Payment & Pricing</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-[#00ffd5]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">One-Time Payment</h3>
                <p className="text-sm text-gray-300">
                  Pay once for permanent storage. No subscriptions or recurring fees.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-[#00ffd5]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">Pay with Sepolia ETH</h3>
                <p className="text-sm text-gray-300">
                  Currently using testnet tokens. Production version will support multiple cryptocurrencies.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-[#00ffd5]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">Size-Based Pricing</h3>
                <p className="text-sm text-gray-300">
                  Costs are calculated based on file size. Larger files cost more to store.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => {
                  // Dispatch a custom event to change the active tab
                  const event = new CustomEvent('changeActiveTab', { detail: { tab: 'fund' } });
                  window.dispatchEvent(event);
                }}
                className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black"
              >
                Check Balance & Fund
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-[#2a2b2e] p-6 rounded-lg shadow-sm border border-[#3a3b3e]">
          <h2 className="text-xl font-bold text-[#00ffd5] mb-4">Getting Sepolia ETH</h2>
          <p className="text-sm text-gray-300 mb-4">
            Sepolia ETH is needed to pay for transactions on the testnet. Here's how to get some:
          </p>
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-[#1a1b1e] rounded-lg border border-[#3a3b3e]">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-[#00ffd5]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-[#00ffd5]">Google Cloud Faucet</h3>
                <p className="text-sm text-gray-300">
                  <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noopener noreferrer" className="text-[#00ffd5] hover:text-[#00e6c0] underline">
                    Visit Google Cloud Faucet
                  </a>
                  <span className="block mt-1">Reliable source for Sepolia ETH</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-[#1a1b1e] rounded-lg border border-[#3a3b3e]">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-[#00ffd5]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-[#00ffd5]">Alchemy Faucet</h3>
                <p className="text-sm text-gray-300">
                  <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-[#00ffd5] hover:text-[#00e6c0] underline">
                    Visit Alchemy Faucet
                  </a>
                  <span className="block mt-1">Requires sign-in with an Alchemy account</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-[#1a1b1e] rounded-lg border border-[#3a3b3e]">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-[#00ffd5]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-[#00ffd5]">Infura Faucet</h3>
                <p className="text-sm text-gray-300">
                  <a href="https://www.infura.io/faucet/sepolia" target="_blank" rel="noopener noreferrer" className="text-[#00ffd5] hover:text-[#00e6c0] underline">
                    Visit Infura Faucet
                  </a>
                  <span className="block mt-1">May have daily request limits</span>
                </p>
              </div>
            </div>
            
            <div className="bg-[#1a1b1e] border-l-4 border-[#00ffd5] p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[#00ffd5]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300">
                    Remember: Sepolia ETH has no real-world value. It's used only for testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-[#00ffd5]/20 to-[#00b0bd]/20 p-6 rounded-lg shadow-md text-center border border-[#3a3b3e]">
        <h2 className="text-xl md:text-2xl font-bold text-[#00ffd5] mb-2">Ready to get started?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Start storing your files permanently on the blockchain with just a few clicks.
          Connect your wallet, fund your account, and upload your first file.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => {
              const event = new CustomEvent('changeActiveTab', { detail: { tab: 'upload' } });
              window.dispatchEvent(event);
            }}
            className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black px-6 py-2"
          >
            Start Uploading
          </Button>
          <Button
            onClick={() => {
              console.log("Learn More button clicked, navigating to About page");
              
              // Set the active tab to 'about'
              localStorage.setItem('stoirys-active-tab', 'about');
              
              // Dispatch the custom event
              const event = new CustomEvent('changeActiveTab', { 
                detail: { tab: 'about' } 
              });
              document.dispatchEvent(event);
              
              // Set URL hash for direct link access
              window.location.hash = '#about';
              
              // Final safety - if the first event dispatch doesn't work
              const secondaryEvent = new CustomEvent('change-tab', { 
                detail: { tab: 'about' } 
              });
              document.dispatchEvent(secondaryEvent);
              
              // Use window method if available
              if (typeof (window as any).navigateToAboutStoirys === 'function') {
                (window as any).navigateToAboutStoirys();
              }
              
              // Use setActiveTab if available
              if (typeof (window as any).setActiveTab === 'function') {
                (window as any).setActiveTab('about');
              }
            }}
            className="bg-[#2a2b2e] hover:bg-[#3a3b3e] text-[#00ffd5] px-6"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingBanner; 
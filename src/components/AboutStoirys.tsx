import React from 'react';
import Card from './common/Card';

const AboutStoirys: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#2a2b2e] border-[#3a3b3e]">
        <div className="prose max-w-none text-gray-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#00ffd5] mb-4">What is Stoirys?</h2>
            <p className="text-gray-300 leading-relaxed">
              Stoirys is a decentralized storage application that allows you to permanently store files on the Ethereum blockchain
              through the Irys Network. Built with modern web technologies, Stoirys provides an intuitive interface for
              interacting with decentralized storage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#1a1b1e] to-[#2a2b2e] p-5 rounded-lg border border-[#3a3b3e]">
              <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">Why Use Stoirys?</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Permanent Storage:</strong> Files uploaded to Stoirys are stored permanently on the blockchain</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Decentralized:</strong> No central authority controls your data</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Secure:</strong> Cryptographic verification ensures data integrity</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">User-Friendly:</strong> Simple interface for blockchain interactions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#1a1b1e] to-[#2a2b2e] p-5 rounded-lg border border-[#3a3b3e]">
              <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">File Uploads:</strong> Store any file type permanently</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">File Retrieval:</strong> Access your files anytime, anywhere</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Balance Management:</strong> Fund your account easily</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Transaction History:</strong> Track all your uploads and retrievals</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[#1a1b1e] p-6 rounded-lg border border-[#3a3b3e] mb-8">
            <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">How It Works</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li className="ml-2">
                <span className="font-medium text-white">Connect Your Wallet</span> - Use your Ethereum wallet to connect to Stoirys
              </li>
              <li className="ml-2">
                <span className="font-medium text-white">Fund Your Balance</span> - Add Sepolia ETH to your account
              </li>
              <li className="ml-2">
                <span className="font-medium text-white">Upload Files</span> - Store files permanently on the Irys Network
              </li>
              <li className="ml-2">
                <span className="font-medium text-white">Retrieve When Needed</span> - Access your files using their transaction IDs
              </li>
            </ol>
          </div>

          <div className="bg-[#1a1b1e] p-6 rounded-lg border border-[#3a3b3e]">
            <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">Getting Started</h3>
            <p className="text-gray-300 mb-4">
              To get started with Stoirys, all you need is a web3 wallet like MetaMask and some Sepolia ETH.
              Navigate to the Upload tab to store your first file or check out the Retrieve tab to access previously stored content.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  // Dispatch a custom event to change the active tab
                  const event = new CustomEvent('changeActiveTab', { detail: { tab: 'upload' } });
                  window.dispatchEvent(event);
                }}
                className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black px-4 py-2 rounded font-medium transition-colors"
              >
                Start Uploading
              </button>
              <button 
                onClick={() => {
                  // Dispatch a custom event to change the active tab
                  const event = new CustomEvent('changeActiveTab', { detail: { tab: 'retrieve' } });
                  window.dispatchEvent(event);
                }}
                className="bg-[#00b0bd] hover:bg-[#00a0ad] text-black px-4 py-2 rounded font-medium transition-colors"
              >
                Retrieve Files
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutStoirys; 
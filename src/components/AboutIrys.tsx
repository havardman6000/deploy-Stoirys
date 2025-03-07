import React from 'react';
import Card from './common/Card';

const AboutIrys: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#2a2b2e] border-[#3a3b3e]">
        <div className="prose max-w-none text-gray-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#00ffd5] mb-4">What is Irys?</h2>
            <p className="text-gray-300 leading-relaxed">
              Irys is a decentralized data storage solution that allows developers to permanently store data on the blockchain.
              Built on Arweave, Irys provides a simpler interface and multi-token support, making it easier to interact with
              permanent storage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#1a1b1e] to-[#2a2b2e] p-5 rounded-lg border border-[#3a3b3e]">
              <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">Why Irys?</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Permanence:</strong> Data uploaded to Irys is stored permanently</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Decentralized:</strong> No central authority controls the network</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Multi-token Support:</strong> Fund uploads with various cryptocurrencies</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Developer-Friendly:</strong> Easy-to-use APIs for blockchain interactions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#1a1b1e] to-[#2a2b2e] p-5 rounded-lg border border-[#3a3b3e]">
              <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">Key Features of Irys</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Permaweb Storage:</strong> Store data forever with one-time payment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Layer 1 Datachain:</strong> Dedicated blockchain for permanent data storage</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Metadata Support:</strong> Add searchable tags to your uploads</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[#00ffd5] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span><strong className="text-[#00ffd5]">Instant Uploads:</strong> No confirmation times for immediate availability</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[#1a1b1e] p-6 rounded-lg border border-[#3a3b3e] mb-8">
            <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">How Irys Works with Stoirys</h3>
            <p className="text-gray-300 mb-4">
              Stoirys leverages the power of Irys to provide permanent decentralized storage for your files. When you upload a file
              through Stoirys, it's processed through the Irys Network and permanently stored on the blockchain. Here's how the process works:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li className="ml-2">
                <span className="font-medium text-white">Fund Your Account</span> - Pay once with Sepolia ETH for permanent storage
              </li>
              <li className="ml-2">
                <span className="font-medium text-white">Upload Your File</span> - Your file is processed by Irys nodes
              </li>
              <li className="ml-2">
                <span className="font-medium text-white">Receive Transaction ID</span> - A unique identifier for your upload
              </li>
              <li className="ml-2">
                <span className="font-medium text-white">Permanent Storage</span> - Your file is permanently stored on the blockchain
              </li>
            </ol>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 bg-[#1a1b1e] p-6 rounded-lg border border-[#3a3b3e]">
              <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">Irys for Developers</h3>
              <p className="text-gray-300 mb-4">
                Irys provides a robust SDK for developers to integrate permanent storage into their applications. With support
                for JavaScript, Python, Go, and more, you can easily build applications that leverage the power of decentralized storage.
              </p>
              <a 
                href="https://irys.xyz/developer-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00ffd5] hover:text-[#00e6c0] font-medium"
              >
                View Developer Docs
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <div className="flex-1 bg-[#1a1b1e] p-6 rounded-lg border border-[#3a3b3e]">
              <h3 className="text-xl font-semibold text-[#00ffd5] mb-3">Learn More About Irys</h3>
              <p className="text-gray-300 mb-4">
                Discover more about the Irys Network, its features, and how it's revolutionizing decentralized storage.
                Explore tutorials, documentation, and community resources to deepen your understanding.
              </p>
              <a 
                href="https://irys.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#00ffd5] hover:text-[#00e6c0] font-medium"
              >
                Visit Irys Website
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutIrys; 
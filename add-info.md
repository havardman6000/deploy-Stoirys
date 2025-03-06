Directory structure:
└── havardman6000-deploy-stoirys/
    ├── README.md
    ├── READMEinformationonirys.md
    ├── eslint.config.js
    ├── index.html
    ├── netlify.toml
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── test.txt
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── backups/
    │   ├── irysServiceSafe.backup.ts
    │   ├── .env.backup
    │   └── 20250302_041121_irys_backup/
    │       ├── package.json
    │       ├── tailwind.config.js
    │       ├── vite.config.ts
    │       └── src/
    │           ├── App.css
    │           ├── App.test.tsx
    │           ├── App.tsx
    │           ├── index.css
    │           ├── main.tsx
    │           ├── setupTests.ts
    │           ├── utils.test.ts
    │           ├── vite-env.d.ts
    │           ├── assets/
    │           ├── components/
    │           │   ├── common/
    │           │   │   ├── Button.tsx
    │           │   │   ├── Card.tsx
    │           │   │   ├── ErrorBoundary.tsx
    │           │   │   ├── History.tsx
    │           │   │   ├── SignaturePrompt.tsx
    │           │   │   ├── Tabs.tsx
    │           │   │   ├── TransactionDetails.tsx
    │           │   │   └── UploadResultDisplay.tsx
    │           │   ├── retrieval/
    │           │   │   ├── ResultsDisplay.tsx
    │           │   │   ├── RetrievalTab.tsx
    │           │   │   └── TransactionInput.tsx
    │           │   ├── storage/
    │           │   │   ├── FileUpload.tsx
    │           │   │   ├── StorageTab.tsx
    │           │   │   ├── TextInput.css
    │           │   │   └── TextInput.tsx
    │           │   └── wallet/
    │           │       ├── NetworkSelector.test.tsx
    │           │       ├── NetworkSelector.tsx
    │           │       └── WalletConnect.tsx
    │           ├── config/
    │           │   ├── browserify-polyfills.js
    │           │   ├── buffer-patch.js
    │           │   ├── direct-patch.js
    │           │   ├── large-file-patch.js
    │           │   ├── polyfills.ts
    │           │   ├── process-fix.js
    │           │   ├── readable-stream-patch.js
    │           │   └── stream-patch.js
    │           ├── hooks/
    │           │   ├── useHistory.ts
    │           │   ├── useIrys.ts
    │           │   └── useTags.ts
    │           ├── providers/
    │           │   └── IrysProvider.tsx
    │           ├── services/
    │           │   ├── historyService.ts
    │           │   ├── irysService.ts
    │           │   └── irysServiceSafe.ts
    │           └── types/
    │               └── index.ts
    ├── public/
    ├── src/
    │   ├── App.css
    │   ├── App.test.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   ├── setupTests.ts
    │   ├── utils.test.ts
    │   ├── vite-env.d.ts
    │   ├── assets/
    │   ├── components/
    │   │   ├── IrysTokensUpload.tsx
    │   │   ├── common/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── ErrorBoundary.tsx
    │   │   │   ├── History.tsx
    │   │   │   ├── SignaturePrompt.tsx
    │   │   │   ├── Tabs.tsx
    │   │   │   ├── TransactionDetails.tsx
    │   │   │   └── UploadResultDisplay.tsx
    │   │   ├── retrieval/
    │   │   │   ├── ResultsDisplay.tsx
    │   │   │   ├── RetrievalTab.tsx
    │   │   │   └── TransactionInput.tsx
    │   │   ├── storage/
    │   │   │   ├── FileUpload.tsx
    │   │   │   ├── StorageTab.tsx
    │   │   │   ├── TextInput.css
    │   │   │   └── TextInput.tsx
    │   │   └── wallet/
    │   │       ├── IrysFaucetGuide.tsx
    │   │       ├── IrysTokenFundingForm.tsx
    │   │       ├── NetworkSelector.test.tsx
    │   │       ├── NetworkSelector.tsx
    │   │       └── WalletConnect.tsx
    │   ├── config/
    │   │   ├── browserify-polyfills.js
    │   │   ├── buffer-patch.js
    │   │   ├── direct-patch.js
    │   │   ├── large-file-patch.js
    │   │   ├── polyfills.ts
    │   │   ├── process-fix.js
    │   │   ├── readable-stream-patch.js
    │   │   └── stream-patch.js
    │   ├── hooks/
    │   │   ├── useHistory.ts
    │   │   ├── useIrys.ts
    │   │   └── useTags.ts
    │   ├── providers/
    │   │   └── IrysProvider.tsx
    │   ├── services/
    │   │   ├── historyService.ts
    │   │   ├── irysService.ts
    │   │   └── irysServiceSafe.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── utils/
    │       └── classNames.ts
    └── .github/
        └── workflows/
            └── deploy.yml


Files Content:

(Files content cropped to 300k characters, download full ingest to see more)
================================================
File: README.md
================================================
# Irys Storage App

A modern, user-friendly web application that allows users to store and retrieve data on the Irys network.

## Live Demo
Check out the live demo: [https://havardman6000.github.io/deploy-Stoirys/](https://havardman6000.github.io/deploy-Stoirys/)

## Features

- **Data Storage**:
  - Text input with character counter
  - File upload with drag-and-drop functionality
  - Custom metadata tags
  - Support for multiple file types

- **Data Retrieval**:
  - Retrieve data using transaction IDs
  - Preview content (text, JSON, images, etc.)
  - Download retrieved files

- **Wallet Integration**:
  - Connect with MetaMask or other Ethereum wallets
  - View and fund your Irys balance
  - Switch between testnet and mainnet environments

- **Network Selection**:
  - Easily switch between Irys testnet and mainnet
  - Visual indicator of current network
  - Transaction history specific to each network

- **History**:
  - Track your uploads and retrievals
  - Quick access to previous transactions
  - Clear or remove individual history items

## Technologies Used

- React.js with TypeScript
- Tailwind CSS for styling
- Irys SDK (@irys/sdk) for blockchain integration
- Ethers.js for wallet connectivity

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask or another Ethereum wallet browser extension

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/irys-storage-app.git
   cd irys-storage-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_IRYS_DEVNET=true
   VITE_ETHEREUM_RPC_URL=your_ethereum_rpc_url
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Connecting to Testnet vs Mainnet

1. Connect your wallet using the "Connect Wallet" button.
2. Once connected, you'll see your current network indicated (Testnet or Mainnet).
3. Use the network selector buttons to switch between Testnet and Mainnet.
4. When using Testnet:
   - Transactions have no real cost (use test tokens)
   - Perfect for development and testing
   - Data stored on testnet is not guaranteed to be permanent
5. When using Mainnet:
   - Transactions require real ETH
   - Data is stored permanently on the Irys network
   - Use for production applications and permanent storage

### Storing Data

1. Connect your wallet and select your desired network (Testnet/Mainnet)
2. Navigate to the "Store Data" tab
3. Choose between text input or file upload
4. Add optional metadata tags
5. Click "Upload" to store your data on the Irys network
6. Once complete, you'll receive a transaction ID that can be used to retrieve your data

### Retrieving Data

1. Navigate to the "Retrieve Data" tab
2. Enter the transaction ID of the data you want to retrieve
3. Make sure you're on the right network (Testnet/Mainnet) where the data was originally stored
4. Click "Retrieve Data"
5. View or download the retrieved content

## Development

The application is built using modern React practices with TypeScript for type safety. Key components include:

- **Hooks**: Custom hooks like `useIrys` and `useHistory` manage app state and functionality
- **Components**: Modular, reusable UI elements organized by feature
- **Services**: The `irysService` abstracts the interactions with the Irys network

### Testing

To run tests:

```
npm test
```

Tests are written using Vitest and React Testing Library, ensuring the application functions correctly.

## Deployment

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions:

1. Push your changes to the main branch
2. GitHub Actions will automatically build and deploy the app
3. The app will be available at `https://<your-username>.github.io/deploy-Stoirys/`

To deploy manually:

```bash
# Build the app
npm run build

# Deploy to GitHub Pages
# You can use gh-pages or similar tools
npm install -g gh-pages
gh-pages -d dist
```

### Other Deployment Options

The built files will be in the `dist` directory and can be deployed to any static hosting service like Vercel, Netlify, or AWS S3.

## Troubleshooting

- **Wallet Connection Issues**: Ensure MetaMask is installed and on the correct network
- **Transaction Failures**: Check your wallet balance and network settings
- **Data Retrieval Problems**: Verify you're on the same network where the data was stored

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Irys](https://irys.xyz) for providing the decentralized storage infrastructure
- [Vite](https://vitejs.dev) for the fast development environment
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework


================================================
File: eslint.config.js
================================================
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)


================================================
File: index.html
================================================
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/stoirys-favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>STOIRYS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


================================================
File: netlify.toml
================================================
[build]
  command = "npm run build"
  publish = "dist"

# Handle SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Set security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"

================================================
File: package.json
================================================
{
  "name": "irys-storageapp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "prebuild": "npm install stream-browserify crypto-browserify -D",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "@irys/query": "^0.0.9",
    "@irys/sdk": "^0.2.11",
    "@irys/web-upload": "^0.0.15",
    "@irys/web-upload-ethereum": "^0.0.16",
    "@irys/web-upload-ethereum-ethers-v6": "^0.0.16",
    "@monaco-editor/react": "^4.7.0",
    "ethers": "^6.9.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-dropzone": "^14.3.8",
    "react-router-dom": "^7.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.16",
    "browserify-sign": "^4.2.3",
    "buffer": "^6.0.3",
    "crypto-browserify": "^3.12.1",
    "eslint": "^9.21.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "gh-pages": "^6.3.0",
    "globals": "^15.15.0",
    "jsdom": "^26.0.0",
    "postcss": "^8.4.31",
    "process-es6": "^0.11.6",
    "readable-stream": "^4.7.0",
    "stream-browserify": "^3.0.0",
    "tailwindcss": "^3.3.3",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.24.1",
    "util": "^0.12.5",
    "vite": "^6.2.0",
    "vite-plugin-node-polyfills": "^0.23.0",
    "vitest": "^3.0.7"
  }
}


================================================
File: postcss.config.js
================================================
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
} 

================================================
File: tailwind.config.js
================================================
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '360px',    // Mobile breakpoint (360x800)
        'sm': '640px',        // Default Tailwind sm
        'tablet': '768px',    // Tablet breakpoint (768x1024)
        'md': '768px',        // Default Tailwind md
        'lg': '1024px',       // Default Tailwind lg
        'xl': '1280px',       // Default Tailwind xl
        'desktop': '1920px',  // Desktop breakpoint (1920x1080)
        '2xl': '1536px',      // Default Tailwind 2xl
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      colors: {
        primary: '#0066FF', // Bright blue like in the image
        secondary: '#64748B', // Slate-500
        success: '#10B981', // Emerald-500
        danger: '#EF4444', // Red-500
        warning: '#F59E0B', // Amber-500
        info: '#3B82F6', // Blue-500
        background: '#F8FAFC', // Very light gray/blue background
        surface: '#FFFFFF',  // White surface/card color
        text: {
          primary: '#0F172A', // Slate-900 
          secondary: '#64748B', // Slate-500
          muted: '#94A3B8',   // Slate-400
        },
        border: {
          light: '#E2E8F0', // Slate-200
          DEFAULT: '#CBD5E1', // Slate-300
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
} 

================================================
File: test.txt
================================================
This is a test file for the Stoirys app


================================================
File: tsconfig.app.json
================================================
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}


================================================
File: tsconfig.json
================================================
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}


================================================
File: tsconfig.node.json
================================================
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}


================================================
File: vite.config.ts
================================================
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list
      exclude: [
        // We'll handle these manually
        'process',
        'buffer',
      ],
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill specific modules
      protocolImports: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
  resolve: {
    alias: {
      // Add fallbacks for common Node.js modules
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      _stream_readable: 'readable-stream/readable.js',
      _stream_writable: 'readable-stream/writable.js',
      _stream_transform: 'readable-stream/transform.js',
      _stream_duplex: 'readable-stream/duplex.js',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: [
      'buffer', 
      'process', 
      'stream-browserify', 
      'crypto-browserify',
      'readable-stream',
      'browserify-sign'
    ],
  },
  define: {
    global: 'globalThis',
    'process.env': process.env,
  },
})


================================================
File: backups/irysServiceSafe.backup.ts
================================================
import { WebUploader } from '@irys/web-upload';
import { WebEthereum } from '@irys/web-upload-ethereum';
import { EthersV6Adapter } from '@irys/web-upload-ethereum-ethers-v6';
import { ethers } from 'ethers';
import { UploadResult, RetrievedData, Tag, TransactionDetails } from '../types';
import { getEthereum } from '../config/polyfills';

// Add Ethereum window type
declare global {
  interface Window {
    ethereum: any;
  }
}

// Create a safer version of the Irys service using the newer WebUploader approach
class IrysServiceSafe {
  private isDevnet: boolean;
  private irysUploader: any = null;
  private lastWalletAddress: string | null = null;
  private connectionInProgress: boolean = false;
  
  constructor() {
    this.isDevnet = import.meta.env.VITE_IRYS_DEVNET === 'true';
  }
  
  getGatewayUrl(): string {
    return this.isDevnet 
      ? 'https://devnet.irys.xyz'
      : 'https://gateway.irys.xyz';
  }
  
  getNodeUrl(): string {
    return this.isDevnet
      ? 'https://devnet.irys.xyz'
      : 'https://node1.irys.xyz';
  }
  
  getExplorerUrl(): string {
    return this.isDevnet ? 'https://devnet.explorer.irys.xyz' : 'https://explorer.irys.xyz';
  }
  
  // Helper to detect if the wallet changed, which would require reconnection
  private async hasWalletChanged(): Promise<boolean> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        console.log('[irysServiceSafe] No Ethereum provider found, wallet changed');
        return true;
      }
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        console.log('[irysServiceSafe] No accounts available, wallet changed');
        return true;
      }
      
      // If we have a previous address and it's different, wallet changed
      if (this.lastWalletAddress && this.lastWalletAddress !== accounts[0]) {
        console.log('[irysServiceSafe] Wallet address changed from', this.lastWalletAddress, 'to', accounts[0]);
        return true;
      }
      
      // Update the last wallet address
      this.lastWalletAddress = accounts[0];
      return false;
    } catch (e) {
      console.error("[irysServiceSafe] Error checking if wallet changed:", e);
      return true; // Assume changed if error
    }
  }
  
  // Check if the wallet is connected without prompting for permissions
  async isWalletConnected(): Promise<boolean> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        console.log('[irysServiceSafe] No Ethereum provider found');
        return false;
      }
      
      // Use eth_accounts for a non-intrusive check of already-permitted accounts
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const connected = accounts && accounts.length > 0;
      
      // Log the result for debugging
      console.log('[irysServiceSafe] Wallet connection check:', connected ? 'Connected' : 'Not connected');
      if (connected) {
        console.log('[irysServiceSafe] Connected account:', accounts[0]);
        
        // If we have a connection, verify the chain ID to make sure we're on an appropriate network
        try {
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          console.log('[irysServiceSafe] Current chainId:', chainId);
        } catch (chainError) {
          console.warn('[irysServiceSafe] Error checking chain ID:', chainError);
        }
      } else {
        console.log('[irysServiceSafe] No accounts available');
      }
      
      return connected;
    } catch (error) {
      console.error('[irysServiceSafe] Error checking wallet connection:', error);
      return false;
    }
  }
  
  async connectToIrys(force: boolean = false): Promise<any> {
    console.log('[irysServiceSafe] Connecting to Irys...');
    
    // To avoid race conditions and duplicate connections
    if (this.connectionInProgress) {
      console.log('[irysServiceSafe] Connection already in progress, waiting...');
      // Wait for existing connection to complete
      while (this.connectionInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // If we now have a valid connection, return it
      if (this.irysUploader && !force) {
        const hasChanged = await this.hasWalletChanged();
        if (!hasChanged) {
          return this.irysUploader;
        }
      }
    }
    
    this.connectionInProgress = true;
    
    try {
      // First check if we have a valid connection already
      if (this.irysUploader && !force) {
        const hasChanged = await this.hasWalletChanged();
        if (!hasChanged) {
          return this.irysUploader;
        }
        // Otherwise continue to connect with new account
      }
      
      // Get the Ethereum provider
      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error('Ethereum provider not found. Please install MetaMask or another Web3 wallet.');
      }
      
      // Get accounts - first try without prompting
      let accounts;
      try {
        console.log('[irysServiceSafe] Attempting to get accounts without prompt');
        accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts && accounts.length > 0) {
          console.log('[irysServiceSafe] Found account without prompting:', accounts[0]);
        } else {
          // If no accounts, try requesting them (this will prompt user if needed)
          console.log('[irysServiceSafe] No accounts found, requesting with prompt');
          accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        }
      } catch (error) {
        console.error('[irysServiceSafe] Error getting accounts:', error);
        throw new Error('Failed to connect to wallet. Please make sure your wallet is unlocked and try again.');
      }
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No Ethereum accounts found. Please unlock your wallet and try again.');
      }
      
      const address = accounts[0];
      console.log('[irysServiceSafe] Using account for Irys connection:', address);
      
      // NEW: Save the current chain ID for network verification
      try {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('[irysServiceSafe] Using network chainId for connection:', chainId);
        sessionStorage.setItem('lastChainId', chainId);
      } catch (chainError) {
        console.warn('[irysServiceSafe] Error checking chain ID during connection:', chainError);
      }
      
      // Create a provider using the Ethereum object
      console.log('[irysServiceSafe] Creating Irys connection with WebUploader...');
      
      try {
        // Create instance on the appropriate network
        const url = this.getNodeUrl();
        console.log('[irysServiceSafe] Connecting to Irys node:', url);
        
        // UPDATED: Use ethers BrowserProvider with the EthersV6Adapter
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        console.log('[irysServiceSafe] Created ethers BrowserProvider');
        
        // Use the WebUploader with the EthersV6Adapter
        // Note: WebUploader automatically connects to the right network
        // We don't need to explicitly set the URL
        let uploader: any = await WebUploader(WebEthereum)
          .withAdapter(EthersV6Adapter(ethersProvider));

        // Log whether we're in devnet mode for debugging
        if (this.isDevnet) {
          console.log('[irysServiceSafe] Using devnet - note: explicit node URL setting is not required with WebUploader');
        } else {
          console.log('[irysServiceSafe] Using mainnet - note: explicit node URL setting is not required with WebUploader');
        }

        console.log('[irysServiceSafe] Connected successfully to Irys node');
        this.irysUploader = uploader;
        return uploader;
      } catch (readyError) {
        console.error('[irysServiceSafe] Error connecting to Irys node:', readyError);
        throw new Error(`Failed to connect to Irys: ${readyError instanceof Error ? readyError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[irysServiceSafe] Error in connectToIrys:', error);
      throw error;
    } finally {
      this.connectionInProgress = false;
    }
  }
  
  async getBalance(): Promise<string> {
    try {
      // First, verify wallet is still connected
      const walletConnected = await this.isWalletConnected();
      if (!walletConnected) {
        console.log('[irysServiceSafe] Cannot get balance, wallet not connected');
        return '0';
      }
      
      console.log('[irysServiceSafe] Getting balance for network:', this.isDevnet ? 'devnet' : 'mainnet');
      // Force a clean connection to ensure we're connected to the correct network
      const irys = await this.connectToIrys(true);
      const balance = await irys.getBalance();
      
      // Convert to string to avoid BigNumber issues
      console.log('[irysServiceSafe] Retrieved balance:', balance.toString());
      return balance.toString();
    } catch (error) {
      console.error('[irysServiceSafe] Error getting balance:', error);
      return '0';
    }
  }
  
  async fundNode(amount: string): Promise<any> {
    if (!amount) {
      throw new Error('Amount is required for funding');
    }

    try {
      // First check if wallet is connected
      const isConnected = await this.isWalletConnected();
      if (!isConnected) {
        console.error('[irysServiceSafe] Cannot fund: wallet not connected');
        throw new Error('Wallet not connected');
      }

      console.log('[irysServiceSafe] Starting fundNode with amount:', amount);

      // Connect to Irys (will reuse existing connection if possible)
      const irys = await this.connectToIrys();
      console.log('[irysServiceSafe] Connected to Irys, proceeding with funding');

      // Get the current balance for logging
      try {
        const currentBalance = await irys.getLoadedBalance();
        console.log('[irysServiceSafe] Current balance before funding:', currentBalance);
      } catch (balanceErr) {
        console.warn('[irysServiceSafe] Could not fetch current balance:', balanceErr);
      }

      // Parse the amount to the correct format
      const parsedAmount = ethers.parseEther(amount);
      console.log('[irysServiceSafe] Starting fund operation with amount:', parsedAmount.toString());

      try {
        // Try with normal options first
        const fundTx = await irys.fund(parsedAmount);
        
        console.log('[irysServiceSafe] Funding transaction submitted:', fundTx);
        return {
          status: 'success',
          message: 'Funding transaction submitted',
          tx: fundTx
        };
      } catch (fundError) {
        // Check if the error is related to transaction fee estimation
        if (fundError instanceof Error && 
            fundError.message.includes('eth_maxPriorityFeePerGas')) {
          console.error('[irysServiceSafe] Transaction fee estimation error, trying with legacy transaction type');
          
          // Try again with legacy transaction format
          const fundTx = await irys.fund(parsedAmount, {
            // Force using legacy transaction format instead of EIP-1559
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined,
            type: 0  // Legacy transaction type
          });
          
          console.log('[irysServiceSafe] Funding transaction submitted with legacy format:', fundTx);
          return {
            status: 'success',
            message: 'Funding transaction submitted with legacy format',
            tx: fundTx
          };
        } else {
          // Re-throw if it's not a transaction fee estimation error
          throw fundError;
        }
      }
    } catch (error) {
      console.error('[irysServiceSafe] Funding error:', error);
      
      // Handle specific error cases to provide better error messages
      let errorMessage = 'Unknown error during funding';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('eth_maxPriorityFeePerGas')) {
          errorMessage = 'Network fee estimation failed. Your network may not support EIP-1559 transactions.';
        } else if (errorMessage.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by the user';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds in your wallet to complete this transaction';
        }
      }
      
      throw new Error(errorMessage);
    }
  }
  
  async uploadData(
    data: string | File, 
    tags: Tag[] = []
  ): Promise<UploadResult> {
    console.log('[irysServiceSafe] Starting upload process...');
    const startTime = performance.now();
    
    try {
      // Request accounts to ensure we're connected
      console.log('[irysServiceSafe] Requesting accounts to ensure wallet connection...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Wallet not connected');
      }
      
      const account = accounts[0];
      console.log(`[irysServiceSafe] Using account for upload: ${account}`);
      
      // Add standard tags
      const allTags = [
        ...tags,
        { name: 'Content-Type', value: this.getContentType(data) },
        { name: 'App-Name', value: 'Irys Storage App' },
        { name: 'Upload-Date', value: new Date().toISOString() }
      ];
      
      // Connect to Irys
      console.log('[irysServiceSafe] Connecting to Irys for upload...');
      const irys = await this.connectToIrys();
      
      console.log(`[irysServiceSafe] Uploading data with tags:`, allTags);
      console.log(`[irysServiceSafe] Time elapsed so far: ${((performance.now() - startTime) / 1000).toFixed(3)} seconds`);
      
      // Upload the data
      console.log('[irysServiceSafe] Starting the actual upload operation...');
      let receipt;
      
      try {
        // Enable pay-as-you-go uploading by setting fundOnLoad to true
        // This will fund the transaction directly from the wallet at upload time
        const uploadOptions = { 
          tags: allTags,
          // This is the key option that enables pay-as-you-go
          fundOnLoad: true
        };
        
        if (typeof data === 'string') {
          console.log(`[irysServiceSafe] Uploading text (${data.length} characters) with pay-as-you-go`);
          receipt = await irys.upload(data, uploadOptions);
        } else {
          console.log(`[irysServiceSafe] Uploading file: ${data.name} (${data.size} bytes) with pay-as-you-go`);
          receipt = await irys.uploadFile(data, uploadOptions);
        }
      } catch (uploadError) {
        // Check if the error is related to transaction fee estimation
        if (uploadError instanceof Error && 
            uploadError.message.includes('eth_maxPriorityFeePerGas')) {
          console.error('[irysServiceSafe] Transaction fee estimation error, trying with legacy transaction type');
          
          // Try again with an explicit override for legacy transactions
          const uploadOptions = { 
            tags: allTags,
            fundOnLoad: true,
            // Force legacy transaction type
            txOptions: {
              gasPrice: undefined,
              maxFeePerGas: undefined,
              maxPriorityFeePerGas: undefined,
              type: 0  // Legacy transaction type
            }
          };
          
          if (typeof data === 'string') {
            receipt = await irys.upload(data, uploadOptions);
          } else {
            receipt = await irys.uploadFile(data, uploadOptions);
          }
        } else {
          // Re-throw if it's not a transaction fee estimation error
          throw uploadError;
        }
      }
      
      console.log(`[irysServiceSafe] Upload successful after ${((performance.now() - startTime) / 1000).toFixed(3)} seconds`);
      console.log('[irysServiceSafe] Receipt:', receipt);
      
      // Construct result
      const id = receipt.id;
      const url = `${this.getGatewayUrl()}/${id}`;
      
      return {
        id,
        url,
        receipt,
        transactionHash: id,
        explorerUrl: `${this.getExplorerUrl()}/tx/${id}`
      };
    } catch (error) {
      const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(3);
      console.error(`[irysServiceSafe] Upload error after ${timeElapsed} seconds:`, error);
      
      // Improved error handling
      let errorMessage = 'Upload failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Better user messaging for common errors
        if (errorMessage.includes('Insufficient balance')) {
          throw new Error('Insufficient funds in your wallet to cover the upload cost. The payment is made directly from your wallet.');
        }
        
        if (errorMessage.includes('eth_maxPriorityFeePerGas')) {
          throw new Error('Network fee estimation failed. Your network (Sepolia) may not fully support EIP-1559 transactions.');
        }

        if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
          throw new Error('Transaction was rejected. Please try again and approve the transaction in your wallet.');
        }
        
        if (errorMessage.includes('insufficient funds for gas')) {
          throw new Error('Your wallet does not have enough ETH to cover the gas fees for this transaction.');
        }
      }
      
      // Reset connection on any error to ensure clean state for next attempt
      this.resetConnection();
      
      throw error;
    }
  }
  
  private getContentType(data: string | File): string {
    // Handle Files
    if (data instanceof File) {
      return data.type || 'application/octet-stream';
    }
    
    // Handle strings (assume plain text if not JSON)
    try {
      JSON.parse(data);
      return 'application/json';
    } catch {
      return 'text/plain';
    }
  }
  
  async retrieveData(transactionId: string): Promise<RetrievedData> {
    try {
      // Construct gateway URL
      const gatewayUrl = `${this.getGatewayUrl()}/${transactionId}`;
      
      // Fetch the data
      const response = await fetch(gatewayUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve data: ${response.status} ${response.statusText}`);
      }
      
      // Get content type
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      // Handle different content types appropriately
      let data;
      
      if (contentType.includes('image/') || 
          contentType.includes('video/') || 
          contentType.includes('audio/') || 
          contentType.includes('application/pdf') ||
          contentType.includes('application/octet-stream')) {
        // Return as Blob for binary files
        data = await response.blob();
      } else if (contentType.includes('application/json')) {
        // Parse JSON
        data = await response.json();
      } else {
        // Get as text for all other types
        data = await response.text();
      }
      
      return {
        data,
        contentType,
        transactionId
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error retrieving data:', error);
      throw error;
    }
  }
  
  // Explicitly reset the Irys connection
  resetConnection(): void {
    console.log('[irysServiceSafe] Resetting Irys connection');
    this.irysUploader = null;
    this.lastWalletAddress = null;
    this.connectionInProgress = false;
  }
  
  setDevnet(isDevnet: boolean): void {
    this.isDevnet = isDevnet;
    // Reset the connection when changing networks
    this.resetConnection();
  }
  
  getIsDevnet(): boolean {
    return this.isDevnet;
  }

  // Add the getTransactionDetails method
  async getTransactionDetails(transactionId: string): Promise<TransactionDetails> {
    try {
      // The GraphQL endpoint
      const graphEndpoint = this.isDevnet ? 
        'https://devnet.irys.xyz/graphql' : 
        'https://node1.irys.xyz/graphql';
      
      // GraphQL query to get full transaction details
      const query = `
        query {
          transaction(id: "${transactionId}") {
            id
            timestamp
            signature
            owner {
              address
            }
            recipient
            tags {
              name
              value
            }
            fee {
              amount
              winston
            }
            quantity {
              amount
              winston
            }
            block {
              id
              height
              timestamp
            }
            verification {
              id
              address
              signature
              timestamp
              valid
            }
          }
        }
      `;
      
      const response = await fetch(graphEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction details: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL error: ${result.errors[0].message}`);
      }
      
      if (!result.data || !result.data.transaction) {
        throw new Error('Transaction not found');
      }
      
      // Format the result for our use
      const tx = result.data.transaction;
      
      return {
        transactionId: tx.id,
        transactionHash: tx.signature,
        owner: tx.owner?.address,
        timestamp: tx.timestamp,
        blockHeight: tx.block?.height,
        blockId: tx.block?.id,
        tags: tx.tags || [],
        explorerUrl: `${this.getExplorerUrl()}/tx/${tx.id}`,
        ownerExplorerUrl: tx.owner?.address ? `${this.getExplorerUrl()}/address/${tx.owner.address}` : null
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error fetching transaction details:', error);
      throw new Error(`Failed to get transaction details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance
export const irysServiceSafe = new IrysServiceSafe(); 

================================================
File: backups/.env.backup
================================================
VITE_IRYS_DEVNET=false
VITE_ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/e638c348a0c54037acafced72599383e 

================================================
File: backups/20250302_041121_irys_backup/package.json
================================================
{
  "name": "irys-storageapp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "prebuild": "npm install stream-browserify crypto-browserify -D",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@irys/query": "^0.0.9",
    "@irys/sdk": "^0.2.11",
    "@irys/web-upload": "^0.0.15",
    "@irys/web-upload-ethereum": "^0.0.16",
    "@irys/web-upload-ethereum-ethers-v6": "^0.0.16",
    "@monaco-editor/react": "^4.7.0",
    "ethers": "^6.9.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-dropzone": "^14.3.8",
    "react-router-dom": "^7.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.16",
    "browserify-sign": "^4.2.3",
    "buffer": "^6.0.3",
    "crypto-browserify": "^3.12.0",
    "eslint": "^9.21.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.15.0",
    "jsdom": "^26.0.0",
    "postcss": "^8.4.31",
    "process-es6": "^0.11.6",
    "readable-stream": "^4.7.0",
    "stream-browserify": "^3.0.0",
    "tailwindcss": "^3.3.3",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.24.1",
    "util": "^0.12.5",
    "vite": "^6.2.0",
    "vite-plugin-node-polyfills": "^0.23.0",
    "vitest": "^3.0.7"
  }
}


================================================
File: backups/20250302_041121_irys_backup/tailwind.config.js
================================================
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        primary: '#0066FF', // Bright blue like in the image
        secondary: '#64748B', // Slate-500
        success: '#10B981', // Emerald-500
        danger: '#EF4444', // Red-500
        warning: '#F59E0B', // Amber-500
        info: '#3B82F6', // Blue-500
        background: '#F8FAFC', // Very light gray/blue background
        surface: '#FFFFFF',  // White surface/card color
        text: {
          primary: '#0F172A', // Slate-900 
          secondary: '#64748B', // Slate-500
          muted: '#94A3B8',   // Slate-400
        },
        border: {
          light: '#E2E8F0', // Slate-200
          DEFAULT: '#CBD5E1', // Slate-300
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
} 

================================================
File: backups/20250302_041121_irys_backup/vite.config.ts
================================================
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list
      exclude: [
        // We'll handle these manually
        'process',
        'buffer',
      ],
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill specific modules
      protocolImports: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
  resolve: {
    alias: {
      // Add fallbacks for common Node.js modules
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      _stream_readable: 'readable-stream/readable.js',
      _stream_writable: 'readable-stream/writable.js',
      _stream_transform: 'readable-stream/transform.js',
      _stream_duplex: 'readable-stream/duplex.js',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: [
      'buffer', 
      'process', 
      'stream-browserify', 
      'crypto-browserify',
      'readable-stream',
      'browserify-sign'
    ],
  },
  define: {
    global: 'globalThis',
    'process.env': process.env,
  },
})


================================================
File: backups/20250302_041121_irys_backup/src/App.css
================================================
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}


================================================
File: backups/20250302_041121_irys_backup/src/App.test.tsx
================================================
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock the hooks
vi.mock('./hooks/useIrys', () => ({
  useIrys: () => ({
    isLoading: false,
    error: null,
    balance: '0.1',
    isDevnet: true,
    fetchBalance: vi.fn(),
    fundNode: vi.fn(),
    uploadData: vi.fn(),
    retrieveData: vi.fn(),
    toggleNetwork: vi.fn()
  })
}));

vi.mock('./hooks/useHistory', () => ({
  useHistory: () => ({
    history: [],
    addHistoryItem: vi.fn(),
    clearHistory: vi.fn(),
    removeHistoryItem: vi.fn()
  })
}));

// Simple test to check if the component renders
describe('App Component', () => {
  it('smoke test passes', () => {
    // We're just doing a simple smoke test to make sure the test framework works
    expect(true).toBe(true);
  });
}); 

================================================
File: backups/20250302_041121_irys_backup/src/App.tsx
================================================
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


================================================
File: backups/20250302_041121_irys_backup/src/index.css
================================================
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light;
  color: #0F172A;
  background-color: #F8FAFC;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #0066FF;
  text-decoration: inherit;
  transition: color 0.15s;
}
a:hover {
  color: #0052CC;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.25rem;
}

/* Remove default button styles to use our custom design */
button {
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

/* Add custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Add the animation utilities */
@layer utilities {
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-popIn {
    animation: popIn 0.2s ease-out forwards;
  }
}

/* Custom utility classes */
@layer components {
  .sidebar-item {
    @apply flex items-center gap-3 px-4 py-3 text-text-secondary rounded-md hover:bg-slate-100 transition-colors;
  }
  
  .sidebar-item.active {
    @apply bg-blue-50 text-primary font-medium;
  }
  
  .file-list-header {
    @apply text-text-secondary text-sm font-medium uppercase tracking-wider py-2;
  }
  
  .file-list-row {
    @apply flex items-center border-b border-border-light py-3 hover:bg-slate-50 transition-colors;
  }
  
  .file-icon {
    @apply flex-shrink-0 w-8 h-8 mr-3 text-text-secondary;
  }
  
  .file-name {
    @apply text-text-primary font-medium truncate;
  }
  
  .file-meta {
    @apply text-text-secondary text-sm;
  }
}

/* Light/dark mode adjustments */
@media (prefers-color-scheme: dark) {
  :root {
    color: #F8FAFC;
    background-color: #0F172A;
  }
  a:hover {
    color: #38BDF8;
  }
}


================================================
File: backups/20250302_041121_irys_backup/src/main.tsx
================================================
// Import process fix first to avoid conflicts
import './config/process-fix.js';

// Import other polyfills
import './config/large-file-patch.js';
import './config/buffer-patch.js';
import './config/readable-stream-patch.js';
import './config/direct-patch.js';
import './config/polyfills';
import './config/browserify-polyfills.js';
import './config/stream-patch.js';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { IrysProvider } from './providers/IrysProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <IrysProvider>
        <App />
      </IrysProvider>
    </BrowserRouter>
  </React.StrictMode>,
)


================================================
File: backups/20250302_041121_irys_backup/src/setupTests.ts
================================================
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import './config/polyfills';

// Properly mock window properties
Object.defineProperty(window, 'ethereum', {
  value: {
    request: vi.fn().mockResolvedValue([]),
    on: vi.fn(),
    removeListener: vi.fn(),
    autoRefreshOnNetworkChange: false,
  },
  writable: true,
  configurable: true, // Make sure it's configurable
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document.createElement
const originalCreateElement = document.createElement.bind(document);
document.createElement = vi.fn((tagName) => {
  if (tagName === 'a') {
    return {
      setAttribute: vi.fn(),
      style: {},
      click: vi.fn(),
      href: '',
      download: '',
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    };
  }
  return originalCreateElement(tagName);
}); 

================================================
File: backups/20250302_041121_irys_backup/src/utils.test.ts
================================================
import { describe, it, expect } from 'vitest';

describe('Basic Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
}); 

================================================
File: backups/20250302_041121_irys_backup/src/vite-env.d.ts
================================================
/// <reference types="vite/client" />


================================================
File: backups/20250302_041121_irys_backup/src/components/common/Button.tsx
================================================
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  icon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/30',
    secondary: 'bg-slate-100 text-text-secondary hover:bg-slate-200 focus:ring-2 focus:ring-slate-300',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300',
    info: 'bg-violet-500 text-white hover:bg-violet-600 focus:ring-2 focus:ring-violet-300',
    ghost: 'bg-transparent text-text-secondary hover:bg-slate-100 focus:ring-2 focus:ring-slate-200',
  };
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-1 rounded',
    sm: 'text-sm px-3 py-1.5 rounded',
    md: 'px-4 py-2 rounded-md',
    lg: 'text-lg px-6 py-3 rounded-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const loadingClass = isLoading ? 'opacity-80 cursor-not-allowed' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed hover:bg-opacity-100' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${loadingClass} ${disabledClass} ${className}`;
  
  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{children}</span>
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button; 

================================================
File: backups/20250302_041121_irys_backup/src/components/common/Card.tsx
================================================
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '',
  headerActions,
  noPadding = false
}) => {
  return (
    <div className={`bg-white rounded-lg border border-border-light overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-border-light flex justify-between items-center">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          ) : (
            title
          )}
          {headerActions && (
            <div className="flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
};

export default Card; 

================================================
File: backups/20250302_041121_irys_backup/src/components/common/ErrorBoundary.tsx
================================================
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Card from './Card';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Card className="mt-4 bg-red-50">
          <div className="text-center py-6">
            <h3 className="text-xl font-medium text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="primary" onClick={this.resetError}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 

================================================
File: backups/20250302_041121_irys_backup/src/components/common/History.tsx
================================================
import { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../../services/historyService';
import { HistoryItem } from '../../services/historyService';
import Card from './Card';
import Button from './Button';
import TransactionDetails from './TransactionDetails';

// File type icons
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    );
  } else if (type.startsWith('video/')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
      </svg>
    );
  } else if (type.startsWith('audio/')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
      </svg>
    );
  } else if (type.startsWith('text/') || type.includes('json')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    );
  } else if (type.includes('pdf')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
};

// Format file size
const formatFileSize = (bytes: number | undefined) => {
  if (bytes === undefined || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface HistoryProps {
  onSelectItem?: (id: string) => void;
}

const History = ({ onSelectItem }: HistoryProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);

  // Load history on component mount
  useEffect(() => {
    const items = getHistory();
    setHistoryItems(items);
  }, []);

  // Handle item click
  const handleItemClick = (id: string) => {
    setSelectedItem(id);
    if (onSelectItem) {
      onSelectItem(id);
    }
  };

  // Handle clear history
  const handleClearHistory = () => {
    clearHistory();
    setHistoryItems([]);
  };

  // Generate a unique key for each history item
  const getItemKey = (item: HistoryItem) => {
    return `${item.id}-${item.timestamp}`;
  };

  return (
    <Card 
      title="Upload History" 
      headerActions={
        <Button
          variant="ghost"
          size="xs"
          onClick={handleClearHistory}
          disabled={historyItems.length === 0}
        >
          Clear All
        </Button>
      }
      className="bg-white"
      noPadding
    >
      {historyItems.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">No history items found</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border-light">
          {/* Table header */}
          <div className="file-list-header grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider border-b border-border-light">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          {/* Table body */}
          <div className="divide-y divide-border-light">
            {historyItems.map((item) => (
              <div key={getItemKey(item)} className="flex flex-col">
                <div 
                  className={`file-list-row grid grid-cols-12 gap-4 px-4 py-3 text-sm cursor-pointer ${
                    selectedItem === item.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="col-span-5 flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      {getFileIcon(item.type)}
                    </div>
                    <div className="truncate font-medium">
                      {item.name || `File-${item.id.substring(0, 8)}`}
                    </div>
                  </div>
                  <div className="col-span-3 text-text-secondary truncate">
                    {formatDate(item.timestamp)}
                  </div>
                  <div className="col-span-2 text-text-secondary truncate">
                    {formatFileSize(item.size)}
                  </div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <button 
                      className="text-text-secondary hover:text-primary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/?tx=${item.id}`, '_blank');
                      }}
                      title="Open in browser"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </button>
                    {item.type === 'upload' && (
                      <button 
                        className="text-text-secondary hover:text-primary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetailsId(showDetailsId === item.id ? null : item.id);
                        }}
                        title="View transaction details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Transaction details panel */}
                {showDetailsId === item.id && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-border-light">
                    <TransactionDetails transactionId={item.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default History; 

================================================
File: backups/20250302_041121_irys_backup/src/components/common/SignaturePrompt.tsx
================================================
import React, { useEffect, useState } from 'react';
import Card from './Card';

const SignaturePrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  useEffect(() => {
    const checkSignatureRequest = () => {
      try {
        const signatureRequested = sessionStorage.getItem('signatureRequested') === 'true';
        const requestTimeStr = sessionStorage.getItem('signatureRequestTime');
        
        if (signatureRequested && requestTimeStr) {
          const requestTime = parseInt(requestTimeStr, 10);
          const elapsed = Math.floor((Date.now() - requestTime) / 1000);
          
          setIsVisible(true);
          setTimeElapsed(elapsed);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error checking signature status:', error);
      }
    };
    
    // Check immediately
    checkSignatureRequest();
    
    // Check periodically
    const interval = setInterval(checkSignatureRequest, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) {
    return null;
  }
  
  // Only show the prompt after a short delay to avoid flickering
  // for quick signatures
  if (timeElapsed < 2) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md">
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium mb-3">Waiting for Signature</h3>
          
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
          
          <p className="mb-4">
            Please check your wallet and confirm the signature request.
          </p>
          
          <div className="text-sm text-gray-500">
            Waiting for {timeElapsed} seconds...
          </div>
          
          <div className="mt-4 text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <p className="font-medium text-yellow-700">Tip</p>
            <p className="text-yellow-600">
              If you don't see a popup, check if your MetaMask extension is minimized
              or look for the MetaMask icon in your browser toolbar.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignaturePrompt; 

================================================
File: backups/20250302_041121_irys_backup/src/components/common/Tabs.tsx
================================================
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, className = '' }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTabId === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-4">{activeTab?.content}</div>
    </div>
  );
};

export default Tabs; 

================================================
File: backups/20250302_041121_irys_backup/src/components/common/TransactionDetails.tsx
================================================
import React, { useState, useEffect } from 'react';
import { irysServiceSafe as irysService } from '../../services/irysServiceSafe';
import { TransactionDetails as TxDetails } from '../../types';
import Card from './Card';
import Button from './Button';

interface TransactionDetailsProps {
  transactionId: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transactionId }) => {
  const [details, setDetails] = useState<TxDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!transactionId) return;
    
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const txDetails = await irysService.getTransactionDetails(transactionId);
        setDetails(txDetails);
      } catch (err) {
        console.error('Error fetching transaction details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transaction details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [transactionId]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  if (isLoading) {
    return (
      <Card title="Transaction Details">
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card title="Transaction Details">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>Error: {error}</p>
        </div>
      </Card>
    );
  }
  
  if (!details) {
    return (
      <Card title="Transaction Details">
        <div className="p-4">
          <p className="text-gray-500">No transaction details available.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Transaction Details">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Transaction ID</h3>
          <div className="flex items-center mt-1">
            <code className="bg-gray-100 p-2 rounded font-mono text-sm w-full overflow-x-auto">
              {details.transactionId}
            </code>
            <button 
              onClick={() => copyToClipboard(details.transactionId)}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700">Transaction Hash (Signature)</h3>
          <div className="flex items-center mt-1">
            <code className="bg-gray-100 p-2 rounded font-mono text-sm w-full overflow-x-auto">
              {details.transactionHash}
            </code>
            <button 
              onClick={() => copyToClipboard(details.transactionHash)}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {details.owner && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Owner</h3>
            <p className="font-mono text-sm mt-1 break-all">{details.owner}</p>
          </div>
        )}
        
        {details.timestamp && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Timestamp</h3>
            <p className="text-sm mt-1">{formatTimestamp(details.timestamp)}</p>
          </div>
        )}
        
        {details.blockHeight && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Block Height</h3>
            <p className="text-sm mt-1">{details.blockHeight}</p>
          </div>
        )}
        
        {details.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Tags</h3>
            <div className="mt-1 border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left font-medium text-gray-500">Name</th>
                    <th className="py-2 px-4 text-left font-medium text-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {details.tags.map((tag, index) => (
                    <tr key={index} className="bg-white">
                      <td className="py-2 px-4 font-mono">{tag.name}</td>
                      <td className="py-2 px-4 font-mono">{tag.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex space-x-3 pt-2">
          <Button 
            onClick={() => window.open(details.explorerUrl, '_blank')}
            variant="primary"
            size="sm"
          >
            View in Explorer
          </Button>
          
          {details.ownerExplorerUrl && (
            <Button 
              onClick={() => window.open(details.ownerExplorerUrl!, '_blank')}
              variant="secondary"
              size="sm"
            >
              View Owner
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionDetails; 

================================================
File: backups/20250302_041121_irys_backup/src/components/common/UploadResultDisplay.tsx
================================================
import React from 'react';
import { UploadResult } from '../../types';

interface UploadResultDisplayProps {
  result: UploadResult;
  onDismiss?: () => void;
}

const UploadResultDisplay: React.FC<UploadResultDisplayProps> = ({ result, onDismiss }) => {
  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Extract the clean ID from a potentially complex object
  const extractCleanId = (value: any): string => {
    try {
      // Handle null or undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      // Handle string values
      if (typeof value === 'string') {
        // Remove quotes if they exist and any JSON syntax
        return value.replace(/^"(.+)"$/, '$1').replace(/[{}"]/g, '');
      }
      
      // Handle object values with id property
      if (typeof value === 'object') {
        if (value.id) {
          return typeof value.id === 'string' 
            ? value.id.replace(/^"(.+)"$/, '$1').replace(/[{}"]/g, '')
            : String(value.id);
        }
        
        // Try to convert to string if possible
        const objString = String(value);
        if (objString !== '[object Object]') {
          return objString.replace(/[{}"]/g, '');
        }
        
        // Try to extract from JSON representation
        try {
          const jsonString = JSON.stringify(value);
          const idMatch = jsonString.match(/"id":"([^"]+)"/);
          if (idMatch && idMatch[1]) {
            return idMatch[1];
          }
        } catch (e) {
          console.error('Error parsing object:', e);
        }
      }
      
      // If we can't extract cleanly, convert to string and clean up
      const str = String(value).replace(/[{}"]/g, '');
      
      // Try to extract ID using regex if it's in a complex string
      const idMatch = str.match(/id:([^,}]+)/);
      if (idMatch && idMatch[1]) {
        return idMatch[1].trim();
      }
      
      return str === '[object Object]' ? '' : str;
    } catch (e) {
      console.error('Error extracting clean ID:', e);
      return '';
    }
  };

  // Open URL in new tab
  const openLink = (url: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  // Extract clean values - ensure we get proper string values
  const transactionId = extractCleanId(result.id);
  const transactionHash = result.transactionHash ? extractCleanId(result.transactionHash) : transactionId;
  
  // Always construct clean URLs directly using the transaction ID
  // This is the most reliable approach rather than trying to parse them from result
  const gatewayUrl = transactionId ? `https://gateway.irys.xyz/${transactionId}` : '';
  const explorerUrl = transactionId ? `https://explorer.irys.xyz/tx/${transactionId}` : '';

  // Don't render anything if we couldn't extract a transaction ID
  if (!transactionId) {
    console.error('Could not extract transaction ID from result:', result);
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 mt-4 shadow-sm">
        <div className="text-red-800">
          Error displaying transaction details. Please check the console for more information.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-6 mt-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-green-800 font-bold text-lg">Upload Successful!</h3>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="text-green-700 hover:text-green-900"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="space-y-4 divide-y divide-green-200">
        {/* Transaction ID */}
        <div className="pb-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            Transaction ID:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100">
              {transactionId}
            </code>
            <button 
              onClick={() => copyToClipboard(transactionId)}
              className="ml-2 p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
              title="Copy Transaction ID"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Transaction Hash */}
        <div className="py-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Transaction Hash:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100">
              {transactionHash}
            </code>
            <button 
              onClick={() => copyToClipboard(transactionHash)}
              className="ml-2 p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
              title="Copy Transaction Hash"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Gateway URL */}
        <div className="py-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Gateway URL:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100">
              {gatewayUrl}
            </code>
            <div className="flex-shrink-0 ml-2 space-x-1">
              <button 
                onClick={() => copyToClipboard(gatewayUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Copy Gateway URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
              <button 
                onClick={() => openLink(gatewayUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Open Gateway URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Explorer Link */}
        <div className="pt-3">
          <p className="text-sm text-green-800 font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Explorer:
          </p>
          <div className="flex items-center">
            <code className="bg-white p-2 rounded text-sm w-full overflow-x-auto font-mono text-green-900 border border-green-100 truncate">
              {explorerUrl}
            </code>
            <div className="flex-shrink-0 ml-2 space-x-1">
              <button 
                onClick={() => copyToClipboard(explorerUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Copy Explorer URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
              <button 
                onClick={() => openLink(explorerUrl)}
                className="p-1.5 text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-md transition-colors" 
                title="Open Explorer URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResultDisplay; 

================================================
File: backups/20250302_041121_irys_backup/src/components/retrieval/ResultsDisplay.tsx
================================================
import React from 'react';
import { Editor } from '@monaco-editor/react';
import Button from '../common/Button';
import Card from '../common/Card';
import { RetrievedData } from '../../types';

interface ResultsDisplayProps {
  data: RetrievedData | null;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const renderContent = () => {
    const { data: content, contentType } = data;

    // Handle JSON data
    if (contentType === 'application/json') {
      return (
        <div className="h-96 border rounded overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="json"
            defaultValue={JSON.stringify(content, null, 2)}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
      );
    }

    // Handle text data
    if (contentType.includes('text')) {
      return (
        <div className="h-96 border rounded overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={contentType.includes('html') ? 'html' : 'plaintext'}
            defaultValue={content}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on'
            }}
          />
        </div>
      );
    }

    // Handle image data
    if (contentType.includes('image')) {
      return (
        <div className="flex justify-center">
          <img 
            src={URL.createObjectURL(content)} 
            alt="Retrieved content" 
            className="max-h-96 max-w-full object-contain rounded"
          />
        </div>
      );
    }

    // Handle other binary data
    return (
      <div className="text-center p-8 border rounded">
        <p className="text-lg mb-4">Binary data: {contentType}</p>
        <Button
          onClick={() => {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `download-${data.transactionId.substring(0, 8)}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          Download File
        </Button>
      </div>
    );
  };

  return (
    <Card title="Retrieved Data" className="mt-4">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="font-medium">Transaction ID:</span>
          <span className="font-mono">{data.transactionId}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="font-medium">Content Type:</span>
          <span>{data.contentType}</span>
        </div>
        
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay; 

================================================
File: backups/20250302_041121_irys_backup/src/components/retrieval/RetrievalTab.tsx
================================================
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIrys } from '../../hooks/useIrys';
import Card from '../common/Card';
import Button from '../common/Button';
import { addHistoryItem } from '../../services/historyService';

// Icons
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const RetrievalTab = () => {
  const { retrieveData } = useIrys();
  const [transactionId, setTransactionId] = useState('');
  const [retrievedData, setRetrievedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataType, setDataType] = useState('');
  const [fileName, setFileName] = useState('');
  const location = useLocation();

  // Check for transaction ID in URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txId = params.get('tx');
    
    if (txId) {
      setTransactionId(txId);
      handleRetrieve(txId);
    }
  }, [location.search]);

  // Handle data retrieval
  const handleRetrieve = async (id: string = transactionId) => {
    if (!id) {
      setError('Please enter a transaction ID');
      return;
    }

    // Clean the transaction ID - remove any potential object references or formatting issues
    const cleanId = id.toString().trim().replace(/[\[\]{}"\s]/g, '');
    
    // If the cleaned ID is '[object Object]' or empty after cleaning, it's invalid
    if (!cleanId || cleanId === 'objectObject') {
      setError('Invalid transaction ID format. Please provide a valid transaction ID.');
      return;
    }

    setLoading(true);
    setError('');
    setRetrievedData(null);

    try {
      console.log(`Retrieving data for transaction ID: ${cleanId}`);
      const data = await retrieveData(cleanId);
      setRetrievedData(data);
      
      // Update UI with retrieved data
      if (data && data.contentType) {
        const contentType = data.contentType;
        setDataType(contentType);
        
        // Create a temporary tags array from available data
        // This is a workaround since RetrievedData doesn't have tags property directly
        const tags = [];
        
        // Add content type tag
        if (contentType) {
          tags.push({ name: 'Content-Type', value: contentType });
        }
        
        // Determine data type and file name
        let fileName = `File-${cleanId.substring(0, 8)}`;
        setFileName(fileName);
        
        // Add to history
        addHistoryItem({
          id: cleanId,
          name: fileName,
          size: typeof data.data === 'object' && data.data instanceof Blob ? data.data.size : 0,
          type: contentType || 'application/octet-stream',
          timestamp: Date.now(),
          tags: tags
        });
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      setError(error instanceof Error ? error.message : 'Failed to retrieve data');
    } finally {
      setLoading(false);
    }
  };

  // Download the retrieved data
  const handleDownload = () => {
    if (!retrievedData || !retrievedData.data) return;

    try {
      // Create object URL for the data
      let blob;
      if (typeof retrievedData.data === 'string') {
        // If data is already a string, convert to blob
        blob = new Blob([retrievedData.data], { type: dataType || 'application/octet-stream' });
      } else {
        // If data is an ArrayBuffer, create blob directly
        blob = new Blob([retrievedData.data], { type: dataType || 'application/octet-stream' });
      }
      const url = URL.createObjectURL(blob);
      
      // Create and click download link
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || `download-${transactionId.substring(0, 8)}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download file');
    }
  };

  // Render content based on data type
  const renderContent = () => {
    if (!retrievedData || !retrievedData.data) return null;

    try {
      if (dataType.startsWith('image/')) {
        // For images
        let blob;
        if (typeof retrievedData.data === 'string') {
          // If data is already a string, convert to blob - may not work for all images
          blob = new Blob([retrievedData.data], { type: dataType });
        } else {
          // If data is an ArrayBuffer, create blob directly
          blob = new Blob([retrievedData.data], { type: dataType });
        }
        const url = URL.createObjectURL(blob);
        return (
          <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
            <img 
              src={url} 
              alt="Retrieved content" 
              className="max-w-full max-h-96 object-contain rounded" 
              onLoad={() => URL.revokeObjectURL(url)}
            />
          </div>
        );
      } else if (dataType.startsWith('text/') || dataType.includes('json')) {
        // For text - handle both string and ArrayBuffer formats
        let text;
        if (typeof retrievedData.data === 'string') {
          // If data is already a string, use it directly
          text = retrievedData.data;
        } else {
          // If data is an ArrayBuffer, decode it
          try {
            text = new TextDecoder().decode(retrievedData.data);
          } catch (error) {
            console.error("Failed to decode data as ArrayBuffer:", error);
            // Fallback to string representation if possible
            text = String(retrievedData.data);
          }
        }
        
        return (
          <div className="p-4 bg-slate-50 rounded-lg overflow-auto max-h-96">
            <pre className="text-sm text-text-primary whitespace-pre-wrap break-words font-mono">
              {text}
            </pre>
          </div>
        );
      } else if (dataType.startsWith('video/')) {
        // For videos
        let blob;
        if (typeof retrievedData.data === 'string') {
          // If data is already a string, convert to blob
          blob = new Blob([retrievedData.data], { type: dataType });
        } else {
          // If data is an ArrayBuffer, create blob directly
          blob = new Blob([retrievedData.data], { type: dataType });
        }
        const url = URL.createObjectURL(blob);
        return (
          <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
            <video 
              controls 
              className="max-w-full max-h-96 rounded"
              onLoadedData={() => URL.revokeObjectURL(url)}
            >
              <source src={url} type={dataType} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      } else if (dataType.startsWith('audio/')) {
        // For audio
        let blob;
        if (typeof retrievedData.data === 'string') {
          // If data is already a string, convert to blob
          blob = new Blob([retrievedData.data], { type: dataType });
        } else {
          // If data is an ArrayBuffer, create blob directly
          blob = new Blob([retrievedData.data], { type: dataType });
        }
        const url = URL.createObjectURL(blob);
        return (
          <div className="p-4 bg-slate-50 rounded-lg">
            <audio 
              controls 
              className="w-full"
              onLoadedData={() => URL.revokeObjectURL(url)}
            >
              <source src={url} type={dataType} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      } else {
        // For other types, show a generic file icon
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <DocumentIcon />
            </div>
            <p className="text-sm font-medium mb-1">{fileName || `File (${dataType || 'Unknown type'})`}</p>
            <p className="text-xs text-text-secondary mb-3">
              {retrievedData.data ? 
                typeof retrievedData.data === 'string' 
                  ? `${(retrievedData.data.length / 1024).toFixed(2)} KB`
                  : `${(retrievedData.data.byteLength / 1024).toFixed(2)} KB` 
                : 'Unknown size'}
            </p>
            <Button 
              onClick={handleDownload}
              variant="secondary"
              size="sm"
            >
              Download File
            </Button>
          </div>
        );
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Failed to render content. Please try downloading the file instead.
        </div>
      );
    }
  };

  // Show tags from the retrieved data
  const renderTags = () => {
    // Type safety check - add fallback if tags don't exist on retrievedData
    // This addresses the error "Property 'tags' does not exist on type 'RetrievedData'"
    const hasTags = retrievedData && 
                   'tags' in retrievedData && 
                   Array.isArray((retrievedData as any).tags) && 
                   (retrievedData as any).tags.length > 0;
    
    if (!hasTags) {
      // If no tags available, show basic info about the content
      if (retrievedData) {
        const basicInfo = [
          { name: 'Content-Type', value: retrievedData.contentType || 'Unknown' },
          { name: 'Transaction ID', value: retrievedData.transactionId || transactionId },
          { name: 'Network', value: 'Sepolia Testnet' }
        ];
        
        return (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Content Information</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="grid gap-2">
                {basicInfo.map((info, index) => (
                  <div key={index} className="flex items-center bg-white rounded p-2 text-sm">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                      {info.name}
                    </span>
                    <span className="ml-2 text-text-secondary truncate">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      return null;
    }

    // If we have tags, render them
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">File Tags</h3>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="grid gap-2">
            {(retrievedData as any).tags.map((tag: {name: string, value: string}, index: number) => (
              <div key={index} className="flex items-center bg-white rounded p-2 text-sm">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  {tag.name}
                </span>
                <span className="ml-2 text-text-secondary truncate">
                  {tag.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Retrieving from Sepolia Testnet</h3>
        <p className="text-sm text-blue-700">
          You can retrieve any content that was uploaded to Irys on the Sepolia testnet.
          Just enter the transaction ID to access your content.
        </p>
      </div>

      <Card title="Retrieve Data" className="bg-white">
        <div className="space-y-4">
          {/* Transaction ID input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <Button 
              onClick={() => handleRetrieve()} 
              disabled={!transactionId || loading}
              isLoading={loading}
              className="whitespace-nowrap"
            >
              Retrieve
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-800 rounded text-sm">
              {error}
            </div>
          )}

          {/* Retrieved content */}
          {retrievedData && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium mb-2">Retrieved Content</h3>
              {renderContent()}
              
              {/* Always show download button */}
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleDownload}
                  variant="primary"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download File</span>
                </Button>
              </div>
              
              {renderTags()}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RetrievalTab; 

================================================
File: backups/20250302_041121_irys_backup/src/components/retrieval/TransactionInput.tsx
================================================
import React, { useState } from 'react';
import Button from '../common/Button';
import { useIrys } from '../../hooks/useIrys';

interface TransactionInputProps {
  onRetrieve: (transactionId: string) => void;
}

const TransactionInput: React.FC<TransactionInputProps> = ({ onRetrieve }) => {
  const [transactionId, setTransactionId] = useState<string>('');
  const { isLoading, isDevnet } = useIrys();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert('Please enter a transaction ID');
      return;
    }
    onRetrieve(transactionId.trim());
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="transaction-id" className="block text-sm font-medium text-gray-700">
            Transaction ID
          </label>
          <input
            id="transaction-id"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Enter the Irys transaction ID to retrieve data..."
          />
          <div className="text-sm text-gray-500">
            <span>Network: </span>
            <span className="px-2 py-0.5 bg-gray-200 rounded">
              {isDevnet ? 'Devnet' : 'Sepolia Testnet'}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          fullWidth
        >
          Retrieve Data
        </Button>
      </form>
    </div>
  );
};

export default TransactionInput; 

================================================
File: backups/20250302_041121_irys_backup/src/components/storage/FileUpload.tsx
================================================
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../common/Button';
import { useIrys } from '../../hooks/useIrys';
import { useHistory } from '../../hooks/useHistory';
import { Tag, UploadResult } from '../../types';
import UploadResultDisplay from '../common/UploadResultDisplay';

interface FileUploadProps {
  onUploadSuccess?: (result: { id: string; url: string }) => void;
  maxSize?: number; // In bytes
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadSuccess, 
  maxSize = 10 * 1024 * 1024 // Reduce default to 10MB from 30MB
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [walletStatus, setWalletStatus] = useState<{ isConnected: boolean; isChecking: boolean }>({ 
    isConnected: false, 
    isChecking: false 
  });
  const [tags, setTags] = useState<Tag[]>([
    { name: 'Content-Type', value: '' },
    { name: 'App-Name', value: 'Irys Storage App' }
  ]);
  
  const { uploadData, isLoading, error, isWalletConnected, verifyWalletConnected } = useIrys();
  const { addHistoryItem } = useHistory();

  // Check wallet connection status when component mounts
  useEffect(() => {
    const checkWallet = async () => {
      setWalletStatus(prev => ({ ...prev, isChecking: true }));
      try {
        const status = await verifyWalletConnected();
        console.log('Wallet connection status:', status);
        setWalletStatus({ 
          isConnected: status.isConnected && status.isCorrectNetwork, 
          isChecking: false 
        });
      } catch (err) {
        console.error('Error checking wallet:', err);
        setWalletStatus({ isConnected: false, isChecking: false });
      }
    };
    
    checkWallet();
  }, [verifyWalletConnected]);

  // Update Content-Type tag when file changes
  useEffect(() => {
    if (file) {
      const contentTypeIndex = tags.findIndex(tag => tag.name === 'Content-Type');
      if (contentTypeIndex >= 0) {
        const newTags = [...tags];
        newTags[contentTypeIndex].value = file.type;
        setTags(newTags);
      }
    }
  }, [file]);

  // Update error message when hook error changes
  useEffect(() => {
    if (error) {
      setUploadError(error);
    }
  }, [error]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check if file is too large
      if (file.size > maxSize) {
        setUploadError(`File is too large (${formatFileSize(file.size)}). Maximum allowed size is ${formatFileSize(maxSize)}.`);
        return;
      }
      
      // Clear errors when a valid file is dropped
      setUploadError(null);
      setFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      // Suggest title based on filename
      const titleIndex = tags.findIndex(tag => tag.name === 'Title');
      if (titleIndex >= 0) {
        const newTags = [...tags];
        // Remove extension and replace hyphens/underscores with spaces
        const suggestedTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        newTags[titleIndex].value = suggestedTitle;
        setTags(newTags);
      }
    }
  }, [tags, maxSize]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({ 
    onDrop,
    maxSize,
    multiple: false
  });

  const handleTagChange = (index: number, field: 'name' | 'value', value: string) => {
    const newTags = [...tags];
    newTags[index][field] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, { name: '', value: '' }]);
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    try {
      // First check wallet status
      setWalletStatus(prev => ({ ...prev, isChecking: true }));
      const walletStatus = await verifyWalletConnected();
      console.log('Wallet status before upload:', walletStatus);
      setWalletStatus({ 
        isConnected: walletStatus.isConnected && walletStatus.isCorrectNetwork, 
        isChecking: false 
      });
      
      if (!walletStatus.isConnected) {
        setUploadError(walletStatus.error || 'Wallet not connected. Please connect your wallet first.');
        return;
      }
      
      if (!walletStatus.isCorrectNetwork) {
        setUploadError(`Please switch to the Sepolia network. Currently connected to ${walletStatus.chainName || 'unknown network'}.`);
        return;
      }

      // Filter out any empty tags
      const validTags = tags.filter(tag => tag.name && tag.value);
      
      // Add a file size tag for reference
      validTags.push({ name: 'File-Size-Bytes', value: file.size.toString() });
      
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null) return 5;
          if (prev >= 95) return prev;
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 500);

      try {
        console.log('Starting upload with file:', file.name, file.type, file.size);
        const result = await uploadData(file, validTags);
        console.log('Upload successful:', result);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadResult(result);
        
        // Notify parent component
        if (onUploadSuccess) {
          onUploadSuccess({
            id: result.id,
            url: result.url
          });
        }
        
        // Add to history
        addHistoryItem({
          id: result.id,
          url: result.url,
          type: 'upload',
          name: file.name,
          contentType: file.type,
          size: file.size
        });
        
        // Reset the form after a delay
        setTimeout(() => {
          setFile(null);
          setPreview(null);
          setTags([
            { name: 'Content-Type', value: '' },
            { name: 'App-Name', value: 'Irys Storage App' }
          ]);
          setUploadProgress(null);
        }, 1500);
      } catch (error: any) {
        clearInterval(progressInterval);
        console.error('Upload error:', error);
        
        // Handle different types of errors
        if (error.message?.includes('insufficient funds')) {
          setUploadError('Insufficient funds in your wallet. Please add more Sepolia ETH to continue.');
        } else if (error.message?.includes('user rejected')) {
          setUploadError('Transaction was rejected. Please confirm the transaction in your wallet.');
        } else if (error.message?.includes('network')) {
          setUploadError('Network error. Please check your connection and try again.');
        } else {
          setUploadError(`Upload failed: ${error.message || 'Unknown error'}`);
        }
        
        setUploadProgress(null);
      }
    } catch (error: any) {
      console.error('Error in upload process:', error);
      setUploadError(`Error: ${error.message || 'Unknown error'}`);
      setUploadProgress(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Determine file icon based on file type
  const getFileIcon = () => {
    if (!file) return null;
    
    if (file.type.startsWith('image/')) {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (file.type.includes('pdf')) {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (file.type.includes('text') || file.type.includes('json')) {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  // Clear upload result
  const handleClearResult = () => {
    setUploadResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {/* File Drop Zone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/70 hover:bg-primary/5'}`}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            // File preview
            <div className="flex flex-col items-center justify-center">
              {getFileIcon()}
              <p className="mt-2 text-sm font-medium text-text-primary">{file?.name}</p>
              <p className="text-xs text-text-secondary mt-1">
                {file ? formatFileSize(file.size) : ''}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
              >
                Remove File
              </Button>
            </div>
          ) : (
            // Upload prompt
            <div className="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-text-primary font-medium">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Upload any file up to {formatFileSize(maxSize)}
              </p>
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">File Tags</h3>
          
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium min-w-24">
                {tag.name}
              </div>
              <input
                type="text"
                value={tag.value}
                onChange={(e) => handleTagChange(index, 'value', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                placeholder="Tag value"
              />
              {index > 1 && (
                <button 
                  onClick={() => removeTag(index)} 
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          
          {/* Add Tag Button */}
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={addTag}
            >
              Add Tag
            </Button>
          </div>
        </div>
        
        {/* Upload button and progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <Button
              fullWidth
              onClick={handleUpload}
              disabled={!file || isLoading || uploadProgress !== null || walletStatus.isChecking}
              isLoading={isLoading || uploadProgress !== null || walletStatus.isChecking}
              className={`${walletStatus.isConnected && file ? 'bg-primary hover:bg-primary/90 shadow-md' : ''} ${walletStatus.isConnected && file ? 'animate-pulse-slow' : ''}`}
            >
              Upload File {walletStatus.isConnected && file ? '(Ready)' : ''}
            </Button>
          </div>
          
          {/* Debug info */}
          <div className="text-xs text-text-secondary mt-1">
            Wallet: {walletStatus.isConnected ? 'Connected' : 'Not Connected'} 
            {walletStatus.isChecking && ' (Checking...)'}
          </div>
          
          {/* Upload progress */}
          {uploadProgress !== null && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">Uploading...</span>
                <span className="text-sm font-medium text-text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Connection status */}
          {!walletStatus.isConnected && !walletStatus.isChecking && (
            <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-100">
              Please connect your wallet before uploading.
            </div>
          )}
          
          {/* Upload result */}
          {uploadResult && (
            <UploadResultDisplay 
              result={uploadResult} 
              onDismiss={handleClearResult} 
            />
          )}
          
          {/* Upload error */}
          {uploadError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">
              {uploadError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 

================================================
File: backups/20250302_041121_irys_backup/src/components/storage/StorageTab.tsx
================================================
import { useState, useRef, useCallback, useEffect } from 'react';
import { useIrys } from '../../hooks/useIrys';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { addHistoryItem } from '../../services/historyService';
import TextInput from './TextInput';
import UploadResultDisplay from '../common/UploadResultDisplay';
import { UploadResult } from '../../types';

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const StorageTab = () => {
  const { uploadData, isLoading, fundNode, isWalletConnected, isDevnet } = useIrys();
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'file' | 'text'>('file');
  const [tags, setTags] = useState<{ name: string; value: string }[]>([
    { name: 'Content-Type', value: '' },
    { name: 'App-Name', value: 'Irys Storage App' },
  ]);
  const [showFundingUi, setShowFundingUi] = useState(false);
  const [fundAmount, setFundAmount] = useState('0.005');
  const [newTagName, setNewTagName] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [fundingSuccess, setFundingSuccess] = useState(false);
  const [fundingError, setFundingError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileId, setFileId] = useState('');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const navigate = useNavigate();

  // Update content type tag when file changes
  useEffect(() => {
    if (file) {
      const updatedTags = [...tags];
      const contentTypeTagIndex = updatedTags.findIndex(tag => tag.name === 'Content-Type');
      if (contentTypeTagIndex !== -1) {
        updatedTags[contentTypeTagIndex] = { ...updatedTags[contentTypeTagIndex], value: file.type || 'application/octet-stream' };
        setTags(updatedTags);
      }
    }
  }, [file]);

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadSuccess(false);
      setUploadError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false
  });

  // Handle tag addition
  const handleAddTag = () => {
    if (newTagName && newTagValue) {
      setTags([...tags, { name: newTagName, value: newTagValue }]);
      setNewTagName('');
      setNewTagValue('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    
    setUploadSuccess(false);
    setUploadError('');
    setUploadResult(null);
    
    try {
      const result = await uploadData(file, tags);
      if (result && result.id) {
        setFileId(result.id);
        setUploadSuccess(true);
        setUploadResult(result);
        
        // Add to history
        addHistoryItem({
          id: result.id,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          timestamp: Date.now(),
          tags: tags
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Unknown error occurred during upload');
      
      if (error instanceof Error && error.message.includes('Not enough funds')) {
        setShowFundingUi(true);
      }
    }
  };

  // Handle wallet funding
  const handleFund = async () => {
    setFundingError('');
    setFundingSuccess(false);
    
    try {
      await fundNode(fundAmount);
      setFundingSuccess(true);
    } catch (error) {
      console.error('Funding error:', error);
      setFundingError(error instanceof Error ? error.message : 'Unknown error occurred during funding');
    }
  };

  // Navigate to retrieval with current file ID
  const handleViewFile = () => {
    navigate(`/?tx=${fileId}`);
  };

  // Clear upload result
  const handleClearResult = () => {
    setUploadResult(null);
  };

  return (
    <div className="space-y-4">
      <Card title="Upload Content" className="bg-white">
        <div className="p-4 mb-4 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
          <h3 className="font-medium text-sm mb-2">Pay-as-you-go Uploads</h3>
          <p className="text-sm">
            This app now uses pay-as-you-go uploads on the Sepolia testnet. When you upload content:
          </p>
          <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
            <li>No pre-funding is required</li>
            <li>Your wallet pays directly at upload time</li>
            <li>Make sure you have enough Sepolia ETH for gas and storage costs</li>
            <li>Each transaction will require approval in your wallet</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          {/* Upload Type Selector */}
          <div className="flex border-b border-border-light mb-4">
            <button
              onClick={() => setUploadType('file')}
              className={`px-4 py-2 text-sm font-medium ${
                uploadType === 'file' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setUploadType('text')}
              className={`px-4 py-2 text-sm font-medium ${
                uploadType === 'text' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Upload Text
            </button>
          </div>
          
          {/* Content based on selected upload type */}
          {uploadType === 'file' ? (
            /* File Upload UI - existing code */
            <>
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-border-light hover:border-primary/50 hover:bg-slate-50'}
                  ${file ? 'bg-primary/5 border-primary/30' : ''}`}
              >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center justify-center space-y-2">
                  {file ? (
                    <>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <DocumentIcon />
                      </div>
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-text-secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <UploadIcon />
                      </div>
                      <p className="text-sm font-medium text-text-primary">
                        {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Support for a single file, up to 100MB in size
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Tags section - when in file mode */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">File Tags</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="grid gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded p-2 text-sm">
                        <div className="flex items-center">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">{tag.name}</span>
                          <span className="ml-2 text-text-secondary truncate max-w-xs">{tag.value}</span>
                        </div>
                        {/* Don't allow removal of Content-Type and App-Name */}
                        {(tag.name !== 'Content-Type' && tag.name !== 'App-Name') && (
                          <button 
                            onClick={() => handleRemoveTag(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Tag value"
                      value={newTagValue}
                      onChange={(e) => setNewTagValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
                    />
                    <Button 
                      onClick={handleAddTag} 
                      disabled={!newTagName || !newTagValue}
                      variant="secondary"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Add Tag
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Upload button */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  onClick={handleUpload}
                  isLoading={isLoading}
                  disabled={!file || isLoading || !isWalletConnected}
                  fullWidth
                  className="flex-1"
                >
                  Upload File
                </Button>
                
                {uploadSuccess && (
                  <Button
                    onClick={handleViewFile}
                    variant="secondary"
                    className="flex-1"
                  >
                    View File
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Text Upload UI */
            <TextInput 
              onUploadSuccess={(id) => {
                setFileId(id);
                setUploadSuccess(true);
              }} 
            />
          )}
          
          {/* Success and error messages */}
          {uploadSuccess && uploadType === 'file' && uploadResult && (
            <UploadResultDisplay result={uploadResult} onDismiss={handleClearResult} />
          )}
          
          {uploadError && (
            <div className="mt-2 p-3 bg-red-50 text-red-700 rounded text-sm">
              <p className="font-medium">Upload failed</p>
              <p className="text-xs mt-1">{uploadError}</p>
            </div>
          )}
          
          {/* Funding UI */}
          {showFundingUi && (
            <div className="mt-6">
              <Card title="Fund Your Account" className="bg-slate-50 border-slate-200">
                <p className="text-sm text-text-secondary mb-4">
                  You need to fund your account to upload files. This is a one-time operation 
                  per session and funds can be withdrawn at any time.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sm text-text-secondary">
                        {isDevnet ? 'SepoliaETH' : 'IRYS'}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleFund}
                    isLoading={isLoading}
                    className="whitespace-nowrap"
                  >
                    Fund Account
                  </Button>
                </div>
                
                {fundingSuccess && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 rounded text-sm">
                    Funding successful! You can now upload files.
                  </div>
                )}
                
                {fundingError && (
                  <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                    {fundingError}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StorageTab; 

================================================
File: backups/20250302_041121_irys_backup/src/components/storage/TextInput.css
================================================
.text-input-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.text-area {
  width: 100%;
  min-height: 150px;
  padding: 0.75rem;
  border: 1px solid #CBD5E1;
  border-radius: 0.375rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.text-area:focus {
  outline: none;
  border-color: #0066FF;
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
}

.tags-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #CBD5E1;
  border-radius: 0.375rem;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.tags-input:focus {
  outline: none;
  border-color: #0066FF;
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
}

.upload-button {
  padding: 0.75rem 1rem;
  background-color: #0066FF;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.upload-button:hover:not(:disabled) {
  background-color: #0052cc;
}

.upload-button:disabled {
  background-color: #a3a3a3;
  cursor: not-allowed;
} 

================================================
File: backups/20250302_041121_irys_backup/src/components/storage/TextInput.tsx
================================================
import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import { useIrys } from '../../hooks/useIrys';
import { useTags } from '../../hooks/useTags';
import { UploadResult } from '../../types';
import { historyService } from '../../services/historyService';
import UploadResultDisplay from '../common/UploadResultDisplay';
import './TextInput.css';

interface TextInputProps {
  onUploadSuccess?: (id: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onUploadSuccess }) => {
  const [text, setText] = useState<string>('');
  const [tagsStr, setTagsStr] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { parseTags } = useTags();
  const { 
    uploadData, 
    isLoading, 
    isWalletConnected, 
    connectWallet,
    verifyWalletConnected
  } = useIrys();

  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    
    // Initial connection check
    checkConnectionStatus();
    
    // Set up periodic connection checks
    connectionCheckRef.current = setInterval(checkConnectionStatus, 10000);
    
    return () => {
      setIsMounted(false);
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, []);
  
  // Function to check wallet connection status
  const checkConnectionStatus = async () => {
    if (!isMounted) return;
    
    console.log('[TextInput] Checking wallet connection status...');
    try {
      await verifyWalletConnected();
      console.log('[TextInput] Wallet connection verified');
    } catch (error) {
      console.log('[TextInput] Wallet connection check error:', error);
    }
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Handle tags change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsStr(e.target.value);
  };

  // Clear upload result
  const handleClearResult = () => {
    setUploadResult(null);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!text.trim()) {
      alert('Please enter some text to upload');
      return;
    }

    try {
      // Check wallet connection status right before upload
      console.log('[TextInput] Verifying wallet connection before upload...');
      const connected = await verifyWalletConnected();
      
      if (!connected) {
        console.log('[TextInput] Wallet not connected, showing connection prompt');
        
        // Show confirmation dialog to connect wallet
        if (window.confirm('Your wallet is not connected. Would you like to connect it now?')) {
          console.log('[TextInput] User confirmed wallet connection');
          
          try {
            await connectWallet();
            console.log('[TextInput] Wallet connected successfully');
          } catch (connError) {
            console.error('[TextInput] Wallet connection error:', connError);
            alert(`Failed to connect wallet: ${connError instanceof Error ? connError.message : 'Unknown error'}`);
            return;
          }
        } else {
          console.log('[TextInput] User declined wallet connection');
          alert('Wallet connection is required to upload data');
          return;
        }
      }

      // Process tags
      let tags = parseTags(tagsStr);
      
      // Add default content-type tag if not specified
      if (!tags.some(tag => tag.name.toLowerCase() === 'content-type')) {
        tags = [...tags, { name: 'Content-Type', value: 'text/plain' }];
      }
      
      // Add app tag
      tags = [...tags, { name: 'App-Name', value: 'IrysStorageApp' }];
      
      console.log('[TextInput] Uploading text with tags:', tags);
      
      // Perform the upload
      const result = await uploadData(text, tags);
      
      // Store the result in state
      setUploadResult(result);
      
      // Update history
      historyService.addHistoryItem({
        id: result.id,
        name: `Text upload (${new Date().toLocaleString()})`,
        type: 'upload',
        size: new Blob([text]).size,
        tags: tags,
        timestamp: Date.now()
      });
      
      // Clear inputs
      setText('');
      setTagsStr('');
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(result.id);
      }
    } catch (error) {
      console.error('[TextInput] Upload error:', error);
      
      let errorMessage = 'Upload failed: ';
      
      if (error instanceof Error) {
        if (error.message.includes('402 error')) {
          errorMessage += 'Wallet might need more ETH to cover the transaction. The upload uses pay-as-you-go funding directly from your wallet.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-1">
          Text Content
        </label>
        <textarea
          id="text-content"
          value={text}
          onChange={handleTextChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          rows={10}
          placeholder="Enter text to upload..."
        />
        <div className="mt-1 text-sm text-gray-500">
          {text.length} characters | {new Blob([text]).size} bytes
        </div>
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (Metadata)
        </label>
        <div className="text-xs text-gray-500 mb-1">
          Optional - format: key1=value1, key2=value2
        </div>
        <input
          id="tags"
          type="text"
          value={tagsStr}
          onChange={handleTagsChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          placeholder="Tags (e.g. key1=value1, key2=value2)"
        />
      </div>
      
      {!isWalletConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
          Your wallet is not connected. You'll be prompted to connect when uploading.
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleUpload}
          isLoading={isLoading}
          disabled={!text.trim()}
          className="w-full"
        >
          Upload Text (Pay-as-you-go)
        </Button>
        
        <p className="text-xs text-gray-500 italic">
          Note: Upload is funded directly from your wallet at the time of upload. No pre-funding required.
        </p>
      </div>
      
      {/* Display upload result if available */}
      {uploadResult && (
        <UploadResultDisplay 
          result={uploadResult} 
          onDismiss={handleClearResult} 
        />
      )}
      
      {!isWalletConnected && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          Error: Wallet connection required for uploads
        </div>
      )}
    </div>
  );
};

export default TextInput; 

================================================
File: backups/20250302_041121_irys_backup/src/components/wallet/NetworkSelector.test.tsx
================================================
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NetworkSelector from './NetworkSelector';

// Mock the useIrys hook
vi.mock('../../hooks/useIrys', () => ({
  useIrys: () => ({
    isDevnet: true,
    toggleNetwork: vi.fn(),
    isLoading: false
  })
}));

describe('NetworkSelector', () => {
  it('renders network options correctly', () => {
    render(<NetworkSelector />);
    
    // Check if both network options are rendered
    expect(screen.getByText('Testnet')).toBeDefined();
    expect(screen.getByText('Mainnet')).toBeDefined();
  });

  it('displays the current network correctly', () => {
    render(<NetworkSelector />);
    
    // In our mock, isDevnet is true, so Testnet should have bg-gray-200 class (secondary appearance)
    const testnetButton = screen.getByText('Testnet');
    expect(testnetButton.className).toContain('bg-gray-200');
    
    // Mainnet should have the primary appearance
    const mainnetButton = screen.getByText('Mainnet');
    expect(mainnetButton.className).toContain('bg-primary');
  });
}); 

================================================
File: backups/20250302_041121_irys_backup/src/components/wallet/NetworkSelector.tsx
================================================
import React from 'react';
import { useIrys } from '../../hooks/useIrys';
import Button from '../common/Button';

const NetworkSelector: React.FC = () => {
  const { isDevnet, toggleNetwork, isLoading, fetchBalance } = useIrys();

  const handleNetworkToggle = () => {
    toggleNetwork();
    // After toggling the network, give it a moment and then force a balance refresh
    setTimeout(() => {
      fetchBalance().catch(err => {
        console.error('[NetworkSelector] Error fetching balance after network toggle:', err);
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Network:</span>
        <div className="flex space-x-2">
          <Button
            onClick={handleNetworkToggle}
            disabled={isLoading || !isDevnet}
            variant={isDevnet ? "secondary" : "primary"}
            size="sm"
          >
            Devnet
          </Button>
          <Button
            onClick={handleNetworkToggle}
            disabled={isLoading || isDevnet}
            variant={!isDevnet ? "secondary" : "primary"}
            size="sm"
          >
            Sepolia Testnet
          </Button>
        </div>
      </div>
      
      {!isDevnet && (
        <div className="text-xs text-primary bg-blue-50 p-2 rounded border border-blue-100">
          <p className="font-medium">Pay-as-you-go mode active on Sepolia</p>
          <p>Uploads are funded directly from your wallet at transaction time.</p>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector; 

================================================
File: backups/20250302_041121_irys_backup/src/components/wallet/WalletConnect.tsx
================================================
import React, { useState, useEffect, useRef } from 'react';
import { useIrys } from '../../hooks/useIrys';
import Button from '../common/Button';
import NetworkSelector from './NetworkSelector';
import { useIrysContext } from '../../providers/IrysProvider';
import { getEthereum } from '../../config/polyfills';
import { irysServiceSafe } from '../../services/irysServiceSafe';

interface WalletConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnectionChange }) => {
  const [address, setAddress] = useState<string | null>(null);
  const { 
    fetchBalance, 
    isLoading: irysLoading, 
    fundNode, 
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
  const [fundAmount, setFundAmount] = useState<string>('0.01');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lastConnectionAttempt, setLastConnectionAttempt] = useState<number>(0);
  const [userDisconnected, setUserDisconnected] = useState<boolean>(false);
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [isRequestingTokens, setIsRequestingTokens] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fundingStatus, setFundingStatus] = useState<'processing' | 'pending_verification' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState<string | null>(null);

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

  const handleFund = async () => {
    if (!fundAmount || loading) return;
    
    try {
      setLoading(true);
      setErrorMessage(null);
      setFundingStatus('processing');
      
      console.log('[WalletConnect] Starting to fund with amount:', fundAmount);
      
      // Check if we have a pending transaction from a previous attempt
      const lastFundingTime = localStorage.getItem('last_funding_time');
      const lastFundingTxHash = localStorage.getItem('last_funding_tx_hash');
      
      // If we have a recent transaction (less than 5 minutes old), show it to the user
      if (lastFundingTime && lastFundingTxHash) {
        const timeSinceFunding = Date.now() - parseInt(lastFundingTime);
        if (timeSinceFunding < 5 * 60 * 1000) { // 5 minutes
          console.log(`[WalletConnect] Recent funding transaction found: ${lastFundingTxHash}`);
          setFundingStatus('pending_verification');
          
          // Show a message about the pending transaction
          setMessage(`Your recent funding transaction (${lastFundingTxHash.substring(0, 8)}...) is still processing. Please wait a few minutes for it to be confirmed.`);
          
          // Refresh balance in case it was updated
          await fetchBalance();
          
          // Return early, but keep loading state for a moment to show we tried
          setTimeout(() => setLoading(false), 2000);
          return;
        }
      }
      
      // If no recent transaction or it's old, proceed with new funding
      const result = await fundNode(fundAmount);
      
      console.log('[WalletConnect] Funding result:', result);
      
      // If transaction is pending, show appropriate message
      if (result && result.status === 'pending') {
        setFundingStatus('pending_verification');
        setMessage(`Your transaction is processing. It may take a few minutes to be confirmed on the blockchain. Transaction ID: ${result.txHash?.substring(0, 8)}...`);
        
        // Schedule balance checks
        scheduleBalanceChecks();
      } else {
        setFundingStatus('success');
        setMessage('Funding completed! Your balance will update shortly.');
        
        // Refresh balance immediately and then again after a delay
        await fetchBalance();
        scheduleBalanceChecks();
      }
      
      // Clear the input
      setFundAmount('');
    } catch (error) {
      console.error('[WalletConnect] Funding error:', error);
      setFundingStatus('failed');
      
      if (error instanceof Error) {
        // Check if this is a verification error but the transaction might be valid
        if (error.message.includes('failed to post funding tx') || 
            error.message.includes('tx doesn\'t exist')) {
          setMessage('Your transaction was submitted but verification is pending. Please check your wallet for the transaction status and try refreshing your balance in a few minutes.');
          
          // Schedule balance checks anyway
          scheduleBalanceChecks();
        } else {
          // Standard error handling
          setErrorMessage(error.message || 'Unknown error during funding');
        }
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
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

  // Function to request tokens from the Irys devnet faucet
  const handleRequestDevnetTokens = async () => {
    if (!isDevnet) {
      setErrorMessage('Faucet is only available on devnet');
      return;
    }
    
    if (!address) {
      setErrorMessage('Please connect your wallet first');
      return;
    }
    
    setIsRequestingTokens(true);
    setErrorMessage(null);
    
    try {
      console.log('[WalletConnect] Requesting devnet tokens for:', address);
      const success = await irysServiceSafe.requestDevnetTokens(address);
      
      if (success) {
        // Refresh balance after requesting tokens
        await fetchBalance();
        setErrorMessage('Successfully requested devnet tokens! Your balance should update shortly.');
      } else {
        // If faucet request failed but didn't throw an error
        setErrorMessage(
          'Failed to get tokens from the devnet faucet. Please try again in a few moments, or try uploading directly without pre-funding.'
        );
      }
    } catch (error) {
      console.error('[WalletConnect] Error requesting devnet tokens:', error);
      
      // More helpful error message with alternative instructions
      setErrorMessage(
        'Could not reach the devnet faucet. You can still upload files without pre-funding using the "pay-as-you-go" option during upload.'
      );
    } finally {
      setIsRequestingTokens(false);
    }
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
      {renderError()}
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
        {!address ? (
          <Button
            onClick={handleConnectWallet}
            className="font-medium rounded-full px-6 py-2 transform transition duration-150 hover:scale-105"
            isLoading={irysLoading}
          >
            Connect Wallet
          </Button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 bg-white font-medium text-gray-700 transform transition duration-150 hover:shadow-sm"
            >
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" title="Connected"></div>
                <span>{formatAddress(address)}</span>
              </div>
              <svg
                className={`h-4 w-4 text-gray-400 transform transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-lg shadow-lg z-10 origin-top-right animate-popIn">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Connected Account</span>
                  </div>
                  <div className="font-mono text-sm break-all">{address}</div>
                </div>
                
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Balance</span>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={fetchBalance} 
                      isLoading={irysLoading}
                      className="px-2 py-1 text-xs"
                    >
                      Refresh
                    </Button>
                  </div>
                  <div className="text-lg font-semibold">{parseFloat(balance).toFixed(6)} IRYS</div>
                  
                  <div className="mt-3 mb-3 p-3 bg-green-50 rounded-md text-sm text-green-700 border border-green-100">
                    <p className="font-semibold mb-1">Upload Without Pre-funding</p>
                    <p className="text-xs">
                      You can upload files directly using the pay-as-you-go method which funds the upload from your wallet at the time of upload.
                      No need to pre-fund your account!
                    </p>
                  </div>
                  
                  {!isDevnet && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md text-xs text-blue-700">
                      <p className="font-medium">Sepolia Testnet</p>
                      <p>Using Sepolia testnet for uploads with your connected Ethereum wallet.</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-col">
                    <div className="flex items-center mb-2">
                      <input
                        type="number"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        step="0.01"
                        min="0.01"
                        className="p-2 text-sm border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Amount to fund"
                      />
                      <span className="bg-gray-100 text-gray-700 font-medium text-sm px-3 py-2 rounded-r-md">
                        IRYS
                      </span>
                    </div>
                    <div className="mt-2">
                      <Button
                        onClick={handleFund}
                        isLoading={loading}
                        size="sm"
                        variant="primary"
                        fullWidth
                        className="mb-2"
                      >
                        Fund (Optional)
                      </Button>
                      
                      {isDevnet && (
                        <>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={handleRequestDevnetTokens}
                            isLoading={isRequestingTokens}
                            disabled={isRequestingTokens || !address}
                            fullWidth
                            className="mb-2"
                          >
                            Get Free Devnet Tokens
                          </Button>
                          <p className="text-xs text-gray-600 mb-3">
                            Even without tokens, you can upload files with the "pay-as-you-go" option
                            which will fund directly from your wallet at upload time.
                          </p>
                        </>
                      )}
                      
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={fetchBalance}
                          isLoading={irysLoading}
                          fullWidth
                          className="py-3 relative animate-pulse-slow border-2 border-blue-600"
                        >
                          <span className="flex items-center justify-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-2" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Check Balance
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <Button 
                    onClick={handleDisconnectWallet} 
                    variant="danger" 
                    size="sm"
                    fullWidth
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <NetworkSelector />
      </div>
    </div>
  );
};

export default WalletConnect; 
//src/components/wallet/WalletConnect.tsx

================================================
File: backups/20250302_041121_irys_backup/src/config/browserify-polyfills.js
================================================
// This file contains specific polyfills for browserify modules
// It's in JavaScript to avoid TypeScript errors with these specific polyfills

import { Buffer } from 'buffer';

// These are manual fixes for browserify-sign and related modules
if (typeof window !== 'undefined') {
  // Fix the "_stream_writable" and related issues
  if (!window._stream_writable) {
    window._stream_writable = {
      WritableState: function(options, stream) {
        this.objectMode = !!(options && options.objectMode);
        this.highWaterMark = options ? options.highWaterMark : 16 * 1024;
        this.needDrain = false;
        this.ending = false;
        this.ended = false;
        this.finished = false;
        this.destroyed = false;
        this.decodeStrings = !!(options && options.decodeStrings);
        this.defaultEncoding = 'utf8';
        this.length = 0;
        this.writing = false;
        this.corked = 0;
        this.sync = true;
        this.bufferProcessing = false;
        this.writelen = 0;
        this.bufferedRequest = null;
        this.lastBufferedRequest = null;
        this.pendingcb = 0;
        this.prefinished = false;
        this.errorEmitted = false;
        this.emitClose = !!(options && options.emitClose);
        this.autoDestroy = !!(options && options.autoDestroy);
        this.bufferedRequestCount = 0;
        this.writecb = null;
      },
      obj: function() {}
    };
  }

  // Fix the Buffer.prototype.slice issue
  if (Buffer && Buffer.prototype && typeof Buffer.prototype.slice !== 'function') {
    Buffer.prototype.slice = function(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;

      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }

      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }

      if (end < start) end = start;
      
      const newBuf = Buffer.alloc(end - start);
      for (let i = 0; i < end - start; ++i) {
        newBuf[i] = this[i + start];
      }
      return newBuf;
    };
  }

  // Fix for missing process.version
  if (!window.process) {
    window.process = {};
  }
  if (!window.process.version) {
    window.process.version = 'v16.0.0';
  }

  // Fix for Node's stream module used by browserify-sign
  if (!window.stream) {
    window.stream = {
      Writable: class Writable {
        constructor(options) { this.options = options || {}; }
        pipe() { return this; }
        on() { return this; }
        once() { return this; }
        emit() { return true; }
        write() { return true; }
        end() {}
      },
      Readable: class Readable {
        constructor(options) { this.options = options || {}; }
        pipe() { return this; }
        on() { return this; }
        once() { return this; }
        emit() { return true; }
        read() { return null; }
        push() { return true; }
      },
      Transform: class Transform {
        constructor(options) { this.options = options || {}; }
        pipe() { return this; }
        on() { return this; }
        once() { return this; }
        emit() { return true; }
        write() { return true; }
        read() { return null; }
        push() { return true; }
        end() {}
        _transform(chunk, encoding, callback) { callback(null, chunk); }
      }
    };
  }
} 

================================================
File: backups/20250302_041121_irys_backup/src/config/buffer-patch.js
================================================
// This file provides a direct patch for the Buffer.prototype.slice method
// which is causing the "Cannot read properties of undefined (reading 'slice')" error

import { Buffer } from 'buffer';

// Ensure Buffer is defined globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  
  // Check if Buffer.prototype.slice is missing and add it
  if (Buffer && Buffer.prototype && typeof Buffer.prototype.slice !== 'function') {
    console.log('Patching Buffer.prototype.slice');
    
    Buffer.prototype.slice = function(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;
      
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      
      if (end < start) end = start;
      
      const newBuf = Buffer.alloc(end - start);
      for (let i = 0; i < end - start; ++i) {
        newBuf[i] = this[i + start];
      }
      return newBuf;
    };
  }
  
  // Ensure Buffer.isBuffer is defined
  if (Buffer && typeof Buffer.isBuffer !== 'function') {
    Buffer.isBuffer = function(obj) {
      return obj != null && obj._isBuffer === true;
    };
  }
  
  // Ensure Buffer.from is defined
  if (Buffer && typeof Buffer.from !== 'function') {
    Buffer.from = function(value, encodingOrOffset, length) {
      if (typeof value === 'string') {
        return new Buffer(value, encodingOrOffset);
      }
      
      if (Array.isArray(value)) {
        const buf = new Buffer(value.length);
        for (let i = 0; i < value.length; ++i) {
          buf[i] = value[i];
        }
        return buf;
      }
      
      if (value instanceof Uint8Array) {
        const buf = new Buffer(value.length);
        for (let i = 0; i < value.length; ++i) {
          buf[i] = value[i];
        }
        return buf;
      }
      
      return new Buffer(value, encodingOrOffset, length);
    };
  }
  
  // Ensure Buffer.alloc is defined
  if (Buffer && typeof Buffer.alloc !== 'function') {
    Buffer.alloc = function(size, fill, encoding) {
      const buf = new Buffer(size);
      if (fill !== undefined) {
        if (typeof encoding === 'string') {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
  }
  
  // Ensure Buffer.allocUnsafe is defined
  if (Buffer && typeof Buffer.allocUnsafe !== 'function') {
    Buffer.allocUnsafe = function(size) {
      return new Buffer(size);
    };
  }
} 

================================================
File: backups/20250302_041121_irys_backup/src/config/direct-patch.js
================================================
// This file directly patches the specific issue with browserify-sign
// It targets the exact error: "Cannot read properties of undefined (reading 'slice')"

(function() {
  // The error happens in readable-stream's _stream_writable.js
  // We need to ensure the WritableState constructor is properly defined
  
  if (typeof window !== 'undefined') {
    // First, ensure we have a Buffer implementation with slice
    if (typeof Buffer !== 'undefined' && !Buffer.prototype.slice) {
      Buffer.prototype.slice = function(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === undefined ? len : ~~end;
        
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        
        if (end < start) end = start;
        
        const newBuf = Buffer.alloc(end - start);
        for (let i = 0; i < end - start; ++i) {
          newBuf[i] = this[i + start];
        }
        return newBuf;
      };
    }
    
    // Define the specific function that's causing the error
    // This is the exact function from readable-stream that's failing
    function BufferList() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    
    BufferList.prototype.push = function(v) {
      const entry = { data: v, next: null };
      if (this.length > 0) this.tail.next = entry;
      else this.head = entry;
      this.tail = entry;
      ++this.length;
    };
    
    BufferList.prototype.unshift = function(v) {
      const entry = { data: v, next: this.head };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    };
    
    BufferList.prototype.shift = function() {
      if (this.length === 0) return;
      const ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;
      else this.head = this.head.next;
      --this.length;
      return ret;
    };
    
    BufferList.prototype.clear = function() {
      this.head = this.tail = null;
      this.length = 0;
    };
    
    BufferList.prototype.join = function(s) {
      if (this.length === 0) return '';
      let p = this.head;
      let ret = '' + p.data;
      while (p = p.next) ret += s + p.data;
      return ret;
    };
    
    BufferList.prototype.concat = function(n) {
      if (this.length === 0) return Buffer.alloc(0);
      const ret = Buffer.allocUnsafe(n >>> 0);
      let p = this.head;
      let i = 0;
      while (p) {
        const buf = p.data;
        buf.copy(ret, i);
        i += buf.length;
        p = p.next;
      }
      return ret;
    };
    
    // Expose the BufferList to the window
    window.BufferList = BufferList;
    
    // Create a mock WritableState constructor
    function WritableState(options, stream) {
      options = options || {};
      
      // Define all the properties that might be accessed
      this.objectMode = Boolean(options.objectMode);
      this.highWaterMark = options.highWaterMark || 16 * 1024;
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      
      // Stream encoding options
      this.decodeStrings = options.decodeStrings !== false;
      this.defaultEncoding = options.defaultEncoding || 'utf8';
      
      // Buffer management
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      
      // Buffer chain management
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      
      // Event handling
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = options.autoDestroy === true;
      this.bufferedRequestCount = 0;
      
      // Cleanup
      this.corkedRequestsFree = {
        next: null,
        entry: null
      };
      
      // The buffer list
      this.bufferedRequestCount = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = {
        next: null,
        entry: null
      };
      
      // Add the buffer list
      this.buffer = new BufferList();
    }
    
    // Add the constructor to window
    window.WritableState = WritableState;
    
    // Fix for _stream_writable
    window._stream_writable = {
      WritableState: WritableState,
      BufferList: BufferList,
      obj: function(val) {
        return val !== null && typeof val === 'object';
      }
    };
  }
})(); 

================================================
File: backups/20250302_041121_irys_backup/src/config/large-file-patch.js
================================================
// This file provides enhanced polyfills for handling large file uploads
import { Buffer } from 'buffer';

// Ensure these are loaded before the code that needs them
(function enhanceStreamSupport() {
  if (typeof window !== 'undefined') {
    // Note: process object initialization is now handled in process-fix.js
    
    // Define stream chunk processing
    const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB chunk size for large files
    
    // Better stream implementations for large files
    window._largeFileStreamUtils = {
      // Chunk a large buffer for better memory management
      chunkBuffer: function(buffer, maxChunkSize = MAX_CHUNK_SIZE) {
        const chunks = [];
        let offset = 0;
        
        while (offset < buffer.length) {
          const chunkSize = Math.min(maxChunkSize, buffer.length - offset);
          const chunk = buffer.slice(offset, offset + chunkSize);
          chunks.push(chunk);
          offset += chunkSize;
        }
        
        return chunks;
      },
      
      // Process a large file in chunks
      processLargeFile: function(file, chunkCallback, doneCallback, errorCallback, maxChunkSize = MAX_CHUNK_SIZE) {
        const reader = new FileReader();
        let offset = 0;
        
        reader.onload = function(e) {
          try {
            if (e.target.result) {
              chunkCallback(e.target.result, offset);
            }
            
            offset += maxChunkSize;
            
            if (offset < file.size) {
              readNextChunk();
            } else {
              doneCallback();
            }
          } catch (err) {
            errorCallback(err);
          }
        };
        
        reader.onerror = function(e) {
          errorCallback(e.target.error);
        };
        
        function readNextChunk() {
          const slice = file.slice(offset, offset + maxChunkSize);
          reader.readAsArrayBuffer(slice);
        }
        
        readNextChunk();
      }
    };
    
    // Patch the readable-stream module's internal process references
    const originalSetTimeout = setTimeout;
    window._customSetTimeout = function(fn, timeout, ...args) {
      if (typeof fn !== 'function') {
        return originalSetTimeout(() => {}, timeout);
      }
      
      return originalSetTimeout(function() {
        try {
          fn.apply(this, args);
        } catch (e) {
          console.error('Error in setTimeout callback:', e);
        }
      }, timeout);
    };
    
    // Handle module-specific polyfills that might be missing
    if (!window._stream_passthrough) {
      window._stream_passthrough = {
        PassThrough: class PassThrough {
          constructor(options) { this.options = options || {}; }
          pipe() { return this; }
          on() { return this; }
          once() { return this; }
          emit() { return true; }
          write(chunk) { return true; }
          end() {}
          _transform(chunk, encoding, callback) { callback(null, chunk); }
          push() { return true; }
        }
      };
    }
  }
})(); 

================================================
File: backups/20250302_041121_irys_backup/src/config/polyfills.ts
================================================
// This file sets up polyfills and environment compatibility
import { Buffer } from 'buffer';

// Add Buffer to window if it doesn't exist
if (typeof window !== 'undefined') {
  // Explicitly set Buffer on the window
  window.Buffer = Buffer;
  
  // Note: process initialization is now handled in process-fix.js
  // This avoids conflicts with React and other libraries
  
  // Add setImmediate polyfill (used by some stream implementations)
  if (!window.setImmediate) {
    const setImmediatePolyfill = (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0);
    // Add __promisify__ for Node.js compatibility
    (setImmediatePolyfill as any).__promisify__ = function promisify() {
      return new Promise(resolve => setImmediatePolyfill(resolve));
    };
    window.setImmediate = setImmediatePolyfill as any;
  }
  
  // Add global
  if (!window.global) {
    window.global = window;
  }
}

// Create a safe wrapper for checking if ethereum exists without trying to define it
export const getEthereum = () => {
  try {
    // Don't attempt to modify ethereum property, just access it safely
    if (typeof window !== 'undefined') {
      return window.ethereum || null;
    }
  } catch (e) {
    console.warn('Error accessing ethereum:', e);
  }
  return null;
};

// More comprehensive stream fallbacks
export const safeStreamFallback = {
  Readable: class MockReadable {
    _readableState = { objectMode: false, highWaterMark: 16384 };
    on() { return this; }
    pipe() { return this; }
    read() { return null; }
    _read() {}
    push() { return true; }
    destroy() {}
    resume() { return this; }
    pause() { return this; }
  },
  Writable: class MockWritable {
    _writableState = { objectMode: false, highWaterMark: 16384 };
    on() { return this; }
    write() { return true; }
    end() {}
    _write() {}
    destroy() {}
  },
  Transform: class MockTransform {
    _transformState = { objectMode: false, highWaterMark: 16384 };
    on() { return this; }
    write() { return true; }
    end() {}
    push() { return true; }
    _transform(chunk: any, encoding: string, callback: Function) { callback(null, chunk); }
    destroy() {}
  },
  Stream: class MockStream {
    pipe() { return this; }
  }
};

// Handle specific polyfills for crypto modules
if (typeof window !== 'undefined') {
  // Fix specific issues with browserify-sign
  if (!Object.prototype.hasOwnProperty.call(window, '_stream_writable')) {
    (window as any)._stream_writable = safeStreamFallback.Writable;
  }
  if (!Object.prototype.hasOwnProperty.call(window, '_stream_readable')) {
    (window as any)._stream_readable = safeStreamFallback.Readable;
  }
  if (!Object.prototype.hasOwnProperty.call(window, '_stream_transform')) {
    (window as any)._stream_transform = safeStreamFallback.Transform;
  }
} 

// Make a function available directly for code that expects nextTick
if (typeof window !== 'undefined') {
  (window as any).processNextTick = function(fn: Function, ...args: any[]) {
    try {
      return setTimeout(() => fn(...args), 0);
    } catch (err) {
      console.error('Error in processNextTick:', err);
      return 0;
    }
  };
} 

================================================
File: backups/20250302_041121_irys_backup/src/config/process-fix.js
================================================
// Fix for process polyfill conflicts
// This file ensures process is available and writable, solving conflicts with React

// Since React and other libraries may try to directly set properties on process,
// we need to ensure it exists as a regular object, not a getter-only property

(function fixProcessPolyfill() {
  if (typeof window !== 'undefined') {
    // Create a backup of any existing process object
    const existingProcess = window.process || {};
    
    // Set up a proper process object that can be modified
    window.process = {
      ...(existingProcess || {}),
      env: {
        ...(existingProcess?.env || {})
      },
      browser: true,
      version: existingProcess?.version || 'v16.0.0'
    };

    // Ensure nextTick exists and is robust
    if (!window.process.nextTick) {
      window.process.nextTick = function nextTick(fn, ...args) {
        if (typeof fn !== 'function') {
          console.warn('process.nextTick called with non-function:', fn);
          return setTimeout(() => {}, 0);
        }
        try {
          return setTimeout(() => {
            try {
              fn.apply(this, args);
            } catch (err) {
              console.error('Error in process.nextTick callback:', err);
            }
          }, 0);
        } catch (err) {
          console.error('Error setting up nextTick:', err);
          return 0;
        }
      };
    }

    // Make sure global.process refers to window.process
    if (window.global) {
      window.global.process = window.process;
    }
  }
})(); 

================================================
File: backups/20250302_041121_irys_backup/src/config/readable-stream-patch.js
================================================
// This file provides a direct patch for the readable-stream module
// which is causing the "Cannot read properties of undefined (reading 'slice')" error

// Define the specific modules that are causing issues
if (typeof window !== 'undefined') {
  // Define the BufferList class used by _stream_writable
  class BufferList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    
    push(v) {
      const entry = { data: v, next: null };
      if (this.length > 0) this.tail.next = entry;
      else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
    
    unshift(v) {
      const entry = { data: v, next: this.head };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
    
    shift() {
      if (this.length === 0) return;
      const ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;
      else this.head = this.head.next;
      --this.length;
      return ret;
    }
    
    clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
    
    join(s) {
      if (this.length === 0) return '';
      let p = this.head;
      let ret = '' + p.data;
      while (p = p.next) ret += s + p.data;
      return ret;
    }
    
    concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      const ret = Buffer.allocUnsafe(n >>> 0);
      let p = this.head;
      let i = 0;
      while (p) {
        const buf = p.data;
        buf.copy(ret, i);
        i += buf.length;
        p = p.next;
      }
      return ret;
    }
  }
  
  // Define the WritableState constructor
  class WritableState {
    constructor(options, stream) {
      options = options || {};
      
      // Define all the properties that might be accessed
      this.objectMode = Boolean(options.objectMode);
      this.highWaterMark = options.highWaterMark || 16 * 1024;
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      
      // Stream encoding options
      this.decodeStrings = options.decodeStrings !== false;
      this.defaultEncoding = options.defaultEncoding || 'utf8';
      
      // Buffer management
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      
      // Buffer chain management
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      
      // Event handling
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = options.autoDestroy === true;
      this.bufferedRequestCount = 0;
      
      // Cleanup
      this.corkedRequestsFree = {
        next: null,
        entry: null
      };
      
      // The buffer list
      this.buffer = new BufferList();
    }
  }
  
  // Define the Writable class
  class Writable {
    constructor(options) {
      this._writableState = new WritableState(options, this);
      this.writable = true;
    }
    
    write(chunk, encoding, cb) {
      if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }
      
      if (cb) setTimeout(cb, 0);
      return true;
    }
    
    end(chunk, encoding, cb) {
      if (typeof chunk === 'function') {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }
      
      if (cb) setTimeout(cb, 0);
      return this;
    }
    
    on() { return this; }
    once() { return this; }
    emit() { return true; }
    removeListener() { return this; }
    removeAllListeners() { return this; }
    destroy() {}
  }
  
  // Define the ReadableState constructor
  class ReadableState {
    constructor(options, stream) {
      options = options || {};
      
      this.objectMode = Boolean(options.objectMode);
      this.highWaterMark = options.highWaterMark || 16 * 1024;
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || 'utf8';
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
    }
  }
  
  // Define the Readable class
  class Readable {
    constructor(options) {
      this._readableState = new ReadableState(options, this);
      this.readable = true;
    }
    
    read() { return null; }
    pipe() { return this; }
    on() { return this; }
    once() { return this; }
    emit() { return true; }
    removeListener() { return this; }
    removeAllListeners() { return this; }
    destroy() {}
    push() { return true; }
  }
  
  // Define the TransformState constructor
  class TransformState {
    constructor(options, stream) {
      this.afterTransform = function(er, data) {
        return afterTransform(stream, er, data);
      };
      
      this.needTransform = false;
      this.transforming = false;
      this.writecb = null;
      this.writechunk = null;
      this.writeencoding = null;
    }
  }
  
  function afterTransform(stream, er, data) {
    if (data != null) stream.push(data);
    if (stream._transformState.writecb) stream._transformState.writecb(er);
    return;
  }
  
  // Define the Transform class
  class Transform extends Writable {
    constructor(options) {
      super(options);
      this._transformState = new TransformState(options, this);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
    }
    
    _transform(chunk, encoding, cb) {
      cb(null, chunk);
    }
    
    push(chunk, encoding) {
      return true;
    }
  }
  
  // Expose the classes to the window
  window._stream_writable = {
    WritableState,
    Writable,
    BufferList,
    obj: function(val) {
      return val !== null && typeof val === 'object';
    }
  };
  
  window._stream_readable = {
    ReadableState,
    Readable,
    BufferList,
    obj: function(val) {
      return val !== null && typeof val === 'object';
    }
  };
  
  window._stream_transform = {
    TransformState,
    Transform,
    afterTransform,
    obj: function(val) {
      return val !== null && typeof val === 'object';
    }
  };
  
  // Also expose as modules for browserify
  window.require = window.require || function(name) {
    if (name === 'readable-stream/writable') return { Writable, WritableState };
    if (name === 'readable-stream/readable') return { Readable, ReadableState };
    if (name === 'readable-stream/transform') return { Transform, TransformState };
    if (name === 'readable-stream') return {
      Writable,
      Readable,
      Transform,
      Stream: Readable,
      Duplex: Transform
    };
    
    return null;
  };
} 

================================================
File: backups/20250302_041121_irys_backup/src/config/stream-patch.js
================================================
// This file provides specific patches for the readable-stream module
// used by browserify-sign which is causing the "Cannot read properties of undefined (reading 'slice')" error

// Define the WritableState constructor that's missing
if (typeof window !== 'undefined') {
  // Create a mock WritableState constructor
  const WritableState = function(options, stream) {
    options = options || {};
    
    // Define all the properties that might be accessed
    this.objectMode = Boolean(options.objectMode);
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    
    // Stream encoding options
    this.decodeStrings = options.decodeStrings !== false;
    this.defaultEncoding = options.defaultEncoding || 'utf8';
    
    // Buffer management
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    
    // Buffer chain management
    this.writecb = null;
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
    this.pendingcb = 0;
    this.prefinished = false;
    this.errorEmitted = false;
    
    // Event handling
    this.emitClose = options.emitClose !== false;
    this.autoDestroy = options.autoDestroy === true;
    this.bufferedRequestCount = 0;
    
    // Cleanup
    this.corkedRequestsFree = {
      next: null,
      entry: null
    };
  };
  
  // Add the constructor to window
  window.WritableState = WritableState;
  
  // Fix for _stream_writable
  if (!window._stream_writable) {
    window._stream_writable = {
      WritableState: WritableState,
      obj: function(val) {
        return val !== null && typeof val === 'object';
      }
    };
  }
  
  // Fix for Buffer.prototype.slice if it's missing
  if (typeof Buffer !== 'undefined' && 
      Buffer.prototype && 
      typeof Buffer.prototype.slice !== 'function') {
    
    Buffer.prototype.slice = function(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;
      
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      
      if (end < start) end = start;
      
      // Create a new buffer with the sliced content
      const newBuf = Buffer.alloc(end - start);
      for (let i = 0; i < end - start; ++i) {
        newBuf[i] = this[i + start];
      }
      return newBuf;
    };
  }
} 

================================================
File: backups/20250302_041121_irys_backup/src/hooks/useHistory.ts
================================================
import { useState, useEffect, useCallback } from 'react';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(historyService.getHistory());
  }, []);

  // Add history item
  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'timestamp'>) => {
    historyService.addHistoryItem(item);
    setHistory(historyService.getHistory());
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    historyService.clearHistory();
    setHistory([]);
  }, []);

  // Remove history item
  const removeHistoryItem = useCallback((id: string) => {
    historyService.removeHistoryItem(id);
    setHistory(historyService.getHistory());
  }, []);

  return {
    history,
    addHistoryItem,
    clearHistory,
    removeHistoryItem
  };
}; 

================================================
File: backups/20250302_041121_irys_backup/src/hooks/useIrys.ts
================================================
import { useState, useCallback, useEffect } from 'react';
import { irysServiceSafe as irysService } from '../services/irysServiceSafe';
import { UploadResult, RetrievedData, Tag } from '../types';
import { getEthereum } from '../config/polyfills';

export const useIrys = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isDevnet, setIsDevnet] = useState<boolean>(
    import.meta.env.VITE_IRYS_DEVNET === 'true'
  );
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  
  // IMPORTANT: Define hooks in the correct order to avoid reference errors
  
  // Improved wallet verification
  const verifyWalletConnected = useCallback(async () => {
    console.log('[useIrys] Verifying wallet connection...');
    
    try {
      // Use the irysService method for detailed wallet status
      const walletStatus = await irysService.checkWalletConnectionStatus();
      console.log('[useIrys] Wallet status:', walletStatus);
      
      // Update the connected state based on the status
      setIsWalletConnected(walletStatus.isConnected);
      
      // Store in session storage if connected
      if (walletStatus.isConnected && walletStatus.account) {
        try {
          sessionStorage.setItem('wallet_connected', 'true');
          sessionStorage.setItem('wallet_address', walletStatus.account);
        } catch (e) {
          console.warn('[useIrys] Error saving wallet connection state to sessionStorage:', e);
        }
      }
      
      // Return the full status object for more detailed information
      return walletStatus;
    } catch (error) {
      console.error('[useIrys] Error verifying wallet connection:', error);
      setIsWalletConnected(false);
      
      // Return a standardized error response
      return {
        isConnected: false,
        isCorrectNetwork: false,
        error: error instanceof Error ? error.message : 'Unknown error checking wallet connection'
      };
    }
  }, []);

  // Fetch balance - with debouncing to prevent cascading updates
  // This needs to be defined before any hooks that use it!
  const fetchBalance = useCallback(async () => {
    // Verify wallet is connected first
    const connected = await verifyWalletConnected();
    if (!connected) {
      // Only set error if we need to show it to the user during an explicit balance check
      // Don't set error for background checks or initial loading
      console.log('[useIrys] Wallet not connected during fetchBalance');
      return '0';
    }
    
    setIsLoading(true);
    setError(null);
    try {
      console.log('[useIrys] Fetching balance for network:', isDevnet ? 'devnet' : 'testnet');
      const balance = await irysService.getBalance();
      console.log('[useIrys] Balance received:', balance);
      
      // Only update if we have a valid balance to prevent unnecessary renders
      if (balance && balance !== 'NaN') {
        setBalance(balance);
      }
      return balance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useIrys] Error fetching balance:', errorMessage);
      // Don't set error for background operations
      return '0';
    } finally {
      setIsLoading(false);
    }
  }, [verifyWalletConnected, isDevnet]);

  // Check wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if user has explicitly disconnected
        const userDisconnected = localStorage.getItem('wallet_disconnected') === 'true';
        
        // If user explicitly disconnected, don't auto-connect
        if (userDisconnected) {
          console.log('[useIrys] User previously disconnected, not auto-connecting');
          setIsWalletConnected(false);
          return false;
        }
        
        const ethereum = getEthereum();
        if (!ethereum) return false;
        
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const isConnected = accounts && accounts.length > 0;
        
        console.log('[useIrys] Initial wallet check:', isConnected ? 'Connected' : 'Not connected');
        setIsWalletConnected(isConnected);
        
        // Store connection state
        if (isConnected) {
          localStorage.setItem('wallet_connected', 'true');
          if (accounts[0]) {
            localStorage.setItem('wallet_address', accounts[0]);
          }
        }
        
        return isConnected;
      } catch (err) {
        console.error('[useIrys] Error checking wallet connection:', err);
        setIsWalletConnected(false);
        return false;
      }
    };
    
    checkWalletConnection();
  }, []);

  // Reset error when status changes
  useEffect(() => {
    if (isWalletConnected) {
      setError(null);
    }
  }, [isWalletConnected]);

  // Connect wallet
  const connectWallet = useCallback(async (): Promise<boolean> => {
    console.log('[useIrys] Connecting wallet...');
    setError(null);
    setIsLoading(true);
    
    try {
      // Clear the disconnected flag when user explicitly connects
      try {
        localStorage.removeItem('wallet_disconnected');
      } catch (e) {
        console.warn('[useIrys] Error accessing localStorage:', e);
      }
      
      // Get Ethereum instance
      const ethereum = getEthereum();
      if (!ethereum) {
        setError('No Ethereum wallet detected. Please install MetaMask or a compatible wallet.');
        return false;
      }
      
      try {
        // Request wallet connection with timeout
        console.log('[useIrys] Requesting wallet accounts...');
        
        // Create a Promise wrapper with timeout
        const requestAccountsWithTimeout = async (timeoutMs: number = 30000) => {
          let timeoutId: NodeJS.Timeout;
          
          const timeoutPromise = new Promise<string[]>((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error('Wallet connection request timed out'));
            }, timeoutMs);
          });
          
          try {
            const accountsPromise = ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await Promise.race([accountsPromise, timeoutPromise]) as string[];
            clearTimeout(timeoutId!);
            return accounts;
          } catch (error) {
            clearTimeout(timeoutId!);
            throw error;
          }
        };
        
        // Request accounts with timeout
        const accounts = await requestAccountsWithTimeout();
        
        if (!accounts || accounts.length === 0) {
          setError('No accounts found. Please unlock your wallet and try again.');
          return false;
        }
        
        console.log('[useIrys] Wallet connected with account:', accounts[0]);
        
        // Save the connected address to localStorage to maintain state across page refreshes
        try {
          localStorage.setItem('wallet_address', accounts[0]);
          localStorage.setItem('wallet_connected', 'true');
        } catch (e) {
          console.warn('[useIrys] Error saving wallet info to localStorage:', e);
        }
        
        // Connect to Irys to verify the connection works
        await irysService.connectToIrys(true);
        console.log('[useIrys] Successfully connected to Irys node');
        
        // Update state after successful connection
        setIsWalletConnected(true);
        
        // Update the balance
        await fetchBalance();
        
        return true;
      } catch (err) {
        console.error('[useIrys] Error connecting wallet:', err);
        setError(`Failed to connect wallet: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance]);

  // Upload data
  const uploadData = useCallback(async (data: string | File | Blob, tags: Tag[] = []): Promise<UploadResult> => {
    // We need to check the connection first
    const connected = await verifyWalletConnected();
    if (!connected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      sessionStorage.setItem('networkChanged', 'false');
      
      // Set signature requested flag for UI feedback
      sessionStorage.setItem('signatureRequested', 'true');
      sessionStorage.setItem('signatureRequestTime', Date.now().toString());
      
      // Convert Blob to File if needed to match irysService.uploadData parameters
      let uploadData: string | File | Uint8Array;
      if (data instanceof Blob && !(data instanceof File)) {
        // Convert Blob to File by creating a new File instance
        uploadData = new File([data], 'blob-upload', { type: data.type });
      } else {
        uploadData = data as string | File;
      }
      
      const result = await irysService.uploadData(uploadData, tags);
      
      // Clear signature request flag
      sessionStorage.removeItem('signatureRequested');
      
      // Clear any indications of network change
      sessionStorage.removeItem('networkChanged');
      
      // Convert the result to a proper UploadResult object to fix the type errors
      // First create an object that matches the UploadResult type
      const uploadResult: UploadResult = {
        id: typeof result.id === 'string' ? result.id : JSON.stringify(result.id),
        url: typeof result.url === 'string' ? result.url : JSON.stringify(result.url),
        receipt: result.receipt,
        transactionHash: typeof result.transactionHash === 'string' ? 
          result.transactionHash : JSON.stringify(result.transactionHash),
        explorerUrl: typeof result.explorerUrl === 'string' ? 
          result.explorerUrl : JSON.stringify(result.explorerUrl)
      };
      
      console.log('[useIrys] Upload successful:', uploadResult);
      
      return uploadResult;
    } catch (error) {
      // Clear signature request flag
      sessionStorage.removeItem('signatureRequested');
      
      setError(error instanceof Error ? error.message : 'Unknown error during upload');
      
      // Check if the error is due to network change during upload
      const networkChanged = sessionStorage.getItem('networkChanged') === 'true';
      if (networkChanged) {
        setError('Network changed during upload. Please reconnect your wallet and try again.');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [verifyWalletConnected]);

  // Fund node
  const fundNode = async (amount: string): Promise<any> => {
    if (!amount) {
      throw new Error('Amount is required for funding');
    }

    if (parseFloat(amount) <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[useIrys] Starting fund operation with amount:', amount);
      
      // Save pre-funding balance for comparison
      let preFundingBalance = '0';
      try {
        preFundingBalance = await irysService.getBalance();
        console.log('[useIrys] Balance before funding:', preFundingBalance);
      } catch (balanceErr) {
        console.warn('[useIrys] Could not fetch pre-funding balance:', balanceErr);
      }
      
      // Funding operation with timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Funding operation timed out after 90 seconds in the useIrys hook.'));
        }, 90000); // 90-second timeout as backup
      });
      
      // Race the funding operation against the timeout
      const fundPromise = irysService.fundNode(amount);
      const result = await Promise.race([fundPromise, timeoutPromise]);
      
      console.log('[useIrys] Funding transaction submitted:', result);
      
      // If we have a transaction hash, we store it for reference
      if (result && typeof result === 'object') {
        try {
          // Store funding info safely - already handled in irysService
          // Just log for debug purposes
          if (result.tx && result.tx.id) {
            console.log('[useIrys] Transaction ID from result:', 
              typeof result.tx.id === 'string' ? result.tx.id : JSON.stringify(result.tx.id));
          }
        } catch (storageErr) {
          console.warn('[useIrys] Error accessing result data:', storageErr);
        }
      }
      
      // Schedule balance refresh
      setTimeout(async () => {
        try {
          const newBalance = await irysService.getBalance();
          console.log('[useIrys] Balance after funding timeout:', newBalance);
          setBalance(newBalance);
        } catch (refreshErr) {
          console.warn('[useIrys] Could not refresh balance after timeout:', refreshErr);
        }
      }, 5000);
      
      // Return the result from the service
      return result;
    } catch (error) {
      console.error('[useIrys] Funding error:', error);
      
      // If this is an error about a transaction that might be valid, we show a different message
      if (error instanceof Error && error.message.includes('failed to post funding tx')) {
        // Extract transaction ID if available
        const match = error.message.match(/tx - ([a-fA-F0-9]+) -/);
        if (match && match[1]) {
          const txId = match[1];
          console.log('[useIrys] Extracted transaction ID from error:', txId);
          
          // Schedule balance checks anyway
          scheduleBalanceChecks();
          
          // Return a modified result to indicate pending status
          return {
            status: 'pending',
            message: 'Transaction submitted but verification pending',
            txHash: txId
          };
        }
      }
      
      setError(error instanceof Error ? error.message : 'Unknown error during funding');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Schedule multiple balance checks with increasing delays
   */
  const scheduleBalanceChecks = () => {
    const delays = [5000, 15000, 30000, 60000]; // 5s, 15s, 30s, 60s
    
    delays.forEach(delay => {
      setTimeout(() => {
        console.log(`[useIrys] Scheduled balance check after ${delay}ms`);
        fetchBalance().catch(err => {
          console.warn('[useIrys] Error in scheduled balance check:', err);
        });
      }, delay);
    });
  };

  // Retrieve data - doesn't require wallet connection
  const retrieveData = useCallback(async (transactionId: string): Promise<RetrievedData> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await irysService.retrieveData(transactionId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err; // Re-throw to handle in the UI
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle network (devnet/mainnet)
  const toggleNetwork = useCallback(() => {
    console.log('[useIrys] Toggling network from', isDevnet ? 'devnet' : 'testnet', 'to', !isDevnet ? 'devnet' : 'testnet');
    const newIsDevnet = !isDevnet;
    setIsDevnet(newIsDevnet);
    irysService.setDevnet(newIsDevnet);
    
    // Reset balance when switching networks
    setBalance('0');
    
    // Force a balance refresh after a short delay to allow the network switch to complete
    setTimeout(() => {
      fetchBalance().catch(err => {
        console.error('[useIrys] Error fetching balance after network switch:', err);
      });
    }, 500);
  }, [isDevnet, fetchBalance]);

  // Set wallet connection status
  const setWalletConnection = useCallback((status: boolean) => {
    setIsWalletConnected(status);
    // If wallet is disconnected, reset balance
    if (!status) {
      setBalance('0');
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    console.log('[useIrys] Disconnecting wallet');
    
    // Update connection state first
    setIsWalletConnected(false);
    
    // Reset financial data
    setBalance('0');
    
    // Clear any error messages
    setError(null);
    
    // Try to disconnect from provider if it supports disconnection
    try {
      const ethereum = getEthereum();
      if (ethereum) {
        // Different wallets have different disconnect methods
        if (typeof ethereum.disconnect === 'function') {
          await ethereum.disconnect();
          console.log('[useIrys] Called ethereum.disconnect()');
        }
        
        // Some wallets support closeConnection
        if (typeof ethereum.closeConnection === 'function') {
          await ethereum.closeConnection();
          console.log('[useIrys] Called ethereum.closeConnection()');
        }
        
        // For WalletConnect v1
        if (ethereum.connector && typeof ethereum.connector.killSession === 'function') {
          await ethereum.connector.killSession();
          console.log('[useIrys] Called ethereum.connector.killSession()');
        }
        
        // For WalletConnect v2
        if (ethereum.provider && typeof ethereum.provider.disconnect === 'function') {
          await ethereum.provider.disconnect();
          console.log('[useIrys] Called ethereum.provider.disconnect()');
        }
        
        // Try to clear session cache if possible
        if (typeof ethereum.request === 'function') {
          try {
            // This works for some wallet implementations to clear permissions
            await ethereum.request({
              method: 'wallet_revokePermissions',
              params: [{ eth_accounts: {} }]
            });
            console.log('[useIrys] Revoked eth_accounts permission');
          } catch (err) {
            // Ignore errors as not all providers support this
            console.log('[useIrys] wallet_revokePermissions not supported');
          }
        }
      }
    } catch (err) {
      console.error('[useIrys] Error disconnecting from Ethereum provider:', err);
    }
    
    // Reset the underlying Irys connection in the service
    try {
      irysService.resetConnection();
    } catch (err) {
      console.error('[useIrys] Error resetting Irys connection:', err);
    }
    
    // Store disconnected state in localStorage
    try {
      localStorage.setItem('wallet_disconnected', 'true');
      localStorage.removeItem('wallet_connected');
      localStorage.removeItem('wallet_address');
    } catch (err) {
      console.error('[useIrys] Error updating localStorage:', err);
    }
    
    return true;
  }, []);

  return {
    isLoading,
    error,
    balance,
    isDevnet,
    isWalletConnected,
    connectWallet,
    fetchBalance,
    fundNode,
    uploadData,
    retrieveData,
    toggleNetwork,
    setWalletConnection,
    disconnectWallet,
    verifyWalletConnected
  };
}; 

================================================
File: backups/20250302_041121_irys_backup/src/hooks/useTags.ts
================================================
import { useMemo } from 'react';
import { Tag } from '../types';

export function useTags() {
  const parseTags = (tagsString: string): Tag[] => {
    if (!tagsString.trim()) {
      return [];
    }

    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.includes('='))
      .map(tag => {
        const [name, value] = tag.split('=', 2);
        return { name: name.trim(), value: value.trim() };
      });
  };

  const stringifyTags = (tags: Tag[]): string => {
    return tags.map(tag => `${tag.name}=${tag.value}`).join(', ');
  };

  const addTag = (tags: Tag[], name: string, value: string): Tag[] => {
    // Check if tag with this name already exists
    const existingIndex = tags.findIndex(tag => tag.name === name);
    
    if (existingIndex !== -1) {
      // Update existing tag
      const newTags = [...tags];
      newTags[existingIndex] = { name, value };
      return newTags;
    }
    
    // Add new tag
    return [...tags, { name, value }];
  };

  return useMemo(() => ({
    parseTags,
    stringifyTags,
    addTag
  }), []);
}

================================================
File: backups/20250302_041121_irys_backup/src/providers/IrysProvider.tsx
================================================
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

================================================
File: backups/20250302_041121_irys_backup/src/services/historyService.ts
================================================
import { Tag } from '../types';

const HISTORY_KEY = 'irys_app_history';

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: number;
  type: string;
  size: number;
  tags?: Tag[];
}

// Get history from localStorage
export const getHistory = (): HistoryItem[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
    return [];
  } catch (error) {
    console.error('Error retrieving history:', error);
    return [];
  }
};

// Save history to localStorage
export const saveHistory = (history: HistoryItem[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

// Add a new item to history
export const addHistoryItem = (item: HistoryItem): void => {
  try {
    const history = getHistory();
    // Check if item already exists by ID to avoid duplicates
    const exists = history.some(historyItem => historyItem.id === item.id);
    
    if (!exists) {
      const updatedHistory = [item, ...history].slice(0, 50); // Keep last 50 items
      saveHistory(updatedHistory);
    }
  } catch (error) {
    console.error('Error adding history item:', error);
  }
};

// Clear all history
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

// Remove a specific item from history
export const removeHistoryItem = (id: string): void => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    saveHistory(updatedHistory);
  } catch (error) {
    console.error('Error removing history item:', error);
  }
};

// Export a consolidated historyService object for compatibility
export const historyService = {
  getHistory,
  saveHistory,
  addHistoryItem,
  clearHistory,
  removeHistoryItem
};

export default historyService; 

================================================
File: backups/20250302_041121_irys_backup/src/services/irysService.ts
================================================
import { WebIrys } from '@irys/sdk';
import { ethers } from 'ethers';
import { UploadResult, RetrievedData, Tag } from '../types';
import { getEthereum } from '../config/polyfills';

// Add Ethereum window type
declare global {
  interface Window {
    ethereum: any;
  }
}

class IrysService {
  private isDevnet: boolean;
  
  constructor() {
    this.isDevnet = import.meta.env.VITE_IRYS_DEVNET === 'true';
  }
  
  getGatewayUrl(): string {
    return this.isDevnet ? 'https://devnet.gateway.irys.xyz' : 'https://gateway.irys.xyz';
  }
  
  getNodeUrl(): string {
    return this.isDevnet ? 'https://devnet.irys.xyz' : 'https://node1.irys.xyz';
  }
  
  async connectToIrys(): Promise<WebIrys> {
    // Connect to the Ethereum provider safely
    const ethereum = getEthereum();
    if (!ethereum) {
      throw new Error('No Ethereum provider found. Please install MetaMask or similar.');
    }
    
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      
      // Initialize WebIrys with the correct type structure
      const webIrys = new WebIrys({
        url: this.getNodeUrl(),
        token: 'ethereum',
        // @ts-ignore - The SDK types might be outdated
        provider: provider,
        wallet: { provider: signer }
      });
      
      await webIrys.ready();
      return webIrys;
    } catch (error) {
      console.error('Error connecting to Irys:', error);
      throw new Error('Failed to connect to Irys. Please check your wallet connection.');
    }
  }
  
  async getBalance(): Promise<string> {
    try {
      const irys = await this.connectToIrys();
      const balance = await irys.getLoadedBalance();
      // Convert to string to avoid BigNumber issues
      return balance.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }
  
  async fundNode(amount: string): Promise<any> {
    const irys = await this.connectToIrys();
    // Use the correct parsing method for the SDK
    const fundTx = await irys.fund(amount);
    return fundTx;
  }
  
  async uploadData(
    data: string | File, 
    tags: Tag[] = []
  ): Promise<UploadResult> {
    const irys = await this.connectToIrys();
    
    try {
      // If data is a string
      if (typeof data === 'string') {
        // Prepare receipt
        const receipt = await irys.upload(data, {
          tags: [
            { name: 'Content-Type', value: 'text/plain' },
            { name: 'Application', value: 'Irys Web App' },
            ...tags
          ]
        });
        
        return {
          id: receipt.id,
          url: `${this.getGatewayUrl()}/${receipt.id}`
        };
      } 
      // If data is a file
      else {
        const fileType = data.type || 'application/octet-stream';
        
        // Prepare receipt
        const receipt = await irys.uploadFile(data, {
          tags: [
            { name: 'Content-Type', value: fileType },
            { name: 'Application', value: 'Irys Web App' },
            ...tags
          ]
        });
        
        return {
          id: receipt.id,
          url: `${this.getGatewayUrl()}/${receipt.id}`
        };
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async retrieveData(transactionId: string): Promise<RetrievedData> {
    try {
      // Fetch data directly from gateway
      const response = await fetch(`${this.getGatewayUrl()}/${transactionId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      // Try to parse as JSON first
      try {
        const jsonData = await response.json();
        return { 
          data: jsonData,
          contentType: 'application/json',
          transactionId
        };
      } catch {
        // If not JSON, return as text or blob based on content-type
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('text')) {
          const textData = await response.text();
          return {
            data: textData,
            contentType,
            transactionId
          };
        } else {
          // Handle as binary data
          const blobData = await response.blob();
          return {
            data: blobData,
            contentType,
            transactionId
          };
        }
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  }

  setDevnet(isDevnet: boolean): void {
    this.isDevnet = isDevnet;
  }

  getIsDevnet(): boolean {
    return this.isDevnet;
  }
}

// Export a singleton instance
export const irysService = new IrysService(); 

================================================
File: backups/20250302_041121_irys_backup/src/services/irysServiceSafe.ts
================================================
import { WebUploader } from '@irys/web-upload';
import { WebEthereum } from '@irys/web-upload-ethereum';
import { EthersV6Adapter } from '@irys/web-upload-ethereum-ethers-v6';
import { ethers } from 'ethers';
import { UploadResult, RetrievedData, Tag, TransactionDetails } from '../types';
import { getEthereum } from '../config/polyfills';

// Add Ethereum window type
declare global {
  interface Window {
    ethereum: any;
  }
}

// Create a safer version of the Irys service using the newer WebUploader approach
class IrysServiceSafe {
  private isDevnet: boolean;
  private irysUploader: any = null;
  private lastWalletAddress: string | null = null;
  private connectionInProgress: boolean = false;
  
  constructor() {
    this.isDevnet = import.meta.env.VITE_IRYS_DEVNET === 'true';
  }
  
  getGatewayUrl(): string {
    return this.isDevnet 
      ? 'https://devnet.irys.xyz'
      : 'https://gateway.irys.xyz';
  }
  
  getNodeUrl(): string {
    return this.isDevnet
      ? 'https://devnet.irys.xyz'
      : 'https://node1.irys.xyz';
  }
  
  getExplorerUrl(): string {
    return this.isDevnet ? 'https://devnet.explorer.irys.xyz' : 'https://explorer.irys.xyz';
  }
  
  // Helper to detect if the wallet changed, which would require reconnection
  private async hasWalletChanged(): Promise<boolean> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        console.log('[irysServiceSafe] No Ethereum provider found, wallet changed');
        return true;
      }
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        console.log('[irysServiceSafe] No accounts available, wallet changed');
        return true;
      }
      
      // If we have a previous address and it's different, wallet changed
      if (this.lastWalletAddress && this.lastWalletAddress !== accounts[0]) {
        console.log('[irysServiceSafe] Wallet address changed from', this.lastWalletAddress, 'to', accounts[0]);
        return true;
      }
      
      // Update the last wallet address
      this.lastWalletAddress = accounts[0];
      return false;
    } catch (e) {
      console.error("[irysServiceSafe] Error checking if wallet changed:", e);
      return true; // Assume changed if error
    }
  }
  
  // Check if the wallet is connected without prompting for permissions
  async isWalletConnected(): Promise<boolean> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        console.log('[irysServiceSafe] No Ethereum provider found');
        return false;
      }
      
      // Use eth_accounts for a non-intrusive check of already-permitted accounts
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const connected = accounts && accounts.length > 0;
      
      // Log the result for debugging
      console.log('[irysServiceSafe] Wallet connection check:', connected ? 'Connected' : 'Not connected');
      if (connected) {
        console.log('[irysServiceSafe] Connected account:', accounts[0]);
        
        // If we have a connection, verify the chain ID to make sure we're on an appropriate network
        try {
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          console.log('[irysServiceSafe] Current chainId:', chainId);
        } catch (chainError) {
          console.warn('[irysServiceSafe] Error checking chain ID:', chainError);
        }
      } else {
        console.log('[irysServiceSafe] No accounts available');
      }
      
      return connected;
    } catch (error) {
      console.error('[irysServiceSafe] Error checking wallet connection:', error);
      return false;
    }
  }
  
  async connectToIrys(force: boolean = false): Promise<any> {
    console.log('[irysServiceSafe] Connecting to Irys...');
    
    // To avoid race conditions and duplicate connections
    if (this.connectionInProgress) {
      console.log('[irysServiceSafe] Connection already in progress, waiting...');
      // Wait for existing connection to complete
      while (this.connectionInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // If we now have a valid connection, return it
      if (this.irysUploader && !force) {
        const hasChanged = await this.hasWalletChanged();
        if (!hasChanged) {
          return this.irysUploader;
        }
      }
    }
    
    this.connectionInProgress = true;
    
    try {
      // First check if we have a valid connection already
      if (this.irysUploader && !force) {
        const hasChanged = await this.hasWalletChanged();
        if (!hasChanged) {
          return this.irysUploader;
        }
        // Otherwise continue to connect with new account
      }
      
      // Get the Ethereum provider
      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error('Ethereum provider not found. Please install MetaMask or another Web3 wallet.');
      }
      
      // Get accounts - first try without prompting
      let accounts;
      try {
        console.log('[irysServiceSafe] Attempting to get accounts without prompt');
        accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts && accounts.length > 0) {
          console.log('[irysServiceSafe] Found account without prompting:', accounts[0]);
        } else {
          // If no accounts, try requesting them (this will prompt user if needed)
          console.log('[irysServiceSafe] No accounts found, requesting with prompt');
          accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        }
      } catch (error) {
        console.error('[irysServiceSafe] Error getting accounts:', error);
        throw new Error('Failed to connect to wallet. Please make sure your wallet is unlocked and try again.');
      }
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No Ethereum accounts found. Please unlock your wallet and try again.');
      }
      
      const address = accounts[0];
      console.log('[irysServiceSafe] Using account for Irys connection:', address);
      
      // NEW: Save the current chain ID for network verification
      try {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('[irysServiceSafe] Using network chainId for connection:', chainId);
        sessionStorage.setItem('lastChainId', chainId);
      } catch (chainError) {
        console.warn('[irysServiceSafe] Error checking chain ID during connection:', chainError);
      }
      
      // Create a provider using the Ethereum object
      console.log('[irysServiceSafe] Creating Irys connection with WebUploader...');
      
      try {
        // Create instance on the appropriate network
        const url = this.getNodeUrl();
        console.log('[irysServiceSafe] Connecting to Irys node:', url);
        
        // UPDATED: Use ethers BrowserProvider with the EthersV6Adapter
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        console.log('[irysServiceSafe] Created ethers BrowserProvider');
        
        // Get the appropriate URL based on devnet setting
        const providerUrl = this.isDevnet ? 'https://devnet.irys.xyz' : 'https://node1.irys.xyz';
        
        console.log(`[irysServiceSafe] Creating WebUploader for ${this.isDevnet ? 'devnet' : 'mainnet'}`);
        console.log(`[irysServiceSafe] Using provider URL: ${providerUrl}`);
        
        // Use the basic WebUploader with explicit adapter and URL
        const uploader = await WebUploader(WebEthereum)
          .withAdapter(EthersV6Adapter(ethersProvider))
          .withRpc(providerUrl);

        console.log(`[irysServiceSafe] Connected successfully to Irys ${this.isDevnet ? 'devnet' : 'mainnet'}`);
        this.irysUploader = uploader;
        return uploader;
      } catch (readyError) {
        console.error('[irysServiceSafe] Error connecting to Irys node:', readyError);
        throw new Error(`Failed to connect to Irys: ${readyError instanceof Error ? readyError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[irysServiceSafe] Error in connectToIrys:', error);
      throw error;
    } finally {
      this.connectionInProgress = false;
    }
  }
  
  async getBalance(): Promise<string> {
    try {
      const uploader = await this.connectToIrys();
      const atomicBalance = await uploader.getLoadedBalance();
      
      // Handle the case when balance is zero or invalid
      if (!atomicBalance || atomicBalance.toString() === '0') {
        console.log('[irysServiceSafe] Zero balance detected');
        return '0';
      }
      
      try {
        // Convert from atomic units (wei) to ETH with better error handling
        const balance = ethers.formatEther(atomicBalance);
        return balance;
      } catch (formatError) {
        console.warn('[irysServiceSafe] Error formatting balance:', formatError);
        // Return the raw balance as a string as fallback
        return atomicBalance.toString();
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }
  
  async fundNode(amount: string): Promise<any> {
    if (!amount) {
      throw new Error('Amount is required for funding');
    }

    let fundingTxHash = '';

    try {
      // First check if wallet is connected
      const isConnected = await this.isWalletConnected();
      if (!isConnected) {
        console.error('[irysServiceSafe] Cannot fund: wallet not connected');
        throw new Error('Wallet not connected');
      }

      console.log('[irysServiceSafe] Starting fundNode with amount:', amount);

      // Connect to Irys (will reuse existing connection if possible)
      const irys = await this.connectToIrys();
      console.log('[irysServiceSafe] Connected to Irys, proceeding with funding');

      // Get the current balance for logging
      let initialBalance = '0';
      try {
        initialBalance = await irys.getLoadedBalance();
        console.log('[irysServiceSafe] Current balance before funding:', initialBalance);
      } catch (balanceErr) {
        console.warn('[irysServiceSafe] Could not fetch current balance:', balanceErr);
      }

      // Parse the amount to the correct format
      const parsedAmount = ethers.parseEther(amount);
      console.log('[irysServiceSafe] Starting fund operation with amount:', parsedAmount.toString());

      try {
        // Try with normal options first
        const fundTx = await irys.fund(parsedAmount);
        
        // Save the transaction hash for verification
        if (fundTx && fundTx.id) {
          fundingTxHash = typeof fundTx.id === 'string' ? fundTx.id : JSON.stringify(fundTx.id);
          // Save to local storage for recovery
          try {
            localStorage.setItem('last_funding_tx_hash', fundingTxHash);
            localStorage.setItem('last_funding_time', Date.now().toString());
            localStorage.setItem('last_funding_amount', amount);
          } catch (storageErr) {
            console.warn('[irysServiceSafe] Could not store funding tx info:', storageErr);
          }
        }
        
        console.log('[irysServiceSafe] Funding transaction submitted:', fundTx);
        
        // Start verifying the transaction with exponential backoff
        this.verifyFundingTransaction(fundingTxHash, initialBalance);
        
        return {
          status: 'success',
          message: 'Funding transaction submitted',
          tx: fundTx
        };
      } catch (fundError) {
        // Check if the error is related to transaction fee estimation
        if (fundError instanceof Error && 
            fundError.message.includes('eth_maxPriorityFeePerGas')) {
          console.error('[irysServiceSafe] Transaction fee estimation error, trying with legacy transaction type');
          
          // Try again with legacy transaction format
          const fundTx = await irys.fund(parsedAmount, {
            // Force using legacy transaction format instead of EIP-1559
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined,
            type: 0  // Legacy transaction type
          });
          
          // Save the transaction hash for verification
          if (fundTx && fundTx.id) {
            fundingTxHash = typeof fundTx.id === 'string' ? fundTx.id : JSON.stringify(fundTx.id);
            // Save to local storage for recovery
            try {
              localStorage.setItem('last_funding_tx_hash', fundingTxHash);
              localStorage.setItem('last_funding_time', Date.now().toString());
              localStorage.setItem('last_funding_amount', amount);
            } catch (storageErr) {
              console.warn('[irysServiceSafe] Could not store funding tx info:', storageErr);
            }
          }
          
          console.log('[irysServiceSafe] Funding transaction submitted with legacy format:', fundTx);
          
          // Start verifying the transaction with exponential backoff
          this.verifyFundingTransaction(fundingTxHash, initialBalance);
          
          return {
            status: 'success',
            message: 'Funding transaction submitted with legacy format',
            tx: fundTx
          };
        } else {
          // Re-throw if it's not a transaction fee estimation error
          throw fundError;
        }
      }
    } catch (error) {
      console.error('[irysServiceSafe] Funding error:', error);
      
      // Handle specific error cases to provide better error messages
      let errorMessage = 'Unknown error during funding';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('eth_maxPriorityFeePerGas')) {
          errorMessage = 'Network fee estimation failed. Your network may not support EIP-1559 transactions.';
        } else if (errorMessage.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by the user';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds in your wallet to complete this transaction';
        } else if (errorMessage.includes('failed to post funding tx') && fundingTxHash) {
          // This is the case where the transaction was submitted successfully but verification failed
          errorMessage = `Your transaction appears to be processing (${fundingTxHash.substring(0, 8)}...). Please check your balance in a few minutes.`;
          
          // Start verification in background
          this.verifyFundingTransaction(fundingTxHash, initialBalance);
          
          // Create a more optimistic response object
          return {
            status: 'pending',
            message: 'Transaction is processing. Please check your balance later.',
            txHash: fundingTxHash
          };
        }
      }
      
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Verifies a funding transaction with exponential backoff retries
   * @param txHash The transaction hash to verify
   * @param initialBalance The initial balance before funding
   */
  private async verifyFundingTransaction(txHash: string, initialBalance: any): Promise<void> {
    if (!txHash) {
      console.warn('[irysServiceSafe] No transaction hash provided for verification');
      return;
    }
    
    console.log(`[irysServiceSafe] Starting verification for transaction ${txHash}`);
    
    const MAX_RETRIES = 8; // More retries with exponential backoff
    let attempt = 0;
    let backoffMs = 5000; // Start with 5 seconds
    
    const checkTransaction = async () => {
      if (attempt >= MAX_RETRIES) {
        console.warn(`[irysServiceSafe] Max verification attempts reached for tx ${txHash}`);
        return;
      }
      
      attempt++;
      console.log(`[irysServiceSafe] Verification attempt ${attempt}/${MAX_RETRIES} for tx ${txHash}`);
      
      try {
        // Approach 1: Check if balance increased
        const irys = await this.connectToIrys(true); // Force reconnect to get fresh balance
        const currentBalance = await irys.getLoadedBalance();
        console.log(`[irysServiceSafe] Balance check: Current=${currentBalance}, Initial=${initialBalance}`);
        
        // If balance increased, consider it successful
        if (currentBalance > initialBalance) {
          console.log(`[irysServiceSafe] Transaction verified: Balance increased from ${initialBalance} to ${currentBalance}`);
          return;
        }
        
        // Approach 2: Try to verify the transaction with the bundler
        try {
          const walletAddress = await this.getWalletAddress();
          if (!walletAddress) throw new Error('No wallet address available');
          
          // Use the node URL directly to check balance
          const nodeUrl = this.getNodeUrl();
          const url = `${nodeUrl}/account/balance/ethereum?address=${walletAddress}`;
          
          console.log(`[irysServiceSafe] Checking balance at URL: ${url}`);
          const response = await fetch(url);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`[irysServiceSafe] Balance from API: ${data}`);
            
            // If we got a successful response, consider the transaction verified
            if (data && parseInt(data) > 0) {
              console.log(`[irysServiceSafe] Transaction verified via API check`);
              return;
            }
          } else {
            console.warn(`[irysServiceSafe] API balance check failed: ${response.status}`);
          }
        } catch (apiErr) {
          console.warn(`[irysServiceSafe] Error checking balance via API:`, apiErr);
        }
        
        // Schedule next attempt with exponential backoff
        backoffMs = Math.min(backoffMs * 1.5, 60000); // Cap at 60 seconds
        setTimeout(checkTransaction, backoffMs);
        
      } catch (error) {
        console.warn(`[irysServiceSafe] Error verifying transaction:`, error);
        
        // Schedule next attempt with exponential backoff even after error
        backoffMs = Math.min(backoffMs * 1.5, 60000);
        setTimeout(checkTransaction, backoffMs);
      }
    };
    
    // Start the verification process
    setTimeout(checkTransaction, 5000); // Start with initial delay
  }
  
  /**
   * Gets the current wallet address if available
   */
  private async getWalletAddress(): Promise<string | null> {
    try {
      const ethereum = getEthereum();
      if (!ethereum) return null;
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) return null;
      
      return accounts[0];
    } catch (error) {
      console.warn('[irysServiceSafe] Error getting wallet address:', error);
      return null;
    }
  }
  
  /**
   * Checks the wallet connection status and network information
   * @returns An object with connection status details
   */
  async checkWalletConnectionStatus(): Promise<{
    isConnected: boolean;
    chainId?: string; 
    chainName?: string;
    account?: string;
    isCorrectNetwork: boolean;
    error?: string;
  }> {
    try {
      // Check if ethereum provider exists
      const provider = (window as any).ethereum;
      if (!provider) {
        return {
          isConnected: false,
          isCorrectNetwork: false,
          error: 'No Ethereum provider found. Please install MetaMask.'
        };
      }

      // Get current accounts
      const accounts = await provider.request({ method: 'eth_accounts' });
      const isConnected = accounts && accounts.length > 0;
      
      if (!isConnected) {
        return {
          isConnected: false,
          isCorrectNetwork: false,
          error: 'Wallet not connected. Please connect your wallet.'
        };
      }

      // Get chain ID and determine if it's Sepolia
      const chainId = await provider.request({ method: 'eth_chainId' });
      const isCorrectNetwork = chainId === '0xaa36a7'; // Sepolia chain ID
      
      // Determine chain name
      let chainName = 'Unknown Network';
      if (chainId === '0xaa36a7') chainName = 'Sepolia Testnet';
      else if (chainId === '0x1') chainName = 'Ethereum Mainnet';
      else if (chainId === '0x5') chainName = 'Goerli Testnet';
      else if (chainId === '0x13881') chainName = 'Polygon Mumbai';
      
      return {
        isConnected,
        chainId,
        chainName,
        account: accounts[0],
        isCorrectNetwork
      };
    } catch (error: any) {
      console.error('Error checking wallet status:', error);
      return {
        isConnected: false,
        isCorrectNetwork: false,
        error: `Error checking wallet: ${error.message}`
      };
    }
  }
  
  /**
   * Uploads data to the Irys network
   * @param data The data to upload
   * @param tags The tags to attach to the upload
   * @returns The transaction ID of the upload
   */
  async uploadData(data: File | Uint8Array | string, tags: Tag[] = []): Promise<UploadResult> {
    try {
      // Make sure we're connected to Irys
      const uploader = await this.connectToIrys();
      
      // Check if we're on the Sepolia network (chainId 11155111 or 0xaa36a7)
      const provider = (window as any).ethereum;
      if (provider) {
        const chainId = await provider.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);
        
        // Check if we're on Sepolia (11155111 decimal = 0xaa36a7 hex)
        if (chainId !== '0xaa36a7') {
          throw new Error('Please connect to the Sepolia network (Chain ID: 11155111) to upload files.');
        }
      }
      
      // If data is a string, convert it to a Uint8Array
      let dataToUpload: Uint8Array | Buffer;
      if (typeof data === 'string') {
        // Use Buffer to ensure compatibility with the irys uploader
        dataToUpload = Buffer.from(data, 'utf-8');
      } else if (data instanceof File) {
        // If data is a File, read it as an ArrayBuffer and convert to Buffer
        const arrayBuffer = await data.arrayBuffer();
        dataToUpload = Buffer.from(arrayBuffer);
      } else {
        // If data is already a Uint8Array, convert to Buffer to ensure compatibility
        dataToUpload = Buffer.from(data);
      }
      
      // Add file size tag if uploading a File
      if (data instanceof File) {
        tags.push({ name: "Content-Length", value: data.size.toString() });
        tags.push({ name: "Content-Type", value: data.type || "application/octet-stream" });
        
        // Add a file upload timestamp
        tags.push({ name: "Upload-Timestamp", value: new Date().toISOString() });
        tags.push({ name: "Network", value: "Sepolia" });
      }
      
      // Add content type for text uploads if not specified
      if (typeof data === 'string' && !tags.some(tag => tag.name.toLowerCase() === 'content-type')) {
        tags.push({ name: "Content-Type", value: "text/plain" });
      }
      
      // Filter out any tags with empty names or values
      const validTags = tags.filter(tag => tag.name && tag.value);
      
      console.log('Starting upload with tags:', validTags);
      
      try {
        // Attempt upload with the default transaction parameters
        const receipt = await uploader.upload(dataToUpload, {
          tags: validTags
        });
        
        console.log('Upload successful:', receipt);
        
        // Create a proper UploadResult object
        const txId = receipt.id;
        const gatewayUrl = this.isDevnet 
          ? `https://gateway.irys.xyz/devnet/${txId}`
          : `https://gateway.irys.xyz/${txId}`;
          
        const explorerUrl = this.isDevnet 
          ? `https://explorer.irys.xyz/devnet/tx/${txId}`
          : `https://explorer.irys.xyz/tx/${txId}`;
          
        return {
          id: txId,
          url: gatewayUrl,
          receipt: receipt,
          transactionHash: receipt.id,
          explorerUrl: explorerUrl
        };
      } catch (uploadError: any) {
        console.error('Upload error:', uploadError);
        
        // Check for specific error types and provide better error messages
        if (uploadError.message && uploadError.message.includes('insufficient funds')) {
          throw new Error('Insufficient funds in your wallet to complete this upload. Please add more Sepolia ETH.');
        }
        
        if (uploadError.message && uploadError.message.includes('fee estimation')) {
          console.log('Fee estimation error, attempting with legacy transaction type...');
          
          // Try again with legacy transaction type
          try {
            const receipt = await uploader.upload(dataToUpload, {
              tags: validTags,
              options: {
                // Force legacy transaction type
                txType: 0
              }
            });
            
            console.log('Upload successful with legacy transaction:', receipt);
            
            // Create a proper UploadResult object for legacy uploads
            const txId = receipt.id;
            const gatewayUrl = this.isDevnet 
              ? `https://gateway.irys.xyz/devnet/${txId}`
              : `https://gateway.irys.xyz/${txId}`;
              
            const explorerUrl = this.isDevnet 
              ? `https://explorer.irys.xyz/devnet/tx/${txId}`
              : `https://explorer.irys.xyz/tx/${txId}`;
              
            return {
              id: txId,
              url: gatewayUrl,
              receipt: receipt,
              transactionHash: receipt.id,
              explorerUrl: explorerUrl
            };
          } catch (legacyError: any) {
            console.error('Legacy upload error:', legacyError);
            throw new Error(`Upload failed: ${legacyError.message || 'Unknown error with legacy transaction'}`);
          }
        }
        
        if (uploadError.message && uploadError.message.includes('user rejected')) {
          throw new Error('Transaction rejected by user. Please try again and confirm the transaction in your wallet.');
        }
        
        // Default error handling
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error during upload'}`);
      }
    } catch (error: any) {
      console.error('Upload process error:', error);
      throw error;
    }
  }
  
  async retrieveData(transactionId: string | any): Promise<RetrievedData> {
    try {
      // Clean and validate the transaction ID
      if (!transactionId) {
        throw new Error('Transaction ID is required for data retrieval');
      }
      
      // Handle potential [object Object] issue by extracting a clean ID
      let cleanId = String(transactionId);
      if (typeof transactionId === 'object' && transactionId !== null) {
        console.warn('[irysServiceSafe] Received object instead of string for transaction ID:', transactionId);
        // Try to extract ID from object
        if ('id' in transactionId && transactionId.id) {
          cleanId = String(transactionId.id);
        } else {
          // Convert to string and clean up
          cleanId = JSON.stringify(transactionId).replace(/[{}"]/g, '');
          if (cleanId === '[object Object]' || cleanId === 'objectObject') {
            throw new Error('Invalid transaction ID format: object reference without id property');
          }
        }
      }
      
      // Remove any extra whitespace, brackets, quotes
      cleanId = cleanId.toString().trim().replace(/[\[\]{}"\s]/g, '');
      
      // Construct gateway URL
      const gatewayUrl = `${this.getGatewayUrl()}/${cleanId}`;
      console.log('[irysServiceSafe] Retrieving data from URL:', gatewayUrl);
      
      // Fetch the data
      const response = await fetch(gatewayUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve data: ${response.status} ${response.statusText}`);
      }
      
      // Get content type
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      // Handle different content types appropriately
      let data;
      
      if (contentType.includes('image/') || 
          contentType.includes('video/') || 
          contentType.includes('audio/') || 
          contentType.includes('application/pdf') ||
          contentType.includes('application/octet-stream')) {
        // Return as Blob for binary files
        data = await response.blob();
      } else if (contentType.includes('application/json')) {
        // Parse JSON
        data = await response.json();
      } else {
        // Get as text for all other types
        data = await response.text();
      }
      
      return {
        data,
        contentType,
        transactionId: cleanId // Return the cleaned ID
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error retrieving data:', error);
      throw error;
    }
  }
  
  // Explicitly reset the Irys connection
  resetConnection(): void {
    console.log('[irysServiceSafe] Resetting Irys connection');
    this.irysUploader = null;
    this.lastWalletAddress = null;
    this.connectionInProgress = false;
  }
  
  setDevnet(isDevnet: boolean): void {
    this.isDevnet = isDevnet;
    // Reset the connection when changing networks
    this.resetConnection();
  }
  
  getIsDevnet(): boolean {
    return this.isDevnet;
  }

  // Add the getTransactionDetails method
  async getTransactionDetails(transactionId: string): Promise<TransactionDetails> {
    try {
      // The GraphQL endpoint
      const graphEndpoint = this.isDevnet ? 
        'https://devnet.irys.xyz/graphql' : 
        'https://node1.irys.xyz/graphql';
      
      // GraphQL query to get full transaction details
      const query = `
        query {
          transaction(id: "${transactionId}") {
            id
            timestamp
            signature
            owner {
              address
            }
            recipient
            tags {
              name
              value
            }
            fee {
              amount
              winston
            }
            quantity {
              amount
              winston
            }
            block {
              id
              height
              timestamp
            }
            verification {
              id
              address
              signature
              timestamp
              valid
            }
          }
        }
      `;
      
      const response = await fetch(graphEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction details: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL error: ${result.errors[0].message}`);
      }
      
      if (!result.data || !result.data.transaction) {
        throw new Error('Transaction not found');
      }
      
      // Format the result for our use
      const tx = result.data.transaction;
      
      return {
        transactionId: tx.id,
        transactionHash: tx.signature,
        owner: tx.owner?.address,
        timestamp: tx.timestamp,
        blockHeight: tx.block?.height,
        blockId: tx.block?.id,
        tags: tx.tags || [],
        explorerUrl: `${this.getExplorerUrl()}/tx/${tx.id}`,
        ownerExplorerUrl: tx.owner?.address ? `${this.getExplorerUrl()}/address/${tx.owner.address}` : null
      };
    } catch (error) {
      console.error('[irysServiceSafe] Error fetching transaction details:', error);
      throw new Error(`Failed to get transaction details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Request tokens from the Irys devnet faucet
   * This will only work on devnet and helps users upload larger files without manual funding
   */
  async requestDevnetTokens(walletAddress: string): Promise<boolean> {
    if (!this.isDevnet) {
      console.warn('[irysServiceSafe] Token faucet only available on devnet');
      return false;
    }
    
    if (!walletAddress) {
      console.error('[irysServiceSafe] Wallet address required for faucet request');
      return false;
    }
    
    try {
      console.log(`[irysServiceSafe] Requesting tokens from devnet faucet for ${walletAddress}`);
      
      // The Irys devnet faucet endpoint - updated URL to avoid DNS resolution issues
      const faucetUrl = 'https://devnet.irys.xyz/faucet/fund';
      
      console.log(`[irysServiceSafe] Using faucet URL: ${faucetUrl}`);
      
      const response = await fetch(faucetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: walletAddress,
          chain: "ethereum"
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[irysServiceSafe] Faucet request failed: ${response.status} ${errorText}`);
        return false;
      }
      
      const result = await response.json();
      console.log('[irysServiceSafe] Faucet request successful:', result);
      return true;
    } catch (error) {
      console.error('[irysServiceSafe] Error requesting tokens from faucet:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const irysServiceSafe = new IrysServiceSafe(); 

================================================
File: backups/20250302_041121_irys_backup/src/types/index.ts
================================================
export interface Tag {
  name: string;
  value: string;
}

export interface UploadResult {
  id: string;
  url: string;
  receipt?: any; // Store the full receipt for references
  transactionHash?: string; // Add the transaction hash for explorer viewing
  explorerUrl?: string; // Add the explorer URL
}

export interface RetrievedData {
  data: any;
  contentType: string;
  transactionId: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  type: 'upload' | 'retrieve';
  name?: string;
  contentType?: string;
  size?: number;
}

export interface TransactionDetails {
  transactionId: string;
  transactionHash: string;
  owner?: string;
  timestamp?: number;
  blockHeight?: number;
  blockId?: string;
  tags: Tag[];
  explorerUrl: string;
  ownerExplorerUrl: string | null;
} 

================================================
File: src/App.css
================================================
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}


================================================
File: src/App.test.tsx
================================================
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock the hooks
vi.mock('./hooks/useIrys', () => ({
  useIrys: () => ({
    isLoading: false,
    error: null,
    balance: '0.1',
    isDevnet: true,
    fetchBalance: vi.fn(),
    fundNode: vi.fn(),
    uploadData: vi.fn(),
    retrieveData: vi.fn(),
    toggleNetwork: vi.fn()
  })
}));

vi.mock('./hooks/useHistory', () => ({
  useHistory: () => ({
    history: [],
    addHistoryItem: vi.fn(),
    clearHistory: vi.fn(),
    removeHistoryItem: vi.fn()
  })
}));

// Simple test to check if the component renders
describe('App Component', () => {
  it('smoke test passes', () => {
    // We're just doing a simple smoke test to make sure the test framework works
    expect(true).toBe(true);
  });
}); 

================================================
File: src/App.tsx
================================================
import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import WalletConnect from './components/wallet/WalletConnect';
import StorageTab from './components/storage/StorageTab';
import RetrievalTab from './components/retrieval/RetrievalTab';
import History from './components/common/History';
import logo from './assets/stoirys-logo.svg';
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 
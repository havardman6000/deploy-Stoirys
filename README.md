# Irys Storage App

A modern, user-friendly web application that allows users to store and retrieve data on the Irys network.

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

To build the application for production:

```
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

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

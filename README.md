# Stoirys - Decentralized Storage App

Stoirys is a decentralized storage application built with React, TypeScript, Vite, and utilizing the Irys network for permanent, decentralized storage. The app allows users to connect their Ethereum wallet (on Sepolia testnet), upload files, and retrieve them later.

## Features

- Connect to MetaMask or other Ethereum wallets
- Fund your Irys balance using Sepolia ETH
- Upload files to Irys decentralized storage
- Download and manage uploaded files
- View transaction history
- Firebase integration for additional data management

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env.local` file and add your Firebase configuration

```
# Firebase Configuration
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
```

4. Start the development server: `npm run dev`

## Firebase Setup

To enable the Firebase functionality:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add a Web App to your Firebase project
3. Enable Firestore Database in your project
4. Create the following collections:
   - `users` - Stores user data
   - `folders` - Stores folder structure
   - `files` - Stores file metadata
5. Copy your Firebase configuration to the `.env.local` file

## Deploy

To build the app for production:

```
npm run build
```

This will create a production-ready build in the `dist` directory that can be deployed to any static site hosting service.

## Environment

The app is configured to work with the following:

- Ethereum Sepolia testnet
- Irys network
- Firebase (optional, falls back to local storage if not configured)

## Troubleshooting

- Make sure your wallet is connected to the Sepolia testnet
- Get Sepolia ETH from a faucet if you need test ETH
- Check that your Firebase configuration is correct
- Ensure you have the correct permissions set in Firebase Firestore rules

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Irys](https://irys.xyz) for providing the decentralized storage infrastructure
- [Vite](https://vitejs.dev) for the fast development environment
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework

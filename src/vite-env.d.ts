/// <reference types="vite/client" />

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_IRYS_DEVNET: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Allow for .png imports
declare module "*.png" {
  const value: any;
  export default value;
}

// Allow for .svg imports
declare module "*.svg" {
  const content: any;
  export default content;
}

// Allow for .jpg imports
declare module "*.jpg" {
  const value: any;
  export default value;
}

// Allow for .gif imports
declare module "*.gif" {
  const value: any;
  export default value;
}

// Allow for .json imports
declare module "*.json" {
  const value: any;
  export default value;
}

// Define a more permissive Provider interface
interface Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, callback: any) => void;
  removeListener?: (event: string, callback: any) => void;
  isMetaMask?: boolean;
  chainId?: string;
  selectedAddress?: string;
  _metamask?: any;
  [key: string]: any; // Allow any additional properties
}

interface Window {
  ethereum?: Provider;
  irysInstance?: any;
  navigateToAboutStoirys?: () => void;
  setActiveTab?: (tab: string) => void;
}

// Define environment variables
interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_IRYS_DEVNET_NODE: string;
  VITE_SEPOLIA_RPC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

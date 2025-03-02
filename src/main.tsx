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
    <BrowserRouter basename="/deploy-Stoirys">
      <IrysProvider>
        <App />
      </IrysProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

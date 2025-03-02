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
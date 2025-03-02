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
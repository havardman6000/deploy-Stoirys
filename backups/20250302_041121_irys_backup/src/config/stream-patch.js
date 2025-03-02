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
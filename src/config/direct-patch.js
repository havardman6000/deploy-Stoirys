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
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
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
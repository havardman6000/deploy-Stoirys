// This file provides a direct patch for the readable-stream module
// which is causing the "Cannot read properties of undefined (reading 'slice')" error

// Define the specific modules that are causing issues
if (typeof window !== 'undefined') {
  // Define the BufferList class used by _stream_writable
  class BufferList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    
    push(v) {
      const entry = { data: v, next: null };
      if (this.length > 0) this.tail.next = entry;
      else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
    
    unshift(v) {
      const entry = { data: v, next: this.head };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
    
    shift() {
      if (this.length === 0) return;
      const ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;
      else this.head = this.head.next;
      --this.length;
      return ret;
    }
    
    clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
    
    join(s) {
      if (this.length === 0) return '';
      let p = this.head;
      let ret = '' + p.data;
      while (p = p.next) ret += s + p.data;
      return ret;
    }
    
    concat(n) {
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
    }
  }
  
  // Define the WritableState constructor
  class WritableState {
    constructor(options, stream) {
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
      this.buffer = new BufferList();
    }
  }
  
  // Define the Writable class
  class Writable {
    constructor(options) {
      this._writableState = new WritableState(options, this);
      this.writable = true;
    }
    
    write(chunk, encoding, cb) {
      if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }
      
      if (cb) setTimeout(cb, 0);
      return true;
    }
    
    end(chunk, encoding, cb) {
      if (typeof chunk === 'function') {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }
      
      if (cb) setTimeout(cb, 0);
      return this;
    }
    
    on() { return this; }
    once() { return this; }
    emit() { return true; }
    removeListener() { return this; }
    removeAllListeners() { return this; }
    destroy() {}
  }
  
  // Define the ReadableState constructor
  class ReadableState {
    constructor(options, stream) {
      options = options || {};
      
      this.objectMode = Boolean(options.objectMode);
      this.highWaterMark = options.highWaterMark || 16 * 1024;
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || 'utf8';
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
    }
  }
  
  // Define the Readable class
  class Readable {
    constructor(options) {
      this._readableState = new ReadableState(options, this);
      this.readable = true;
    }
    
    read() { return null; }
    pipe() { return this; }
    on() { return this; }
    once() { return this; }
    emit() { return true; }
    removeListener() { return this; }
    removeAllListeners() { return this; }
    destroy() {}
    push() { return true; }
  }
  
  // Define the TransformState constructor
  class TransformState {
    constructor(options, stream) {
      this.afterTransform = function(er, data) {
        return afterTransform(stream, er, data);
      };
      
      this.needTransform = false;
      this.transforming = false;
      this.writecb = null;
      this.writechunk = null;
      this.writeencoding = null;
    }
  }
  
  function afterTransform(stream, er, data) {
    if (data != null) stream.push(data);
    if (stream._transformState.writecb) stream._transformState.writecb(er);
    return;
  }
  
  // Define the Transform class
  class Transform extends Writable {
    constructor(options) {
      super(options);
      this._transformState = new TransformState(options, this);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
    }
    
    _transform(chunk, encoding, cb) {
      cb(null, chunk);
    }
    
    push(chunk, encoding) {
      return true;
    }
  }
  
  // Expose the classes to the window
  window._stream_writable = {
    WritableState,
    Writable,
    BufferList,
    obj: function(val) {
      return val !== null && typeof val === 'object';
    }
  };
  
  window._stream_readable = {
    ReadableState,
    Readable,
    BufferList,
    obj: function(val) {
      return val !== null && typeof val === 'object';
    }
  };
  
  window._stream_transform = {
    TransformState,
    Transform,
    afterTransform,
    obj: function(val) {
      return val !== null && typeof val === 'object';
    }
  };
  
  // Also expose as modules for browserify
  window.require = window.require || function(name) {
    if (name === 'readable-stream/writable') return { Writable, WritableState };
    if (name === 'readable-stream/readable') return { Readable, ReadableState };
    if (name === 'readable-stream/transform') return { Transform, TransformState };
    if (name === 'readable-stream') return {
      Writable,
      Readable,
      Transform,
      Stream: Readable,
      Duplex: Transform
    };
    
    return null;
  };
} 
// Fix for process polyfill conflicts
// This file ensures process is available and writable, solving conflicts with React

// Since React and other libraries may try to directly set properties on process,
// we need to ensure it exists as a regular object, not a getter-only property

(function fixProcessPolyfill() {
  if (typeof window !== 'undefined') {
    // Create a backup of any existing process object
    const existingProcess = window.process || {};
    
    // Set up a proper process object that can be modified
    window.process = {
      ...(existingProcess || {}),
      env: {
        ...(existingProcess?.env || {})
      },
      browser: true,
      version: existingProcess?.version || 'v16.0.0'
    };

    // Ensure nextTick exists and is robust
    if (!window.process.nextTick) {
      window.process.nextTick = function nextTick(fn, ...args) {
        if (typeof fn !== 'function') {
          console.warn('process.nextTick called with non-function:', fn);
          return setTimeout(() => {}, 0);
        }
        try {
          return setTimeout(() => {
            try {
              fn.apply(this, args);
            } catch (err) {
              console.error('Error in process.nextTick callback:', err);
            }
          }, 0);
        } catch (err) {
          console.error('Error setting up nextTick:', err);
          return 0;
        }
      };
    }

    // Make sure global.process refers to window.process
    if (window.global) {
      window.global.process = window.process;
    }
  }
})(); 
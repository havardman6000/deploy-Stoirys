/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '360px',    // Mobile breakpoint (360x800)
        'sm': '640px',        // Default Tailwind sm
        'tablet': '768px',    // Tablet breakpoint (768x1024)
        'md': '768px',        // Default Tailwind md
        'lg': '1024px',       // Default Tailwind lg
        'xl': '1280px',       // Default Tailwind xl
        'desktop': '1920px',  // Desktop breakpoint (1920x1080)
        '2xl': '1536px',      // Default Tailwind 2xl
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      colors: {
        primary: '#0066FF', // Bright blue like in the image
        secondary: '#64748B', // Slate-500
        success: '#10B981', // Emerald-500
        danger: '#EF4444', // Red-500
        warning: '#F59E0B', // Amber-500
        info: '#3B82F6', // Blue-500
        background: '#F8FAFC', // Very light gray/blue background
        surface: '#FFFFFF',  // White surface/card color
        text: {
          primary: '#0F172A', // Slate-900 
          secondary: '#64748B', // Slate-500
          muted: '#94A3B8',   // Slate-400
        },
        border: {
          light: '#E2E8F0', // Slate-200
          DEFAULT: '#CBD5E1', // Slate-300
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
} 
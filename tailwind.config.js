/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3, dark scheme. Elevation is expressed by stepping up
        // through the tonal surface containers rather than by blur or glow.
        md: {
          surface: '#111318',
          'surface-dim': '#0e1014',
          'surface-bright': '#37393e',
          'surface-container-lowest': '#0c0e12',
          'surface-container-low': '#191c20',
          'surface-container': '#1d2024',
          'surface-container-high': '#282a2f',
          'surface-container-highest': '#33353a',

          'on-surface': '#e2e2e9',
          'on-surface-variant': '#c4c6d0',

          primary: '#a8c7fa',
          'on-primary': '#04305f',
          'primary-container': '#08427b',
          'on-primary-container': '#d3e3fd',

          secondary: '#7cacf8',
          'secondary-container': '#004a77',
          'on-secondary-container': '#c2e7ff',

          tertiary: '#d0bcff',
          'tertiary-container': '#4f378b',
          'on-tertiary-container': '#eaddff',

          outline: '#8e9099',
          'outline-variant': 'rgba(255, 255, 255, 0.12)',

          // Not part of the base MD3 roles, but a portfolio needs a "live" green
          // and an error tone for the copy-failed state.
          success: '#6dd58c',
          error: '#ffb4ab',
        },
      },
      fontFamily: {
        sans: [
          'Roboto',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      // MD3 emphasized easing and its decelerate / accelerate halves.
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        'emphasized-accelerate': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      },
      transitionDuration: {
        short: '150ms',
        medium: '250ms',
        long: '400ms',
      },
      // MD3 elevation levels 1-3 (key light + ambient), tuned for a dark surface.
      boxShadow: {
        'md-1': '0 1px 2px 0 rgba(0, 0, 0, 0.45), 0 1px 3px 1px rgba(0, 0, 0, 0.3)',
        'md-2': '0 1px 2px 0 rgba(0, 0, 0, 0.45), 0 2px 6px 2px rgba(0, 0, 0, 0.3)',
        'md-3': '0 1px 3px 0 rgba(0, 0, 0, 0.45), 0 4px 8px 3px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

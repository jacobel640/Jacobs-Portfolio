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
        canvas: {
          DEFAULT: '#030712',
          card: 'rgba(15, 23, 42, 0.65)',
          muted: '#0a0d14',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      backgroundImage: {
        'radial-glow-cyan': 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15), transparent 70%)',
        'radial-glow-indigo': 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 70%)',
        'radial-glow-purple': 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.12), transparent 70%)',
        'radial-glow-blue': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glass-gradient-hover': 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
      },
      boxShadow: {
        'glass-sm': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.65), inset 0 1px 2px 0 rgba(255, 255, 255, 0.12)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
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

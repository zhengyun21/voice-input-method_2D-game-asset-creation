/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Consolas", "'Courier New'", "monospace"],
        mono: ["Consolas", "'Courier New'", "monospace"],
      },
      colors: {
        surface: {
          0: '#0a0a0b',
          1: '#111113',
          2: '#18181b',
          3: '#1f1f23',
          4: '#27272b',
          5: '#303036',
        },
        edge: {
          DEFAULT: '#2a2a30',
          subtle: '#1f1f24',
          strong: '#3a3a42',
        },
        txt: {
          primary: '#e8e8ec',
          secondary: '#8e8e96',
          tertiary: '#5c5c64',
          inverse: '#0a0a0b',
        },
        amber: {
          DEFAULT: '#f59e0b',
          dim: '#b45309',
          bright: '#fbbf24',
          glow: 'rgba(245, 158, 11, 0.15)',
        },
        emerald: {
          DEFAULT: '#10b981',
          dim: '#047857',
        },
        rose: {
          DEFAULT: '#f43f5e',
          dim: '#be123c',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

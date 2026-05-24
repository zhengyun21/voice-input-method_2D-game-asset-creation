/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: '#09090b',
          base: '#131316',
          card: '#1a1a1f',
          elevated: '#222228',
          border: '#27272a',
          'border-subtle': '#1f1f23',
        },
        text: {
          primary: '#fafafa',
          secondary: '#71717a',
          muted: '#52525b',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
          muted: 'rgba(245, 158, 11, 0.15)',
          glow: 'rgba(245, 158, 11, 0.3)',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'wave-bar': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'dot-pulse': {
          '0%, 80%, 100%': { opacity: '0.2' },
          '40%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'wave-bar': 'wave-bar 1.2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'dot-pulse': 'dot-pulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        f1: {
          red: '#ef4444',
          'red-dark': '#dc2626',
          blue: '#3b82f6',
          orange: '#f59e0b',
          purple: '#a855f7',
        }
      },
      animation: {
        'fade-in-down': 'fadeInDown 1s ease forwards',
        'fade-in-up': 'fadeInUp 1s ease forwards',
        'pulse-bg': 'pulse 8s ease-in-out infinite',
        'scroll': 'scroll 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'blink': 'blink 2s ease-in-out infinite',
        'rotate-slow': 'rotate 3s linear infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { top: '8px', opacity: '1' },
          '100%': { top: '24px', opacity: '0' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}

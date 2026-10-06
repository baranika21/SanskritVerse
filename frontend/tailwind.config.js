/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sanskrit: {
          bg: '#0B0F19',
          card: 'rgba(17, 24, 39, 0.75)',
          gold: '#F59E0B',
          goldLight: '#FBBF24',
          goldDark: '#B45309',
          purple: '#1E1438',
          purpleLight: '#2D1B69',
          ivory: '#F8FAFC',
          muted: '#94A3B8',
          border: 'rgba(245, 158, 11, 0.25)',
          borderGlow: 'rgba(245, 158, 11, 0.5)'
        }
      },
      fontFamily: {
        sanskrit: ['"Noto Sans Devanagari"', 'Yatra One', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'gold-glow-lg': '0 0 40px -5px rgba(245, 158, 11, 0.45)',
        'purple-glow': '0 0 25px -5px rgba(139, 92, 246, 0.3)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}

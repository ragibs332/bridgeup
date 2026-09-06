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
        brand: {
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#0d5c5b', // Deep Teal Primary
            900: '#083e3d', // Deepest Teal
            950: '#042424',
          },
          mint: {
            50: '#f0fdf9',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#48c9b0', // Mint Accent
            500: '#2dd4bf',
            600: '#10b981',
            700: '#059669',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b', // Warm Amber
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          }
        }
      },
      boxShadow: {
        'glow-mint': '0 0 20px -3px rgba(72, 201, 176, 0.4)',
        'glow-teal': '0 0 20px -3px rgba(13, 92, 91, 0.5)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.4)',
        'card-soft': '0 10px 30px -5px rgba(13, 92, 91, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}

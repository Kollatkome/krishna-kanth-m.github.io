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
        canvas: '#000000',
        brand: {
          // ── Entire brand palette remapped to B&W greyscale ──────────────
          50:  '#ffffff',   // pure white  (was indigo-50)
          100: '#f5f5f5',   // near-white  (was indigo-100)
          200: '#e5e5e5',   // light grey  (was indigo-200)
          300: '#d4d4d4',   // medium-light grey (was indigo-300)
          400: '#a3a3a3',   // medium grey  (was indigo-400)
          500: '#737373',   // grey         (was electric indigo)
          600: '#525252',   // dark grey    (was indigo-600)
          700: '#404040',   // darker grey  (was indigo-700)
          800: '#262626',   // near-black   (was indigo-800)
          900: '#171717',   // very dark    (was indigo-900)
          violet:  '#ffffff',   // white (was Electric Violet #8b5cf6)
          cyan:    '#d4d4d4',   // light grey (was Cyber Cyan #06b6d4)
          emerald: '#a3a3a3',   // grey (was emerald #10b981)
          rose:    '#e5e5e5',   // light grey (was rose #f43f5e)
          amber:   '#d4d4d4',   // light grey (was amber #f59e0b)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'blob': 'blob 14s infinite cubic-bezier(0.4, 0, 0.2, 1)',
        'blob-slow': 'blob 20s infinite cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-subtle': 'pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(45px, -65px) scale(1.18)' },
          '66%': { transform: 'translate(-35px, 35px) scale(0.9)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ebf5ff',
          100: '#d1e5ff',
          200: '#a3caff',
          300: '#75afff',
          400: '#478fff',
          500: '#1d6fff',
          600: '#1455d4',
          700: '#0e41a3',
          800: '#072b70',
          900: '#03163b',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(56, 189, 248, 0.45)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at top, rgba(59,130,246,0.55), transparent 60%), radial-gradient(circle at bottom, rgba(14,165,233,0.45), transparent 55%)',
      },
    },
  },
  plugins: [],
}


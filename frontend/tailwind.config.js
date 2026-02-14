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
        /* Dentique theme – forest/cream/gold */
        primary: {
          50: '#f7f3ec',
          100: '#ede7db',
          200: '#e0d8cc',
          300: '#2f5e4a',
          400: '#244839',
          500: '#1a3328',
          600: '#1a3328',
          700: '#0f1f18',
          800: '#0f1f18',
          900: '#1a3328',
        },
        cream: {
          DEFAULT: '#f7f3ec',
          dark: '#ede7db',
          deeper: '#e0d8cc',
        },
        forest: {
          DEFAULT: '#1a3328',
          dark: '#0f1f18',
          mid: '#244839',
          light: '#2f5e4a',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}

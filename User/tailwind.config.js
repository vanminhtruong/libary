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
        gray: {
          700: '#2a2a2a',
          800: '#1a1a1a',
          900: '#000000',
        },
        blue: {
          500: '#0052cc',
          600: '#0046ad',
          700: '#003b99',
          800: '#003080',
          900: '#00205c',
        }
      }
    },
  },
  plugins: [],
} 
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        notoSans: ['Noto Sans', 'sans-serif'], // Add your font here
      },
      backgroundImage: {
        'light-clouds': `url('/src/assets/bg-light-clouds.webp')`,
        'dark-clouds': `url('/src/assets/bg-dark-clouds.webp')`,
      },
      colors: {
        primary: '#6C40B5',
        'primary-dark': '#28124D',
        'black-secondary': '#1A1A1A',
        'light-grey': '#666666',
      }
    },
  },
  plugins: [],
}


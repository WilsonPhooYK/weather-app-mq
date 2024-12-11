/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
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
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1E1E1E',      // Hitam Pekat
        'secondary-dark': '#1B263B',    // Biru Tua Gelap
        'accent': '#415A77',            // Biru Batu (Tombol)
        'text-light': '#E0E1DD',        // Krem Terang
        'text-dim': '#778DA9',          // Abu-abu Kebiruan
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}

module.exports = config

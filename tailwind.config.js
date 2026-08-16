/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#F4C430',
          green: '#00A86B',
          purple: '#6B2D8C',
        }
      }
    },
  },
  plugins: [],
}
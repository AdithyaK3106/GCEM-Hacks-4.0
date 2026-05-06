/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          primary: '#2D1E3E',
          secondary: '#5A4A6B',
          muted: '#8B7CA3',
          accent: '#6D4AFF',
          success: '#16A34A',
          bg: '#F5EFE6',
          sidebar: '#533A71',
        }
      }
    },
  },
  plugins: [],
}

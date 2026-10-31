/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // THIS LINE IS THE MOST COMMON FAILURE POINT
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
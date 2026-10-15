/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mit: {
          blue: "#0096e6",
          darkNavy: "#0c1b33",
          navy: "#0a2540",
          sky: "#0284c7",
          lightSky: "#38bdf8",
          gold: "#f59e0b",
          red: "#dc2626",
          green: "#16a34a",
          darkGreen: "#047857",
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

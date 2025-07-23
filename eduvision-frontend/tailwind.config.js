// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // If you have an index.html
    "./src/**/*.{js,jsx,ts,tsx}", // This line is CRUCIAL: it tells Tailwind to scan all your JS/JSX/TS/TSX files in the src folder
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Custom font family
      },
    },
  },
  plugins: [],
};
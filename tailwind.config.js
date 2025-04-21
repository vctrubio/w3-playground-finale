/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // darkMode setting removed as it's now defined in CSS
  theme: {
    extend: {
      // Removed animation and keyframes definitions as they're now in CSS
    },
  },
  plugins: [],
};

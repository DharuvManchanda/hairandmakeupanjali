/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#ffbd59",
        orange: "#f47e57",
        dark: "#1E1E1E",
        aquaGreen:'#4bf1b2',
        purple:'#4a40d9',
        luxury: {
          cream: "#FAF7F2",
          beige: "#F5EFE6",
          charcoal: "#2B2B2B",
          gold: "#C8A97E",
          blush: "#E8D7D1",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
      }
    },
  },
  plugins: [],
}

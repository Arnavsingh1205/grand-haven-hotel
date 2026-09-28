/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14231F",
        forest: "#22392F",
        forestlight: "#2F4F3E",
        brass: "#B08D57",
        brasslight: "#CBA86B",
        ivory: "#F6F1E7",
        stone: "#E7E1D3",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
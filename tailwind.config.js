/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/preset");

module.exports = {
  presets: [nativewind],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter_400Regular", "System"],
        "inter-medium": ["Inter_500Medium", "System"],
        "inter-bold": ["Inter_700Bold", "System"],
        sans: ["Inter_400Regular", "System"],
      },
    },
  },
  plugins: [],
};

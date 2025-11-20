/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        footer: "url('/src/assets/FooterImage.svg')",
      },
      colors: {
        purple100: "#CBCAE7",
        purple500: "#5955B3",
        purple200: "#B2B1DC",
        purple600: "#504DA3",
        purple700: "#3E3C7F",
        selectedState: "#8580F0",
        grey700: "#0D0D0D",
        grey500: "#121212",
        grey300: "#606060",
        grey200: "#929292",
        grey100: "#B6B6B6",
        grey50: "#EFEFEF",
        grey40: "#E7E7E7",
        grey30: "#757575",
        grey20: "#5855b3",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f7f3ec",
        ink: "#2d201d",
        cocoa: "#5b3931",
        rose: "#b77f75",
        burgundy: "#7a3938",
        gold: "#b18a55",
      },
      fontFamily: { sans: ["var(--font-arabic)", "sans-serif"], serif: ["var(--font-display)", "serif"] },
    },
  },
  plugins: [],
};

export default config;

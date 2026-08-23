import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#fff5f8",
          100: "#ffe4ee",
          200: "#ffc9dd",
          300: "#ffa3c4",
          400: "#ff7aa8",
          500: "#f4568c",
          600: "#e13d73",
          700: "#bc2c5c",
          800: "#992549",
          900: "#7a1d3d",
        },
      },
      fontFamily: {
        hand: ["var(--font-hand)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;

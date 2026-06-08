import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50: "#FAF6EC",
          100: "#F3E9CF",
          200: "#E8D29F",
          300: "#DCBB6F",
          400: "#D2A84D",
          500: "#C9973A",
          600: "#AC7F2E",
          700: "#876225",
          800: "#66491D",
          900: "#463213",
          950: "#2A1D0A",
        },
        luxe: {
          950: "#0B0B0D",
          900: "#101013",
          800: "#16161A",
          700: "#1E1E24",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.07)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;

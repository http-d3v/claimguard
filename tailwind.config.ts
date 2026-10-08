import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        glass: "rgba(255, 255, 255, 0.7)",
        "glass-dark": "rgba(30, 30, 40, 0.7)",
        primary: {
          light: "#EAE1FF",
          DEFAULT: "#B39DFF",
          dark: "#7A5FFF",
        },
        accent: {
          mint: "#A0E8AF",
          peach: "#FFC8A2",
          blue: "#AEE1FF",
        },
        error: "#FF8A8A",
        success: "#76E5B1",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "blob-float": "blob-float 20s infinite alternate",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        "blob-float": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandRed: "#111111",
        brandNavy: "#000000",
        appBg: "#F4F4F5",
        appSurface: "#FFFFFF",
        textPrimary: "#111111",
        textSecondary: "#52525B",
        appBorder: "#D4D4D8",
        successGreen: "#27272A",
        warningAmber: "#71717A"
      },
      fontFamily: {
        heading: ["DM Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        numeric: ["JetBrains Mono", "monospace"]
      },
      boxShadow: {
        card: "0 10px 24px rgba(20, 20, 20, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

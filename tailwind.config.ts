import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#F4EFEA",
          secondary: "#FFFFFF",
          tertiary: "#FAFAFA",
          text: "#383838",
          textSecondary: "#6B6B6B",
          textTertiary: "#999999",
          border: "#383838",
          borderSecondary: "#C4C4C4",
        },
        dark: {
          primary: "#1a1a1a",
          secondary: "#2a2a2a",
          tertiary: "#1f1f1f",
          text: "#ffffff",
          textSecondary: "#e0e0e0",
          textTertiary: "#999999",
          border: "#ffffff",
          borderSecondary: "#444444",
        },
        accent: {
          cyan: "#6FC2FF",
          cyanHover: "#2BA5FF",
          yellow: "#EAC435",
          coral: "#FF7169",
          teal: "#53DBC9",
          purple: "#667eea",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-secondary": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "gradient-accent": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-success": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        "gradient-info": "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
        "mesh-cool": "radial-gradient(at 40% 20%, #0078BF 0px, transparent 50%), radial-gradient(at 80% 0%, #3EECAC 0px, transparent 50%), radial-gradient(at 0% 50%, #6FC2FF 0px, transparent 50%), radial-gradient(at 80% 50%, #765395 0px, transparent 50%)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
        display: ["Unbounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "brutal-card": "-8px 8px 0 0 rgb(var(--shadow-color))",
        "brutal-button": "-4px 4px 0 0 rgb(var(--shadow-color))",
        "brutal-button-hover": "-6px 6px 0 0 rgb(var(--shadow-color))",
        "brutal-badge": "-3px 3px 0 0 rgb(var(--shadow-color))",
        "brutal-input-focus": "-5px 5px 0 0 #6FC2FF",
        "brutal-active": "-2px 2px 0 0 rgb(var(--shadow-color))",
        "brutal-hover": "-10px 10px 0 0 rgb(var(--shadow-color))",
        "brutal-sm": "-4px 4px 0 0 rgb(var(--shadow-color))",
      },
      borderWidth: {
        '5': '5px',
        '3': '3px',
      },
    },
  },
  plugins: [],
};

export default config;

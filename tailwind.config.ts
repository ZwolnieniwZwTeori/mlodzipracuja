import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F1E3",
        paper: "#FFFDF8",
        ink: "#16130E",
        "ink-soft": "#5B5544",
        // #8C8570 miało kontrast 3.27:1 na kremowym tle (za mało wg WCAG AA
        // dla małego tekstu) — przyciemnione do 5.23:1.
        "ink-faint": "#6B6450",
        moss: "#33502F",
        "moss-dark": "#233821",
        "moss-tint": "#E3E8D6",
        gold: "#C08A2E",
        "gold-tint": "#F3E3C1",
        line: "#DFD6BF",
        rust: "#A23E2E",
      },
      fontFamily: {
        display: ["Archivo", "system-ui", "sans-serif"],
        body: ["'Work Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "3px",
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;

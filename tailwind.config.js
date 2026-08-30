/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--color-paper-rgb) / <alpha-value>)",
        ink: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
        line: "rgb(var(--color-line-rgb) / <alpha-value>)",
        panel: "rgb(var(--color-panel-rgb) / <alpha-value>)",
        steel: "rgb(var(--color-steel-rgb) / <alpha-value>)",
        moss: "rgb(var(--color-moss-rgb) / <alpha-value>)",
        rust: "rgb(var(--color-rust-rgb) / <alpha-value>)",
        graph: "rgb(var(--color-graph-rgb) / <alpha-value>)"
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        soft: "0 16px 42px rgba(29, 28, 25, 0.08)"
      }
    }
  },
  plugins: []
};

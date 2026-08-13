/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f4ee",
        ink: "#1d1c19",
        muted: "#6d675f",
        line: "#d8d0c3",
        panel: "#fffdf8",
        steel: "#334155",
        moss: "#3f5d50",
        rust: "#8a4b33",
        graph: "#245c73"
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

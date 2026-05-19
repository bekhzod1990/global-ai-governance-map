import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          900: "#0F172A",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
        },
        canvas: {
          DEFAULT: "#F8FAFC",
          surface: "#FFFFFF",
          line: "#E2E8F0",
        },
        accent: {
          DEFAULT: "#1E40AF",
          soft: "#DBEAFE",
        },
        gold: {
          DEFAULT: "#B45309",
          soft: "#FEF3C7",
        },
        ratified: "#6D28D9",
        map: {
          empty: "#E5E7EB",
          guidance: "#BFDBFE",
          mixed: "#60A5FA",
          binding: "#1D4ED8",
        },
      },
      boxShadow: {
        panel: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        drawer:
          "-12px 0 32px -16px rgba(15, 23, 42, 0.16), 0 8px 20px -12px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
} satisfies Config;

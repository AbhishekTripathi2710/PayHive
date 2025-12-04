/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB", // main blue
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        sidebar: {
          bg: "#0F172A",
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        card: "0 10px 40px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
}


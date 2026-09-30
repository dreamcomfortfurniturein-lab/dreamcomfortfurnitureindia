/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#090E1A",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
        },
        gold: {
          DEFAULT: "#D97706",
          light: "#FDE68A",
          accent: "#EAB308",
          dark: "#B45309",
          shimmer: "#FBBF24",
        },
        teak: {
          DEFAULT: "#78350F",
          dark: "#451A03",
          light: "#92400E",
        },
        sand: {
          50: "#FAF9F6",
          100: "#F8FAFC",
          200: "#F1EDE4",
          300: "#E2D9C8",
        },
        walnut: "#2B1D14",
        linen: "#F1E8D9",
        cream: "#FAF6EF",
        brass: "#B08D57",
        sage: "#4A5D45",
        charcoal: "#24211D",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

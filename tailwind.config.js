/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1A3A2A",
          dark: "#111812",
          deep: "#0F261B",
          light: "#25533C",
          subtle: "#F0F5F2",
        },
        offwhite: {
          DEFAULT: "#FBFBFA",
          warm: "#F5F5F0",
          pure: "#FFFFFF",
          muted: "#EDECE8",
        },
        charcoal: {
          DEFAULT: "#111111",
          soft: "#222222",
          muted: "#555555",
          light: "#777777",
        },
        gold: {
          DEFAULT: "#D4AF37",
          warm: "#D4AF37",
          light: "#F7E7A9",
          accent: "#E5C058",
          dark: "#B38F24",
          shimmer: "#FBBF24",
        },
        brass: {
          DEFAULT: "#C5A059",
          dark: "#9E7B36",
          light: "#DFC387",
        },
        navy: {
          900: "#090E1A",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
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
        sage: "#4A5D45",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

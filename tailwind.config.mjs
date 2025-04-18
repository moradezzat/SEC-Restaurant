/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 Enable class strategy
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        slideInFromRight: 'slideInFromRight 0.3s ease forwards',
        slideOutFromLeft: 'slideOutFromLeft 0.3s ease forwards',
      },
      keyframes: {
        slideInFromRight: {
          '0%': { right: '-300px' },
          '100%': { right: '0px' },
        },
        slideOutFromLeft: {
          '0%': { right: '0px' },
          '100%': { right: '-300px' },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        playfair: ["var(--font-cairo)"],
      },
    },
  },
  plugins: [],
};
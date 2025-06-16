/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        slideInFromLeft: 'slideInFromLeft 0.3s ease forwards',
        slideOutFromRight: 'slideOutFromRight 0.3s ease forwards',
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
        slideInFromLeft: {
          '0%': { left: '-300px' },
          '100%': { left: '0px' },
        },
        slideOutFromRight: {
          '0%': { left: '0px' },
          '100%': { left: '-300px' },
        }
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        ruqaa: ["var(--font-ruqaa)"],
        rubik: ["var(--font-rubik)"],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.pause': {
          'animation-play-state': 'paused',
        },
      });
    },
  ],
};
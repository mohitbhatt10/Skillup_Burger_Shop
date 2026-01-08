/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(156, 0, 60)",
          dark: "rgb(126, 0, 48)",
        },
        dark: {
          DEFAULT: "rgb(33, 33, 33)",
          light: "rgba(33, 33, 33, 0.711)",
        },
        pink: {
          light: "rgb(255, 239, 239)",
        },
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

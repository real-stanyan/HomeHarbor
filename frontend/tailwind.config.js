/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        home_bg: "url('/images/home_bg.jpg')",
      },
    },
    fontFamily: {
      home_title: ["Workbench"],
      embed: ["Montserrat", "sans-serif"],
    },
  },
  plugins: [],
};

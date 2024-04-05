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
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".swiper": {
          width: "100vw",
          height: "400px",
        },
        ".swiper-slide": {
          textAlign: "center",
          fontSize: "18px",
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        ".swiper-slide img": {
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
      });
    },
  ],
};

const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend:{
      colors: {
        "primary-light": "#6666ff",
        "primary": "#3333ff",
        "secondary-light": "#f1f1f1"
      },
      fontFamily: {
        Domine: ['Domine, serif'],
        Poppins: ["Poppins, sans-serif"],
      },
      flex: {
        "1": "1 1 0%",
        "2": "2 2 0%"
      },
      container: {
        center: true,
        screens: {
          lg: "1124px",
          xl: "1124px",
          "2xl": "1124px"
        }
      }
    },
  },
  plugins: [],
}

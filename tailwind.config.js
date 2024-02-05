/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./view/**/*.templ"],
  important: true,
  theme: {
    extend: {
      textColor: {
        "primary": "#fff"
      },
      backgroundColor: {
        "primary": "#1b1e2b",
        "secondary": "#292d3e"
      }
    },
  },
  plugins: [],
}


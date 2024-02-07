/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./view/**/*.templ"],
  important: true,
  theme: {
    extend: {
      textColor: {
        "primary": "#fff",
        "editor": "#d5e2e6",
        "hover": "#DDA3B2"
      },
      backgroundColor: {
        "primary": "#1b1e2b",
        "secondary": "#292d3e"
      }
    },
  },
  plugins: [],
}


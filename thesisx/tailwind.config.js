/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:"class",
  theme: {
    colors:{
        transparent: 'transparent',
        current: 'currentColor',
        "white": 'hsl(0,0,90%)',
        "black": 'hsl(0,0,10%)',
        "themeColDark":"hsl(227,60%,45%)",
        "themeColLight":"hsl(227,60%,55%)"
    },
    extend: {},
  },
  plugins: [],
}


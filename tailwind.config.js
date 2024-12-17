const { nextui } = require('@nextui-org/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dark_bg_tailwind' : "url('./dark_bg_tailwind.png')",
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            // background: "#FFFFFF", // or DEFAULT
            // foreground: "#11181C", // or 50 to 900 DEFAULT
            secondary: "#FF4654",
            // primary: "#34445C",

            primary: "#34445C",
            foreground: "#34445C",
            // foreground: "rgb(33, 62, 105)",
            // primary: {
              //... 50 to 900
              // foreground: "#34445C",
              // DEFAULT: "#006FEE",
            // },
            // ... rest of the colors
          },
        },
        dark: {
          colors: {
            // background: "#000000", // or DEFAULT
            // foreground: "#ECEDEE", // or 50 to 900 DEFAULT
            secondary: "#FFC700",
            primary: "#DCFF37",
            // primary: {
              //... 50 to 900
              // foreground: "#DCFF37",
              // DEFAULT: "#006FEE",
            // },
          },
          // ... rest of the colors
        },
      },
    }),
  ],
}

module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "450px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1680px",
      },
      // colors: {
      //   // Font colors
      //   font1: "#191B21",
      //   font2: "#595F74",
      //   font3: "#99A4AE",

      //   // Element colors
      //   dark: "#18191C",
      //   line: "#D9DCE5",
      //   icon: "#979CA9",
      //   bgGrey: "#F5F5F9",

      //   // Standard colors
      //   yellow: "#FDB813",
      //   blue: "#02A4EC",
      //   green: "#5C9200",

      //   // Soft colors with 10% opacity
      //   softYellow: "rgba(253, 184, 19, 0.1)",
      //   softBlue: "rgba(2, 164, 236, 0.1)",
      //   softGreen: "rgba(92, 146, 0, 0.1)",
      // },
    },
  },
  plugins: [],
  safelist: [
    // {
    //   pattern: /^(bg|text|border)-(blue|yellow|green)$/,
    //   variants: ["hover", "focus"],
    // },
  ],
};

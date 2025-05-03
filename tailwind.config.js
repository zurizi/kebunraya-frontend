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
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^(bg|text|border)-(blue|yellow|green|red)-(500)$/,
      variants: ["hover", "focus"],
    },
  ],
};

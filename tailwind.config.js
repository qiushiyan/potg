/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,ts,tsx,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        "sans-serif": ["Raleway", "sans-serif"],
        handwritten: ["Delius Swash Caps", "cursive"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
};

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

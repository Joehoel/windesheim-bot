module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
     darkMode: 'class',
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

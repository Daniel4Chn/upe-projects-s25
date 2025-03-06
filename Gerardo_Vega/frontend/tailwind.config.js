/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spaceBlue: "#0a192f",
        neonBlue: "#00d8ff",
        softWhite: "#f8f8f8",
      },
    },
  },
  plugins: [],
};

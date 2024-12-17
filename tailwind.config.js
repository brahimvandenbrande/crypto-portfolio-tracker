/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'notion-bg': '#fbfbfa',
        'notion-border': '#e9e9e8',
        'notion-text': '#37352f',
        'notion-text-light': '#787774',
      },
    },
  },
  plugins: [],
}
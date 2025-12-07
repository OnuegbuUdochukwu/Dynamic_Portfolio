/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1B3A2A',
        olive: '#6C8A53',
        gold: '#CBA135',
        sand: '#E7E3D9',
        stone: '#7A7054',
        clay: '#A23B33',
        ash: '#9B978A',
        sage: '#A9B58A',
        charcoal: '#0E0E0C',
        'soft-charcoal': '#1A1A18',
        'warm-white': '#F5F1EA',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        primary: {
          DEFAULT: '#1B3FA0',   // Sanyog brand royal blue
          light:   '#3b82f6',
          dark:    '#142d73',
          50:      '#eef2ff',
          100:     '#e0e7ff',
        },
        brand: {
          green:       '#22A547',  // Sanyog brand green
          'green-dark':'#187a35',
          'green-50':  '#f0fdf4',
          blue:        '#1B3FA0',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(-8px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};

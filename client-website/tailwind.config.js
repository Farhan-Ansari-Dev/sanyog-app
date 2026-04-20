/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        lightBg: '#F8FAFC',
        lightCard: '#FFFFFF',
        lightBorder: '#E2E8F0',
        darkBg: '#1E293B',
        darkCard: '#263445',
        darkBorder: '#334155',
        primary: {
          light: '#22C55E',
          DEFAULT: '#16A34A',
          dark: '#15803D',
        },
        textMainLight: '#0F172A',
        textSubLight: '#475569',
        textMainDark: '#E2E8F0',
        textSubDark: '#94A3B8',
        success: '#16A34A',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      borderRadius: {
        'xl': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

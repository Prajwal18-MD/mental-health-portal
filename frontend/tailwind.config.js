// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: 'hsl(265, 60%, 25%)',
          800: 'hsl(265, 58%, 30%)',
          700: 'hsl(265, 55%, 35%)',
          600: 'hsl(265, 52%, 45%)',
          500: 'hsl(268, 50%, 55%)',
          400: 'hsl(270, 55%, 65%)',
          300: 'hsl(272, 60%, 75%)',
        },
        accent: {
          600: 'hsl(38, 85%, 50%)',
          500: 'hsl(40, 85%, 55%)',
          400: 'hsl(42, 90%, 60%)',
          300: 'hsl(45, 100%, 70%)',
        }
      },
      boxShadow: {
        soft: '0 6px 18px rgba(20, 20, 40, 0.08)',
        medium: '0 10px 30px rgba(20, 20, 40, 0.12)',
        large: '0 15px 50px rgba(20, 20, 40, 0.15)',
        glow: '0 0 30px rgba(133, 64, 157, 0.3)',
        'glow-accent': '0 0 30px rgba(238, 167, 39, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        gradient: 'gradientMove 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(133, 64, 157, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(133, 64, 157, 0.6)' },
        },
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}

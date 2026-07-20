/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F4D',
          deep: '#071633',
          light: '#13285E',
        },
        royal: '#1E5EFF',
        accent: '#2F80ED',
        mist: '#F8FAFC',
        slatesoft: '#5B6B8C',
        gold: '#FBBF24',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(11, 31, 77, 0.10)',
        card: '0 8px 30px -8px rgba(11, 31, 77, 0.16)',
        'card-lg': '0 20px 50px -12px rgba(11, 31, 77, 0.25)',
        'glow-lg': '0 8px 30px -6px rgba(30, 94, 255, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        blink: 'blink 1s step-start infinite',
        marquee: 'marquee 28s linear infinite',
      },
      maxWidth: {
        '8xl': '1440px',
      },
    },
  },
  plugins: [],
}

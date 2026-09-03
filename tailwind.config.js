/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Outfit'", "'Archivo Black'", 'Impact', 'sans-serif'],
        body: ["'Space Grotesk'", 'Outfit', 'sans-serif'],
        mono: ["'JetBrains Mono'", "'Space Mono'", 'monospace'],
      },
      colors: {
        ink: '#000000',
        paper: '#FFFFFF',
        panel: '#F4F4F4',
        divider: '#E5E5E5',
        'dark-bg': '#1A1A1A',
        'dark-panel': '#2A2A2A',
        'dark-divider': '#3A3A3A',
      },
      boxShadow: {
        brutal: '5px 5px 0px #000000',
        'brutal-lg': '7px 7px 0px #000000',
        'brutal-sm': '2px 2px 0px #000000',
        'brutal-dark': '5px 5px 0px #FFFFFF',
        'brutal-dark-lg': '7px 7px 0px #FFFFFF',
        'brutal-dark-sm': '2px 2px 0px #FFFFFF',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'dash-flow': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        pulse_opacity: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        press: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(4px, 4px)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'pulse-opacity': 'pulse_opacity 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

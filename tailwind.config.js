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
        body:    ["'Space Grotesk'", 'Outfit', 'sans-serif'],
        mono:    ["'JetBrains Mono'", "'Space Mono'", 'monospace'],
        sans:    ["'Space Grotesk'", 'Outfit', 'sans-serif'],
      },
      colors: {
        // NaviGO Brand
        'navigo-yellow':       '#F4B400',
        'navigo-yellow-hover': '#D9A100',
        'navigo-yellow-light': '#FEF3C7',
        'navigo-green':        '#087F45',
        'navigo-green-hover':  '#066034',
        'navigo-green-light':  '#D1FAE5',
        // Neutrals
        ink:           '#000000',
        paper:         '#FFFFFF',
        panel:         '#F7F5F0',
        divider:       '#E5E7EB',
        'dark-bg':     '#0A0A0A',
        'dark-panel':  '#141414',
        'dark-divider':'#2A2A2A',
        // Legacy accents
        'accent-blue':   '#3157FF',
        'accent-red':    '#FF4757',
        'accent-yellow': '#FFA502',
        'accent-green':  '#2ED573',
        'accent-purple': '#747DFF',
        'accent-cyan':   '#00D9FF',
      },
      boxShadow: {
        brutal:         '5px 5px 0px #000000',
        'brutal-lg':    '7px 7px 0px #000000',
        'brutal-sm':    '2px 2px 0px #000000',
        'brutal-dark':  '5px 5px 0px #FFFFFF',
        'brutal-dark-lg':'7px 7px 0px #FFFFFF',
        'navigo':       '4px 4px 0px #000000',
        'navigo-lg':    '7px 7px 0px #000000',
        'navigo-hover': '6px 6px 0px #000000',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'dash-flow': {
          '0%':   { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
        'pulse-opacity': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
        'page-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'overlay-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
      animation: {
        marquee:         'marquee 30s linear infinite',
        'pulse-opacity': 'pulse-opacity 1.5s ease-in-out infinite',
        'page-in':       'page-in 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'modal-in':      'modal-in 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'overlay-in':    'overlay-in 200ms ease forwards',
        'slide-in-left': 'slide-in-left 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

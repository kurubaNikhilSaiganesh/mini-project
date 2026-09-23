/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Outfit'", "'Space Grotesk'", 'sans-serif'],
        body:    ["'Space Grotesk'", 'Outfit', 'sans-serif'],
        mono:    ["'JetBrains Mono'", "'Space Mono'", 'monospace'],
        sans:    ["'Space Grotesk'", 'Outfit', 'sans-serif'],
      },

      colors: {
        // ALTS Brand (same palette, new names)
        gold:              '#F4B400',
        'gold-hover':      '#D9A100',
        'gold-light':      'rgba(244, 180, 0, 0.12)',
        'alts-green':      '#087F45',
        'alts-green-hover':'#066034',
        'alts-blue':       '#3B82F6',

        // Legacy NaviGO compat
        'navigo-yellow':       '#F4B400',
        'navigo-yellow-hover': '#D9A100',
        'navigo-yellow-light': 'rgba(244, 180, 0, 0.12)',
        'navigo-green':        '#087F45',

        // Neutrals
        'bg-base':    '#F0EDE6',
        'bg-surface': '#FAFAF8',
        'dark-bg':    '#0C0C0F',
        'dark-surface':'#131318',
      },

      borderRadius: {
        xs:   '12px',
        sm:   '20px',
        md:   '28px',
        lg:   '36px',
        xl:   '48px',
        '2xl':'64px',
        full: '9999px',
      },

      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },

      boxShadow: {
        glass:   '0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        'glass-dark': '0 2px 12px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)',
        gold:    '0 4px 24px rgba(244, 180, 0, 0.20)',
        'gold-lg':'0 6px 36px rgba(244, 180, 0, 0.30)',
      },

      keyframes: {
        'page-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.93) translateY(12px)' },
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
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'dash-flow': {
          '0%':   { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
        'skeleton-shimmer': {
          '0%':   { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'alts-reveal': {
          from: { opacity: '0', transform: 'translateY(20px)', filter: 'blur(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'alts-letter': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        'page-in':        'page-in 450ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'modal-in':       'modal-in 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'overlay-in':     'overlay-in 200ms ease forwards',
        'slide-in-left':  'slide-in-left 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up':       'slide-up 350ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        marquee:          'marquee 35s linear infinite',
        float:            'float 4s ease-in-out infinite',
        'alts-reveal':    'alts-reveal 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'alts-letter':    'alts-letter 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer:          'skeleton-shimmer 1.5s ease infinite',
      },

      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'in-expo':   'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
      },
    },
  },
  plugins: [],
}

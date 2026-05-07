/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0c0c0e',
        surface: '#161618',
        surface2: '#1e1e22',
        border: '#2a2a30',
        purple: '#7C3AED',
        'purple-lt': '#9D5FF5',
        'purple-dim': '#3b1f6e',
        yellow: '#D4A843',
        'yellow-lt': '#F0C060',
        text: '#F0EEF8',
        muted: '#7a7890',
        muted2: '#4a4860',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        fab: '0 4px 12px rgba(124,58,237,0.4)',
        'fab-lg': '0 6px 20px rgba(124,58,237,0.5)',
        card: '0 2px 8px rgba(0,0,0,0.3)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '20%': { transform: 'scale(1.5)' },
          '60%': { transform: 'scale(0.9)' },
          '80%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        waveAnim: {
          from: { transform: 'scaleY(0.4)', opacity: '0.6' },
          to: { transform: 'scaleY(1)', opacity: '1' },
        },
        livePulse: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        ringPulse: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.3s ease both',
        'fade-in': 'fadeIn 0.2s ease both',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.32,0.72,0,1)',
        'heart-pop': 'heartPop 0.38s cubic-bezier(0.175,0.885,0.32,1.275)',
        wave: 'waveAnim 0.8s ease-in-out infinite alternate',
        live: 'livePulse 1.4s ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
        'ring-pulse': 'ringPulse 1.2s ease-out infinite',
        refresh: 'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}

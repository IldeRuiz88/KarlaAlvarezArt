/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#121212',
        terracota: '#B85D36',
        'terracota-dark': '#8F4526',
        hueso: '#F5F2EB',
        paper: '#FBF9F5',
        grafito: '#1C1C1C',
        line: '#E3DED3',
        muted: '#6B6B67',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
}

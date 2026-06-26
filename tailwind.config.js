/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 20px 55px rgba(15, 23, 42, 0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(14, 165, 233, 0.16), transparent 30%), radial-gradient(circle at 20% 25%, rgba(79, 70, 229, 0.14), transparent 28%)',
      },
      colors: {
        night: '#0f172a',
        sky: '#e0f2fe',
        surface: '#111827',
      },
    },
  },
  plugins: [],
};

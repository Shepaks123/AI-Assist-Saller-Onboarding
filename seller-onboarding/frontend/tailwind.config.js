/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#F2F0FF', 100: '#E6E2FF', 200: '#CFC8FF', 300: '#B0A4FF', 400: '#8C79FA',
          500: '#6E56F0', 600: '#5A3FE0', 700: '#4A31C2', 800: '#3C2A9C', 900: '#2B1F73',
        },
        ink: { 900: '#17142E', 700: '#3A3658', 500: '#6B6888', 400: '#8E8BA8' },
        surface: '#F5F5FA',
        line: '#E7E6F0',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23,20,46,0.04), 0 8px 24px -8px rgba(23,20,46,0.08)',
        lift: '0 2px 4px rgba(23,20,46,0.05), 0 16px 40px -12px rgba(90,63,224,0.25)',
      },
      borderRadius: { card: '1.25rem' },
    },
  },
  plugins: [],
};

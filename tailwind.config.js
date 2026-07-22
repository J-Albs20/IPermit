/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F4F8',
        card: '#FFFFFF',
        indigo: {
          DEFAULT: '#4F46E5',
          light: '#EEF0FF',
        },
        ink: '#1F2430',
        muted: '#8A8FA3',
        line: '#ECEDF3',
        green: {
          DEFAULT: '#16A34A',
          bg: '#E7F7EC',
        },
        yellow: {
          DEFAULT: '#D97706',
          bg: '#FEF6E7',
        },
        red: {
          DEFAULT: '#E11D48',
          bg: '#FDECEF',
        },
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
};

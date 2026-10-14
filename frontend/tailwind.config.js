/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ncg: {
          blue: '#064B7A',
          'blue-dark': '#062F4A',
          'blue-deep': '#031B2A',
          green: '#8BCB2A',
          'green-dark': '#6CA51A',
          'green-light': '#A8D94A',
          text: '#163247',
          muted: '#6D7E89',
          'muted-light': '#A8BBC5',
          light: '#F5F9FB',
          'light-gray': '#EDF2F5',
          success: '#8BCB2A',
          info: '#3498DB',
          warning: '#F39C12',
          danger: '#E74C3C',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
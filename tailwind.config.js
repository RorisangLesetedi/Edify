/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0078ff',
          dark: '#0057b8',
        },
        secondary: {
          light: '#f8f9fa',
          DEFAULT: '#e9ecef',
          dark: '#dee2e6',
        },
        blue: {
          50: '#ebeeff',
          600: '#203eff',
        },
        purple: {
          600: '#8e36e5',
          700: '#7c2dd1',
        },
        gray: {
          600: '#6d6387',
          800: '#111116',
        },
      },
    },
  },
  plugins: [],
};
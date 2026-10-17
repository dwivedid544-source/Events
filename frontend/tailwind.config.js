/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede4',
          200: '#c3dcc9',
          300: '#99c2a3',
          400: '#6aa378',
          500: '#468557',
          600: '#346b44',
          700: '#2a5538',
          800: '#1b3022', // Primary Heritage Deep Forest Green
          900: '#061b0e', // Primary Dark Accent
          950: '#041209'
        },
        tan: {
          50: '#fdfbf7',
          100: '#f7f1e7',
          200: '#eedfcb',
          300: '#e1c7a6',
          400: '#d2ab7e',
          500: '#c19a6b', // Secondary Highland Tan
          600: '#ab7f53',
          700: '#8e6341',
          800: '#745037',
          900: '#5f422e'
        },
        surface: {
          DEFAULT: '#FCF9F8',
          dim: '#DCD9D9',
          bright: '#FCF9F8',
          lowest: '#FFFFFF',
          low: '#F6F3F2',
          container: '#F0EDED',
          high: '#EAE7E7',
          highest: '#E4E2E1',
          border: '#E5E5E1'
        },
        charcoal: {
          DEFAULT: '#1B1C1C',
          muted: '#434843',
          light: '#737973'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'ambient': '0px 4px 20px rgba(27, 48, 34, 0.08)',
        'ambient-lg': '0px 8px 30px rgba(27, 48, 34, 0.12)',
      }
    },
  },
  plugins: [],
}

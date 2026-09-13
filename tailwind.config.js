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
        bg: {
          app: '#F6F8FB',
          subtle: '#F1F4F8',
        },
        surface: {
          1: '#FFFFFF',
          2: '#FAFBFC',
          elevated: '#FFFFFF',
        },
        border: {
          subtle: '#E7EBF0',
          default: '#DCE2EA',
          strong: '#C8D0DB',
        },
        text: {
          primary: '#182230',
          secondary: '#475467',
          tertiary: '#667085',
          disabled: '#98A2B3',
        },
        brand: {
          50: '#F3F2FF',
          100: '#E9E7FF',
          200: '#D7D3FF',
          500: '#6865D8',
          600: '#5753C8',
          700: '#4743AE',
        },
        teal: {
          50: '#EFFAF8',
          500: '#39978E',
          600: '#2E7F78',
        },
        success: {
          50: '#EEF9F4',
          600: '#218769',
        },
        warning: {
          50: '#FFF8EB',
          600: '#B7791F',
        },
        danger: {
          50: '#FFF3F2',
          600: '#C9524F',
        },
        info: {
          50: '#EFF6FF',
          600: '#3478C8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16, 24, 40, 0.04)',
        sm: '0 2px 8px rgba(16, 24, 40, 0.06)',
        md: '0 8px 24px rgba(16, 24, 40, 0.08)',
        lg: '0 20px 50px rgba(16, 24, 40, 0.10)',
      },
      borderRadius: {
        card: '16px',
        panel: '18px',
      }
    },
  },
  plugins: [],
};

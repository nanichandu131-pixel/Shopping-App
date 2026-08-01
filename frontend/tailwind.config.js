export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#101828',
        mint: '#18A999',
        coral: '#FF6B5F',
        saffron: '#F5A524'
      },
      boxShadow: {
        soft: '0 24px 80px rgba(16, 24, 40, 0.14)'
      }
    }
  },
  plugins: []
};

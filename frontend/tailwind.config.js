/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调 - 温暖珊瑚色
        primary: {
          DEFAULT: '#FF6B6B',
          light: '#FF8585',
          dark: '#E85555',
          50: '#FFF5F5',
          100: '#FFE8E8',
          200: '#FFD4D4',
          300: '#FFB4A2',
          400: '#FFA07A',
          500: '#FF6B6B',
          600: '#E85555',
          700: '#CC4444',
        },
        // 辅助色
        secondary: {
          mint: '#20C997',
          lavender: '#9775FA',
          amber: '#F59F00',
          cream: '#FFF8F0',
        },
        // 中性色 - 暖灰色系
        neutral: {
          charcoal: '#2D3436',
          warm: '#636E72',
          light: '#B2BEC3',
          cream: '#FAFAFA',
        },
        // 状态色
        success: {
          light: '#D3FAE8',
          DEFAULT: '#20C997',
          dark: '#12B886',
        },
        warning: {
          light: '#FFF3E0',
          DEFAULT: '#FFA07A',
          dark: '#E88860',
        },
        danger: {
          light: '#FFE8E8',
          DEFAULT: '#FF6B6B',
          dark: '#E85555',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 10px 20px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'glow': '0 4px 20px rgba(255, 107, 107, 0.25)',
        'glow-mint': '0 4px 20px rgba(32, 201, 151, 0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FFF8F0 0%, #FFE8E8 100%)',
      },
      // 深色模式背景色
      backgroundColor: {
        'dark-base': '#1C1816',
        'dark-card': '#252220',
        'dark-input': '#2D2A27',
        'dark-hover': '#3A3532',
        'dark-accent': '#322A26',
      },
    },
  },
  plugins: [],
}

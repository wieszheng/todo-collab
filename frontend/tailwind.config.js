/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调
        primary: {
          DEFAULT: '#FF6B6B',  // 珊瑚橙
          light: '#FF8585',
          dark: '#E85555',
          50: '#FFF5F5',
          100: '#FFE8E8',
          200: '#FFD4D4',
          300: '#FFB4A2',  // 桃子粉
          400: '#FFA07A',  // 暖阳橙
          500: '#FF6B6B',
          600: '#E85555',
          700: '#CC4444',
        },
        // 辅助色
        secondary: {
          mint: '#4ECDC4',    // 薄荷绿
          lavender: '#A8DADC', // 薰衣草
          cream: '#FFF8F0',   // 奶油白
        },
        // 中性色
        neutral: {
          charcoal: '#2D3436',  // 深炭灰
          warm: '#636E72',      // 暖灰
          light: '#B2BEC3',     // 浅灰
          cream: '#FAFAFA',     // 米白
        },
        // 状态色
        success: {
          light: '#E0F7F5',
          DEFAULT: '#4ECDC4',
          dark: '#3AB8B0',
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
        'glow-mint': '0 4px 20px rgba(78, 205, 196, 0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FFF8F0 0%, #FFE8E8 100%)',
      },
    },
  },
  plugins: [],
}

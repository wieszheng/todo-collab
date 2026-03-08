/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 温暖可爱的主色调
        primary: {
          50: '#fff5f7',
          100: '#ffe0e8',
          200: '#ffc6d7',
          300: '#ff9fba',
          400: '#ff6b9d',
          500: '#ff4785',  // 主色 - 珊瑚粉
          600: '#e6306c',
          700: '#c41f55',
          800: '#a31848',
          900: '#88143e',
        },
        // 科技感辅助色
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',  // 科技紫
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // 温暖中性色
        warm: {
          50: '#fefefe',
          100: '#fdf8f6',
          200: '#f9f0eb',
          300: '#f3e5dc',
          400: '#e8d5c4',
          500: '#d4bba3',
        },
        // 状态色
        success: {
          light: '#d1fae5',
          DEFAULT: '#34d399',
          dark: '#059669',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#fbbf24',
          dark: '#d97706',
        },
        danger: {
          light: '#fee2e2',
          DEFAULT: '#f87171',
          dark: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        display: ['Inter', 'PingFang SC', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(255, 71, 133, 0.3)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff4785 0%, #8b5cf6 100%)',
        'gradient-soft': 'linear-gradient(135deg, #fff5f7 0%, #f5f3ff 100%)',
        'gradient-card': 'linear-gradient(180deg, #ffffff 0%, #fdf8f6 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}

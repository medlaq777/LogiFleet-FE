/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Dark Blue & Blue
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',  // Main Primary
          700: '#1D4ED8',  // Darker Primary
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },

        // Dark Blue Shades (for backgrounds)
        darkBlue: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
          950: '#0B1E35',
        },

        // Semantic Colors
        success: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },

        error: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },

        warning: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },

        info: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },

        // Neutral Grays (refined for dark theme)
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
      },

      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',

        // Glow shadows
        'glow-primary': '0 0 24px rgba(37, 99, 235, 0.4)',
        'glow-primary-lg': '0 0 40px rgba(37, 99, 235, 0.5)',
        'glow-success': '0 0 24px rgba(34, 197, 94, 0.4)',
        'glow-error': '0 0 24px rgba(239, 68, 68, 0.4)',
        'glow-warning': '0 0 24px rgba(245, 158, 11, 0.4)',

        // Premium shadows
        'premium': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'premium-lg': '0 12px 48px rgba(0, 0, 0, 0.5)',
      },

      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        'gradient-dark': 'linear-gradient(145deg, #141824 0%, #1A1F2E 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.05) 0px, transparent 50%)',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 0.8s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      backdropBlur: {
        xs: '2px',
      },

      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}

const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          canvas: '#07080B',
          surface: '#10121B',
          elevated: '#161926',
          border: 'rgba(245, 158, 11, 0.15)',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FDE68A',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.35)',
          subtle: 'rgba(245, 158, 11, 0.12)',
        },
        dark: {
          bg: '#07080B',
          surface: '#10121B',
          card: 'rgba(16, 18, 27, 0.88)',
          border: 'rgba(245, 158, 11, 0.18)',
        },
        sunset: {
          DEFAULT: '#F59E0B',
          hover: '#fbbf24',
          glow: 'rgba(245, 158, 11, 0.45)',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.35), 0 0 40px rgba(245, 158, 11, 0.1)',
        'gold-subtle': '0 0 12px rgba(245, 158, 11, 0.2)',
        'gold-intense': '0 0 30px rgba(245, 158, 11, 0.5)',
        'neon-sunset': '0 0 20px rgba(245, 158, 11, 0.35), 0 0 40px rgba(245, 158, 11, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [nextui()],
};

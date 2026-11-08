import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#08070d',
          surface: '#12111a',
          card: 'rgba(18, 17, 26, 0.85)',
          border: 'rgba(255, 107, 43, 0.22)',
        },
        sunset: {
          DEFAULT: '#ff6b2b',
          hover: '#ff8147',
          glow: 'rgba(255, 107, 43, 0.6)',
        },
        cyber: {
          DEFAULT: '#e040fb',
          hover: '#ea65ff',
          glow: 'rgba(224, 64, 251, 0.6)',
        },
        gold: {
          DEFAULT: '#ffa726',
          hover: '#ffb74d',
          glow: 'rgba(255, 167, 38, 0.5)',
        },
      },
      boxShadow: {
        'neon-sunset': '0 0 25px rgba(255, 107, 43, 0.55)',
        'neon-cyber': '0 0 25px rgba(224, 64, 251, 0.55)',
        'neon-gold': '0 0 20px rgba(255, 167, 38, 0.5)',
        'neon-glow-lg': '0 0 45px rgba(255, 107, 43, 0.4), 0 0 70px rgba(224, 64, 251, 0.25)',
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
  plugins: [],
};
export default config;

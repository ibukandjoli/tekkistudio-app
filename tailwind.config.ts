// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tekki: {
          blue: '#0f4c81',
          orange: '#ff7f50',
          coral: '#ff7f50',
          white: '#F2F2F2',
          // Nouveaux backgrounds subtils
          'blue-50': '#f0f7ff',
          'blue-25': '#f8fbff',
          'orange-50': '#fff5f0',
          'cream': '#fdfbf7',
        },
        african: {
          // Palette inspirée de l'Afrique pour alternance
          sunset: '#e67e22',
          terracotta: '#d35400', 
          gold: '#f39c12',
          earth: '#8b4513',
          warm: '#fdf2e9',
          sand: '#f4f1ea',
          clay: '#cd853f'
        }
      },
      backgroundImage: {
        'african-gradient': 'linear-gradient(135deg, #fff5f0 0%, #fdf2e9 100%)',
        'earth-gradient': 'linear-gradient(135deg, #f8f6f3 0%, #f4f1ea 100%)',
        'warm-gradient': 'linear-gradient(135deg, #fefcfb 0%, #faf9f7 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #ff7f50 0%, #e67e22 50%, #d35400 100%)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Fraunces', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-fraunces)', 'Fraunces', 'serif'],
      },
      maxWidth: {
        '8xl': '1440px',
        '9xl': '1800px',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
}

export default config
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
          coral: '#ff7f50', // Ajout d'un alias "coral" pour "orange"
          white: '#F2F2F2'
        }
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
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
          orange: '#FF5C00',
          'orange-hover': '#E55200',
          'orange-deep': '#C94509',
          blue: '#0D1B2A',
          cream: '#FAF8F5',
          surface: '#F4F3F0',
          'surface-warm': '#FFF8F5',
          white: '#FFFFFF',
          green: '#1E8E5A',
          ink: '#241B14',
          'ink-soft': '#6B5F53',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        body: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        // Refonte homepage — tokens exacts du mockup tekkistudio-refonte.html
        'home-display': ['var(--font-instrument)', 'Instrument Sans', 'sans-serif'],
        'home-body': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'home-mono': ['var(--font-plex-mono)', 'IBM Plex Mono', 'monospace'],
      },
      maxWidth: {
        '8xl': '1440px',
        '9xl': '1800px',
      },
    },
  },
  plugins: [],
}

export default config

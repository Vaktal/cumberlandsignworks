/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      // Brand tokens — DRAFT. Lock with stakeholder before launch.
      // Recommendation: deep forest green primary + warm clay accent.
      // Cuts through a market saturated with red/blue/black sign shops.
      colors: {
        cumberland: {
          ink: '#111111',
          cream: '#FFFFFF',
          forest: '#111111',
          'forest-dark': '#000000',
          clay: '#111111',
          'clay-dark': '#000000',
          stone: '#6B7280',
          mist: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['Manrope Variable', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
      },
      maxWidth: {
        prose: '68ch',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.cumberland.ink'),
            a: { color: theme('colors.cumberland.forest') },
            'h1, h2, h3, h4': { color: theme('colors.cumberland.ink'), fontWeight: '700' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

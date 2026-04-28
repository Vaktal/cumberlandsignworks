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
          ink: '#1A1A1A',          // near-black for body text
          cream: '#FAF7F2',         // warm off-white background
          forest: '#1F4E3D',        // primary brand color (deep forest green)
          'forest-dark': '#163A2D', // hover / pressed
          clay: '#D97842',          // accent — warm CTA orange
          'clay-dark': '#B85F2D',   // hover for clay
          stone: '#6B7280',         // muted text
          mist: '#E8E4DC',          // subtle borders / dividers
        },
      },
      fontFamily: {
        // Pair: workmanlike sans + confident display.
        // Lock real fonts after stakeholder review (e.g. Manrope + Bebas Neue).
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Bebas Neue"', 'Inter', 'system-ui', 'sans-serif'],
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

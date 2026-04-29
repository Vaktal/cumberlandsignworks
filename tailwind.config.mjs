/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      // B&W rebrand — tokens intentionally collapsed to black/gray/white.
      // When client approves an accent color, update clay + clay-dark only.
      // forest/clay/ink all map to #111111 by design during this phase.
      colors: {
        cumberland: {
          ink:           '#111111', // near-black body text
          cream:         '#FFFFFF', // page background + text on dark
          forest:        '#111111', // primary brand (links, headings, dark sections)
          'forest-dark': '#000000', // hover/pressed state for forest
          clay:          '#111111', // accent role (CTAs, bullets) — swap here when accent locked
          'clay-dark':   '#000000', // hover/pressed state for clay
          stone:         '#6B7280', // secondary text + eyebrows on dark backgrounds
          mist:          '#E5E5E5', // light gray, body text on dark sections
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

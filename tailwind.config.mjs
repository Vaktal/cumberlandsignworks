/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      // "The Shop Floor" redesign — bold B&W editorial base + ONE accent.
      // ACCENT IS DECOUPLED: to change the accent later, edit only `clay`
      // (+ `clay-dark` hover) below, plus the --flare vars in global.css.
      // Everything orange (CTAs, halftone ink, focus, underlines) reads from these.
      colors: {
        cumberland: {
          ink:           '#0A0A0A', // near-black — backgrounds + body text
          cream:         '#FFFFFF', // pure white — text on dark, max-contrast moments
          paper:         '#F7F5F0', // warm off-white — primary page surface (paper stock)
          forest:        '#0A0A0A', // dark-section brand (kept near-black)
          'forest-dark': '#000000', // hover/pressed state for forest
          clay:          '#FF4D1C', // ACCENT (flare orange) — CTAs, bullets, highlights
          'clay-dark':   '#D63A0E', // hover/pressed state for accent
          stone:         '#6B7280', // secondary text + eyebrows on dark backgrounds
          mist:          '#E5E5E5', // light gray, body text on dark sections
          hairline:      '#2A2A2A', // grid rules / dividers on ink
        },
      },
      fontFamily: {
        sans: ['Manrope Variable', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
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

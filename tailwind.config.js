const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      maxWidth: {
        site: '1200px',
      },
      spacing: {
        page: '1.5rem',
        'page-wide': '2.5rem',
      },
      fontSize: {
        hero: ['clamp(2.35rem,4.6vw,4rem)', { lineHeight: '1.08', letterSpacing: '-0.035em' }],
        section: ['1.875rem', { lineHeight: '1.18', letterSpacing: '-0.03em' }],
        'section-wide': ['2.6rem', { lineHeight: '1.18', letterSpacing: '-0.03em' }],
        card: ['1.25rem', { lineHeight: '1.375', letterSpacing: '-0.025em' }],
        feature: ['1.5rem', { lineHeight: '1.375', letterSpacing: '-0.025em' }],
        detail: ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        signature: ['clamp(2.4rem,7vw,6rem)', { lineHeight: '1', letterSpacing: '-0.06em' }],
        eyebrow: ['0.625rem', { lineHeight: '1rem', letterSpacing: '0.18em' }],
        'eyebrow-wide': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.18em' }],
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        raised: 'rgb(var(--color-raised) / <alpha-value>)',
        tag: 'rgb(var(--color-tag) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--color-accent-ink) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      keyframes: {
        'spotify-bar': {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '20%': { transform: 'scaleY(0.9)' },
          '40%': { transform: 'scaleY(0.55)' },
          '60%': { transform: 'scaleY(1)' },
          '80%': { transform: 'scaleY(0.45)' },
        },
        'logo-progress': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'spotify-bar': 'spotify-bar 1s ease-in-out infinite',
        'logo-progress': 'logo-progress 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents, theme, config }) => {
      const fontSizes = config('theme.fontSize')

      function heading(size, weight = 'medium') {
        const [fontSize, metrics] = fontSizes[size]
        return {
          fontFamily: theme('fontFamily.serif'),
          fontWeight: theme(`fontWeight.${weight}`),
          fontSize,
          ...metrics,
          color: theme('colors.ink').replace('<alpha-value>', '1'),
        }
      }

      addBase({
        '@keyframes theme-reveal-right': {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
        '@keyframes theme-reveal-left': {
          from: { clipPath: 'inset(0 0 0 100%)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
        'html[data-theme-reveal]::view-transition': { pointerEvents: 'none' },
        'html[data-theme-reveal]::view-transition-group(root)': { animation: 'none' },
        'html[data-theme-reveal]::view-transition-old(root)': { animation: 'none', mixBlendMode: 'normal', zIndex: '1' },
        'html[data-theme-reveal]::view-transition-new(root)': { mixBlendMode: 'normal', zIndex: '2' },
        'html[data-theme-reveal="dark"]::view-transition-new(root)': { animation: 'theme-reveal-right 600ms cubic-bezier(0.65,0,0.35,1) both' },
        'html[data-theme-reveal="light"]::view-transition-new(root)': { animation: 'theme-reveal-left 600ms cubic-bezier(0.65,0,0.35,1) both' },
        'html[data-theme-fade], html[data-theme-fade] *': {
          transitionProperty: 'color, background-color, border-color, fill, stroke',
          transitionDuration: '300ms',
          transitionTimingFunction: 'ease',
        },
        '@media (prefers-reduced-motion: reduce)': {
          'html[data-theme-reveal]::view-transition-old(root), html[data-theme-reveal]::view-transition-new(root)': { animation: 'none' },
          'html[data-theme-fade], html[data-theme-fade] *': { transition: 'none' },
        },
      })

      addComponents({
        '.theme-dark': {
          colorScheme: 'dark',
          '--color-canvas': '17 18 16',
          '--color-surface': '25 27 23',
          '--color-raised': '36 39 31',
          '--color-tag': '36 39 31',
          '--color-ink': '231 229 228',
          '--color-muted': '168 162 158',
          '--color-subtle': '141 139 130',
          '--color-accent': '190 242 100',
          '--color-accent-ink': '17 18 16',
          '--color-danger': '252 165 165',
        },
        '.page-container': {
          marginInline: 'auto',
          width: '100%',
          maxWidth: theme('maxWidth.site'),
          paddingInline: theme('spacing.page'),
          '@screen sm': { paddingInline: theme('spacing.page-wide') },
        },
        '.interactive-link': {
          transitionProperty: 'color, opacity',
          transitionDuration: theme('transitionDuration.200'),
          transitionTimingFunction: theme('transitionTimingFunction.out'),
          '@media (prefers-reduced-motion: reduce)': { transitionProperty: 'none' },
        },
        '.heading-hero': heading('hero'),
        '.heading-section': {
          ...heading('section'),
          '@screen sm': heading('section-wide'),
        },
        '.heading-card': heading('card'),
        '.heading-feature': heading('feature'),
        '.heading-detail': heading('detail'),
        '.footer-signature': {
          ...heading('signature', 'semibold'),
          color: 'rgb(var(--color-ink) / 0.15)',
        },
        '.eyebrow': {
          fontFamily: theme('fontFamily.mono'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: fontSizes.eyebrow[0],
          ...fontSizes.eyebrow[1],
          textTransform: 'uppercase',
          color: theme('colors.accent').replace('<alpha-value>', '1'),
          '@screen sm': { fontSize: fontSizes['eyebrow-wide'][0] },
        },
      })
    }),
  ],
}

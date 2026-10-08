import type { Locale } from '@/i18n/routing'
import type { ReactNode } from 'react'
import { mono, sans, serif } from '@/styles/fonts'
import { ThemeScript } from '@/components/ui/theme/theme-script'

const scrollbarClasses = [
  '[scrollbar-gutter:stable] [scrollbar-width:thin]',
  '[scrollbar-color:rgb(var(--color-scroll-thumb))_rgb(var(--color-scroll-track))]',
  '[&_*]:[scrollbar-width:thin]',
  '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2',
  '[&_*::-webkit-scrollbar]:h-2 [&_*::-webkit-scrollbar]:w-2',
  '[&::-webkit-scrollbar-track]:bg-[rgb(var(--color-scroll-track))] [&_*::-webkit-scrollbar-track]:bg-[rgb(var(--color-scroll-track))]',
  '[&::-webkit-scrollbar-thumb]:bg-[rgb(var(--color-scroll-thumb))] [&_*::-webkit-scrollbar-thumb]:bg-[rgb(var(--color-scroll-thumb))]',
  '[&::-webkit-scrollbar-thumb:hover]:bg-[rgb(var(--color-scroll-hover))] [&_*::-webkit-scrollbar-thumb:hover]:bg-[rgb(var(--color-scroll-hover))]',
  '[&::-webkit-scrollbar-corner]:bg-[rgb(var(--color-scroll-track))] [&_*::-webkit-scrollbar-corner]:bg-[rgb(var(--color-scroll-track))]',
  'forced-colors:[scrollbar-color:auto] forced-colors:[&_*]:[scrollbar-color:auto]',
].join(' ')

const themeClasses = [
  '[color-scheme:light] data-[theme=dark]:[color-scheme:dark]',
  '[--color-canvas:232_231_224] data-[theme=dark]:[--color-canvas:17_18_16]',
  '[--color-surface:243_242_237] data-[theme=dark]:[--color-surface:25_27_23]',
  '[--color-raised:219_220_210] data-[theme=dark]:[--color-raised:36_39_31]',
  '[--color-tag:225_226_216] data-[theme=dark]:[--color-tag:36_39_31]',
  '[--color-ink:24_27_22] data-[theme=dark]:[--color-ink:231_229_228]',
  '[--color-muted:78_83_73] data-[theme=dark]:[--color-muted:168_162_158]',
  '[--color-subtle:103_108_96] data-[theme=dark]:[--color-subtle:141_139_130]',
  '[--color-accent:65_91_22] data-[theme=dark]:[--color-accent:190_242_100]',
  '[--color-accent-ink:250_252_244] data-[theme=dark]:[--color-accent-ink:17_18_16]',
  '[--color-danger:185_28_28] data-[theme=dark]:[--color-danger:252_165_165]',
  '[--color-scroll-thumb:156_156_156] data-[theme=dark]:[--color-scroll-thumb:92_92_92]',
  '[--color-scroll-hover:112_112_112] data-[theme=dark]:[--color-scroll-hover:142_142_142]',
  '[--color-scroll-track:236_236_236] data-[theme=dark]:[--color-scroll-track:20_20_20]',
  'bg-canvas font-sans text-ink antialiased selection:bg-accent selection:text-accent-ink',
  'scroll-smooth scroll-pt-6 motion-reduce:scroll-auto',
  '[&_:not(input):not(textarea):focus-visible]:outline [&_:not(input):not(textarea):focus-visible]:outline-2 [&_:not(input):not(textarea):focus-visible]:outline-accent [&_:not(input):not(textarea):focus-visible]:outline-offset-[5px]',
  'motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!animate-none',
].join(' ')

export function DocumentShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} ${serif.variable} ${themeClasses} ${scrollbarClasses}`}
      suppressHydrationWarning
    >
      <body id="top" className="relative isolate">
        <ThemeScript />
        {children}
      </body>
    </html>
  )
}

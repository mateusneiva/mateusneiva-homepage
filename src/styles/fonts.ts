import { IBM_Plex_Mono, Space_Grotesk, Lora } from 'next/font/google'

export const sans = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})

export const serif = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { clsx } from 'clsx'
import '@/styles/globals.css'

const IBMPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mateusneiva.com/'),
  title: 'Mateus Neiva - Homepage',
  description: 'Mateus Neiva - Homepage',
  authors: {
    name: 'Mateus Neiva',
  },
  icons: {
    shortcut: '/favicon.ico',
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    siteName: 'Mateus Neiva',
    title: 'Mateus Neiva',
    images: '/opengraph-image.png',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          IBMPlexMono.className,
          'bg-gray-900 fill-gray-400 text-gray-400'
        )}
      >
        {children}
      </body>
    </html>
  )
}

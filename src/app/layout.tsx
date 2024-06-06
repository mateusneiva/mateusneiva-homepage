import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { clsx } from 'clsx'
import '@/styles/globals.css'

const IBMPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Mateus Neiva - Homepage',
  authors: [
    {
      name: 'Mateus Neiva',
    },
  ],
  description: 'Mateus Neiva - Homepage',
  openGraph: {
    type: 'website',
    title: 'Mateus Neiva',
    siteName: 'Mateus Neiva',
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

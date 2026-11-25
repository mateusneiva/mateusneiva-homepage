import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    qualities: [75, 95],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co', pathname: '/image/**' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/mateusneiva' },
    ],
  },
}

export default withNextIntl(nextConfig)

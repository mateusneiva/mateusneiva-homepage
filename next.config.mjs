import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  transpilePackages: ['three'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'i.scdn.co', pathname: '/image/**' }],
  },
}

export default withNextIntl(nextConfig)

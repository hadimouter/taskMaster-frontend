/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  poweredByHeader: false,
  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr',
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
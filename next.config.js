/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/assessment/result/:sessionId',
        destination: '/assessments/results/:sessionId',
        permanent: true,
      },
      {
        source: '/assessment/results/:sessionId',
        destination: '/assessments/results/:sessionId',
        permanent: true,
      },
      {
        source: '/assessments/result/:sessionId',
        destination: '/assessments/results/:sessionId',
        permanent: true,
      },
      {
        source: '/settings',
        destination: '/privacy',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

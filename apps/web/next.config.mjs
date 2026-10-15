const apiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL || 'http://127.0.0.1:4000').replace(/\/+$/, '');

const nextConfig = {
  transpilePackages: ['@tanstack/react-query'],
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

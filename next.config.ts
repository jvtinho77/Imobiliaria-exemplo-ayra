import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
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
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://*.freepik.com https://*.supabase.co; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.supabase.co;",
          },
        ],
      },
    ];
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lfmyirpckhhaftrbcixq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.freepik.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Compression
  compress: true,
  // React strict mode
  reactStrictMode: true,
  // Trailing slash
  trailingSlash: false,
  // Powered by header
  poweredByHeader: false,
};

export default nextConfig;

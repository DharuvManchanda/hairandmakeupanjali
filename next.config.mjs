/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/og-image.jpg",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "all", // Ensures all pages can be indexed
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      "instagram.fdel11-2.fna.fbcdn.net",
       "assets.aceternity.com",
       "scontent.cdninstagram.com",
       "images.unsplash.com",
      "content.cdninstagram.com",
      "scontent.cdninstagram.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

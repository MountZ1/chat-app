/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // middleware: './middleware.tsx',
    images: {
        domains: [
            'flowbite.com',
            'images.unsplash.com',
            'http://localhost:8080',
            'placehold.co'
        ],
        remotePatterns: [
            {
              protocol: 'http',
              hostname: 'localhost',
              port: '8080',
              pathname: '/assets/**',
            },
        ]
      },
};

export default nextConfig;

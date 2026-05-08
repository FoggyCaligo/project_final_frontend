/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],
  async rewrites() {
    return [
      {
        source: '/api/images/:path*',
        destination: 'http://43.201.1.45/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;

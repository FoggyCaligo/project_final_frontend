import { dirname } from "path";
import { fileURLToPath } from "url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "*.trycloudflare.com",
  ],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "/api/v1/:path*",
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const API_PROXY_TARGET =
  process.env.NEXT_PUBLIC_API_PROXY_TARGET || "http://localhost:8080";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },

  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

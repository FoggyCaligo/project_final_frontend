import { dirname } from "path";
import { fileURLToPath } from "url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   turbopack: {
//     root: projectRoot,
//   },
// };

  

const nextConfig = {
   allowedDevOrigins: [
    "smokiness-founding-verbalize.ngrok-free.dev",
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;

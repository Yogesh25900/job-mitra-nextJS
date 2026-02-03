import type { NextConfig } from "next";

const backendURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const isDEV = backendURL.startsWith("http://localhost");


const nextConfig: NextConfig = {
   experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    dangerouslyAllowLocalIP: isDEV,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
        pathname: "/profile_pictures/**",
      },
    ],
  },

};

export default nextConfig;

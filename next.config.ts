import type { NextConfig } from "next";

const backendURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const isDEV = backendURL.startsWith("http://localhost");

// Extract port from backend URL
const getBackendPort = (url: string): string => {
  const match = url.match(/:([0-9]+)$/);
  return match ? match[1] : "5050";
};

const backendPort = getBackendPort(backendURL);

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
        port: backendPort,
        pathname: "/public/profile_pictures/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: backendPort,
        pathname: "/profile_pictures/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: backendPort,
        pathname: "/logos/**",
      }
    ],
  },
};

export default nextConfig;

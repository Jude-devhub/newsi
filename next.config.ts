import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow ALL https hosts
      },
      {
        protocol: "http",
        hostname: "**", // allow ALL http hosts
      },
    ],
  },
};

export default nextConfig;

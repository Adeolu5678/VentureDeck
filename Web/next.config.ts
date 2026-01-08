import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Clerk user avatars
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      // Convex file storage
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
      // GitHub avatars (for social login)
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // Google user content (for social login)
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      // Gravatar (common avatar service)
      {
        protocol: "https",
        hostname: "*.gravatar.com",
      },
    ],
  },
};

export default nextConfig;

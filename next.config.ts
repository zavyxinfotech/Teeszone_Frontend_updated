import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory confuses workspace-root inference.
  turbopack: { root: __dirname },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4010" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
      { protocol: "https", hostname: "teeszone-catalogue-images-2026.s3.ap-southeast-2.amazonaws.com" },
    ],
  },
  devIndicators: false,
};

export default nextConfig;

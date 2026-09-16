import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory confuses workspace-root inference.
  turbopack: { root: __dirname },
  images: {
    // Placeholder product images are local SVGs until real photos arrive.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Phase 2: admin-uploaded product photos land on S3 (remove SVG allowance
    // once all placeholders are replaced).
    remotePatterns: [{ protocol: "https", hostname: "**.amazonaws.com" }],
  },
  devIndicators: false,
};

export default nextConfig;

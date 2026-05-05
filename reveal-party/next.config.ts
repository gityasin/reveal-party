import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/reveal-party",
  assetPrefix: "/reveal-party/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

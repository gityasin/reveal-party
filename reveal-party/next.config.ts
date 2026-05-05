import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  ...(isProd
    ? {
        basePath: "/reveal-party",
        assetPrefix: "/reveal-party/",
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

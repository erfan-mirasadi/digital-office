import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@theatre/core", "@theatre/studio", "@theatre/r3f"],
};

export default nextConfig;

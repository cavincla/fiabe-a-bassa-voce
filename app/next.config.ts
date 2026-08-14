import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the docker "dist" image (see
  // .build/dockerfiles/Dockerfile): only the node_modules actually used
  // at runtime get copied, instead of the full dependency tree.
  output: "standalone",
};

// Serwist patches the webpack config to bundle the service worker, and
// doesn't support Turbopack yet (Next.js 16's default bundler) — hence
// `--webpack` on the dev/build scripts in package.json. Drop that flag
// once https://github.com/serwist/serwist/issues/54 lands.
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);

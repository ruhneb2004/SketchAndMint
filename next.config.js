// /Users/benhurbenny/hobbyProjects/svgCreator/thing/next.config.js

/** @type {import('next').NextConfig} */ // Optional: This JSDoc provides type checking in IDEs
const nextConfig = {
  /* config options here */
  transpilePackages: [
    "roughjs",
    "path-data-parser", // Add this
    "points-on-curve",
    "points-on-path",
  ],
};

module.exports = nextConfig; // Use CommonJS export syntax

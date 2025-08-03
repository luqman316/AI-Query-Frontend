/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  webpack: (config) => {
    config.resolve.extensions.push(".jsx", ".js");
    return config;
  },
  images: {
    domains: ["workoscdn.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "workoscdn.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      // yahan aur bhi domains add kar sakte hain
    ],
  },
};

export default nextConfig;

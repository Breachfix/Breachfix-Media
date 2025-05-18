/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "image.tmdb.org",
      "d3rotgd7sghdsb.cloudfront.net",
      "bridgefixdb.s3.us-east-1.amazonaws.com", // ✅ Correctly added here
    ],
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  
};

module.exports = nextConfig;
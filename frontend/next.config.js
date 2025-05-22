/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "image.tmdb.org",
      "d3rotgd7sghdsb.cloudfront.net",
      "bridgefixdb.s3.us-east-1.amazonaws.com",
    ],
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://image.tmdb.org https://d3rotgd7sghdsb.cloudfront.net https://bridgefixdb.s3.us-east-1.amazonaws.com;
              font-src 'self' https://fonts.gstatic.com;
              connect-src *;
            `.replace(/\n/g, "").trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
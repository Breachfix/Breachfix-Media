// next.config.js
const nextConfig = {
  images: {
    domains: [
      "image.tmdb.org",
      "d3rotgd7sghdsb.cloudfront.net",
      "bridgefixdb.s3.us-east-1.amazonaws.com",
      "firebasestorage.googleapis.com", // ✅ added
    ],
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
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://image.tmdb.org https://d3rotgd7sghdsb.cloudfront.net https://bridgefixdb.s3.us-east-1.amazonaws.com https://firebasestorage.googleapis.com;
              connect-src 'self' http://localhost:7001 https://breachfixdb.onrender.com https://adventhub.onrender.com https://breachfix.com https://www.breachfix.com https://breachfix.ca https://www.breachfix.ca;
            `.replace(/\n/g, ""), // removes line breaks
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
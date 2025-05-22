// next.config.prod.js
const nextProdConfig = {
  images: {
    domains: [
      "image.tmdb.org",
      "d3rotgd7sghdsb.cloudfront.net",
      "bridgefixdb.s3.us-east-1.amazonaws.com",
      "firebasestorage.googleapis.com",
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
              default-src 'self' data: blob: *;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *;
              style-src 'self' 'unsafe-inline' data: blob: *;
              img-src 'self' data: blob: https://image.tmdb.org https://d3rotgd7sghdsb.cloudfront.net https://bridgefixdb.s3.us-east-1.amazonaws.com https://firebasestorage.googleapis.com;
              font-src 'self' data: blob:;
              connect-src 'self' https://breachfixdb.onrender.com https://adventhub.onrender.com https://breachfix.com https://www.breachfix.com https://breachfix.ca https://www.breachfix.ca;
              frame-src *;
              media-src *;
              object-src *;
            `.replace(/\n/g, "").trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextProdConfig;
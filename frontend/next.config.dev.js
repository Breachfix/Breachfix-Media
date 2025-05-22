// next.config.dev.js
const nextDevConfig = {
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
              default-src * data: blob:;
              script-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
              style-src * 'unsafe-inline' * data:;
              img-src * data: blob:;
              font-src * data:;
              connect-src * http://localhost:7001 http://localhost:3000 https://breachfixdb.onrender.com https://adventhub.onrender.com https://breachfix.com https://www.breachfix.com https://breachfix.ca https://www.breachfix.ca;
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

module.exports = nextDevConfig;
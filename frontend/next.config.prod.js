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
  default-src * data: blob:;
  script-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
  style-src * 'unsafe-inline' data: blob:;
  img-src * data: blob:;
  font-src * data: blob:;
  connect-src *;
  frame-src *;
  media-src *;
  object-src *;
`.replace(/\n/g, "").trim()
          },
        ],
      },
    ];
  },
};

module.exports = nextProdConfig;
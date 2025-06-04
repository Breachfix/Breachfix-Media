const nextDevConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d3rotgd7sghdsb.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bridgefixdb.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
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
default-src 'self' https:;
script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
style-src 'self' 'unsafe-inline' https:;
img-src 'self' data: https: blob:;
font-src 'self' https:;
connect-src 'self' https: blob: http://localhost:7001 https://api.breachfix.com https://adventhub.onrender.com https://d3rotgd7sghdsb.cloudfront.net https://bridgefixdb.s3.us-east-1.amazonaws.com;
media-src 'self' https://d3rotgd7sghdsb.cloudfront.net https://bridgefixdb.s3.us-east-1.amazonaws.com blob:;
frame-src *;
object-src 'none';
`.replace(/\n/g, "").trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextDevConfig;
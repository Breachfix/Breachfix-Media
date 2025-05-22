"use strict";

/** @type {import('next').NextConfig} */
var nextConfig = {
  images: {
    domains: ["image.tmdb.org", "d3rotgd7sghdsb.cloudfront.net", "bridgefixdb.s3.us-east-1.amazonaws.com"]
  },
  webpack: function webpack(config) {
    config.cache = false;
    return config;
  },
  headers: function headers() {
    return regeneratorRuntime.async(function headers$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", [{
              source: "/(.*)",
              headers: [{
                key: "Content-Security-Policy",
                value: "\n              default-src 'self';\n              script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules';\n              style-src 'self' 'unsafe-inline';\n              img-src 'self' data: https://image.tmdb.org https://d3rotgd7sghdsb.cloudfront.net https://bridgefixdb.s3.us-east-1.amazonaws.com;\n              font-src 'self' https://fonts.gstatic.com;\n              connect-src 'self' https://breachfixdb.onrender.com https://adventhub.onrender.com https://breachfix.com https://www.breachfix.com https://breachfix.ca https://www.breachfix.ca;\n              frame-src 'self';\n            ".replace(/\n/g, "").trim()
              }]
            }]);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};
module.exports = nextConfig;
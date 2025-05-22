"use strict";

// next.config.js
var nextConfig = {
  images: {
    domains: ["image.tmdb.org", "d3rotgd7sghdsb.cloudfront.net", "bridgefixdb.s3.us-east-1.amazonaws.com", "firebasestorage.googleapis.com" // ✅ added
    ]
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
                value: "\n              default-src 'self';\n              script-src 'self' 'unsafe-inline' 'unsafe-eval';\n              style-src 'self' 'unsafe-inline';\n              img-src 'self' data: https://image.tmdb.org https://d3rotgd7sghdsb.cloudfront.net https://bridgefixdb.s3.us-east-1.amazonaws.com https://firebasestorage.googleapis.com;\n              connect-src 'self' http://localhost:7001 https://breachfixdb.onrender.com https://adventhub.onrender.com https://breachfix.com https://www.breachfix.com https://breachfix.ca https://www.breachfix.ca;\n            ".replace(/\n/g, "") // removes line breaks

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
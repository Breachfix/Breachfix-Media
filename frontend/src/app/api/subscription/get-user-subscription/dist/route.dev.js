"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;

var _server = require("next/server");

var _index = _interopRequireDefault(require("@/database/index"));

var _MediaSubscription = _interopRequireDefault(require("@/models/MediaSubscription"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// /app/api/subscription/get-user-subscription/route.js
// <-- your mongoose connector
function GET(req) {
  var userId, subscription;
  return regeneratorRuntime.async(function GET$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _index["default"])());

        case 3:
          userId = req.headers.get("x-user-id");

          if (userId) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            success: false,
            message: "Missing user ID"
          }, {
            status: 400
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(_MediaSubscription["default"].findOne({
            userId: userId
          }));

        case 8:
          subscription = _context.sent;

          if (!(!subscription || !subscription.planName)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", _server.NextResponse.json({
            success: true,
            isActive: false,
            status: "none",
            planName: null
          }));

        case 11:
          if (process.env.NODE_ENV === "development") {
            console.log("📦 Subscription result:", subscription);
          }

          return _context.abrupt("return", new _server.NextResponse(JSON.stringify({
            success: true,
            isActive: subscription.status === "active",
            status: subscription.status,
            planName: subscription.planName
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Status": subscription.status || "none",
              "X-Debug-UserId": subscription.userId || userId || "unknown"
            }
          }));

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error("❌ Subscription fetch error:", _context.t0);
          return _context.abrupt("return", _server.NextResponse.json({
            success: false,
            message: "Server error"
          }, {
            status: 500
          }));

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}
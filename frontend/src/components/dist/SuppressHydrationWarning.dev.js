"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SuppressHydrationWarning;

var _react = require("react");

function SuppressHydrationWarning() {
  (0, _react.useEffect)(function () {
    var originalError = console.error;

    console.error = function () {
      var msg = arguments.length <= 0 ? undefined : arguments[0];

      if (typeof msg === "string" && msg.includes("hydrated but some attributes")) {
        return;
      }

      originalError.apply(void 0, arguments);
    };

    return function () {
      console.error = originalError;
    };
  }, []);
  return null;
}
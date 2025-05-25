"use strict";
// components/subscription/HandleCanceledParam.js
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = HandleCanceledParam;

var _react = require("react");

var _navigation = require("next/navigation");

function HandleCanceledParam(_ref) {
  var setCanceled = _ref.setCanceled;
  var searchParams = (0, _navigation.useSearchParams)();
  var router = (0, _navigation.useRouter)();
  (0, _react.useEffect)(function () {
    var isCanceled = searchParams.get("canceled") === "true";

    if (isCanceled) {
      setCanceled(true);
      setTimeout(function () {
        return router.replace("/subscribe");
      }, 3000);
    }
  }, []);
  return null;
}
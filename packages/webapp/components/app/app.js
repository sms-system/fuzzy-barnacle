"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_imported_component_1 = __importDefault(require("react-imported-component"));
var wouter_1 = require("wouter");
var routes_1 = __importDefault(require("../pages/routes"));
require("../base.styl");
var NotFound = react_imported_component_1["default"](function () { return Promise.resolve().then(function () { return __importStar(require('../pages/404/404')); }); });
function App() {
    return (react_1["default"].createElement(wouter_1.Switch, null, Object.keys(routes_1["default"]).map(function (route) { return (react_1["default"].createElement(wouter_1.Route, __assign({ key: route }, routes_1["default"][route]))); }).concat([
        react_1["default"].createElement(wouter_1.Route, { key: "404", path: "/:rest*" },
            react_1["default"].createElement(NotFound, null))
    ])));
}
exports["default"] = App;

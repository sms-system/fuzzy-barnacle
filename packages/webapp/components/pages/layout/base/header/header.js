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
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var header_1 = __importDefault(require("../../../../header/header"));
var logo_1 = __importDefault(require("../../../../logo/logo"));
var repo_select_1 = __importDefault(require("../repo-select"));
function BaseHeader(props) {
    var repo = react_redux_1.useSelector(function (_a) {
        var repo = _a.repo;
        return repo;
    });
    return (react_1["default"].createElement(header_1["default"], __assign({ elLogo: logo_1["default"], accent: true }, props), repo_select_1["default"]));
}
exports["default"] = BaseHeader;

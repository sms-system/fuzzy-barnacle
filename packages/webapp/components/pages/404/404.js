"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var layout_1 = __importDefault(require("../layout/base/layout"));
function NotFound() {
    return (react_1["default"].createElement(layout_1["default"], { breadcrumbs: [] },
        react_1["default"].createElement("div", { className: "Layout-Wrap" },
            react_1["default"].createElement("h1", null, "4[]4 Page Not Found :("))));
}
exports["default"] = NotFound;

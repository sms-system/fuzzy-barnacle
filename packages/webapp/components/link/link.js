"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
var wouter_1 = require("wouter");
require("./link.styl");
var cnLink = classname_1.cn('Link');
function default_1(props) {
    var children = props.children, href = props.href, _a = props.mods, mods = _a === void 0 ? {} : _a;
    return (react_1["default"].createElement(wouter_1.Link, { className: cnLink(mods), href: href }, children));
}
exports["default"] = default_1;

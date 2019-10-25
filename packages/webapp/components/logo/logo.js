"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
var svg_1 = __importDefault(require("../svg"));
//@ts-ignore
var logo_svg_1 = __importDefault(require("./logo.svg"));
var wouter_1 = require("wouter");
var cnLogo = classname_1.cn('Logo');
function Logo(props) {
    var className = props.className;
    return (react_1["default"].createElement("div", { className: cnLogo(null, [className]) },
        react_1["default"].createElement(wouter_1.Link, { href: "/" },
            react_1["default"].createElement(svg_1["default"], { icon: logo_svg_1["default"] }),
            " ")));
}
exports["default"] = Logo;

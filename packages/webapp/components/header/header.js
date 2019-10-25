"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
var element_1 = __importDefault(require("../element"));
require("./header.styl");
var cnHeader = classname_1.cn('Header');
function Header(props) {
    var className = props.className, wrapperClassName = props.wrapperClassName, accent = props.accent, elLogo = props.elLogo, children = props.children;
    return (react_1["default"].createElement("header", { className: cnHeader(null, [className]) },
        react_1["default"].createElement("div", { className: cnHeader('Content', [wrapperClassName]) },
            element_1["default"](elLogo, cnHeader('Logo')),
            element_1["default"](children, cnHeader('Item', { accent: accent })))));
}
exports["default"] = Header;

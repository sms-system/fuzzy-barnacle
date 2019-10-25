"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
var element_jsx_1 = __importDefault(require("../element.jsx"));
require("./icon-plus.styl");
var cnIconPlus = classname_1.cn('IconPlus');
function IconPlus(props) {
    var className = props.className, children = props.children, elIcon = props.elIcon;
    return (react_1["default"].createElement("div", { className: cnIconPlus(null, [className]) },
        element_jsx_1["default"](elIcon, cnIconPlus('Icon')),
        element_jsx_1["default"](children, cnIconPlus('Content'))));
}
exports["default"] = IconPlus;

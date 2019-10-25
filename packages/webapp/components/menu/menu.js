"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
var element_1 = __importDefault(require("../element"));
require("./menu.styl");
var cnMenu = classname_1.cn('Menu');
function Menu(props) {
    var className = props.className, children = props.children;
    return (react_1["default"].createElement("ul", { className: cnMenu(null, [className]) }, children.map(function (Child, i) {
        return react_1["default"].createElement("li", { className: cnMenu('Item'), key: i }, element_1["default"](Child, cnMenu('Link')));
    })));
}
exports["default"] = Menu;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
var element_1 = __importDefault(require("../element"));
require("./footer.styl");
var cnFooter = classname_1.cn('Footer');
function Footer(props) {
    var className = props.className, children = props.children, elInfo = props.elInfo;
    return (react_1["default"].createElement("div", { className: cnFooter(null, [className]) },
        element_1["default"](children, cnFooter('Main')),
        elInfo.map(function (Info, i) {
            return react_1["default"].createElement("div", { className: cnFooter('Info'), key: i }, Info);
        })));
}
exports["default"] = Footer;

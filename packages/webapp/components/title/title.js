"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
var element_jsx_1 = __importDefault(require("../element.jsx"));
require("./title.styl");
var cnTitle = classname_1.cn('Title');
function Title(props) {
    var className = props.className, children = props.children, elSuffix = props.elSuffix, elSubheader = props.elSubheader;
    return (react_1["default"].createElement("div", { className: cnTitle(null, [className]) },
        element_jsx_1["default"](children, cnTitle('Header')),
        element_jsx_1["default"](elSuffix, cnTitle('Header_suffix')),
        element_jsx_1["default"](elSubheader, cnTitle('Subheader'))));
}
exports["default"] = Title;

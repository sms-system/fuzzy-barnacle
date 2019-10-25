"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var classname_1 = require("@bem-react/classname");
var element_jsx_1 = __importDefault(require("../element.jsx"));
require("./dropdown.styl");
var cnDropdown = classname_1.cn('Dropdown');
function Dropdown(props) {
    var className = props.className, currentItemText = props.currentItemText, children = props.children;
    var _a = react_1.useState(false), isOpenned = _a[0], setOpenned = _a[1];
    function handleFocus() {
        isOpenned ? setTimeout(function () { return setOpenned(false); }, 200) : setOpenned(true);
    }
    return (react_1["default"].createElement("div", { className: [cnDropdown(null, [className]), cnDropdown({ 'is-openned': isOpenned })].join(' '), tabIndex: 0, onFocus: handleFocus, onBlur: handleFocus },
        react_1["default"].createElement("div", { className: cnDropdown('Current') },
            react_1["default"].createElement("span", null, currentItemText)),
        element_jsx_1["default"](children, cnDropdown('Content'))));
}
exports["default"] = Dropdown;

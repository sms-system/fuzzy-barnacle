"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var wouter_1 = require("wouter");
var classname_1 = require("@bem-react/classname");
require("./tabs.styl");
var cnTabs = classname_1.cn('Tabs');
function Tabs(props) {
    var className = props.className, _a = props.items, items = _a === void 0 ? [] : _a;
    return !!items.length ? (react_1["default"].createElement("nav", { className: cnTabs(null, [className]) }, items.map(function (_a, i) {
        var title = _a.title, url = _a.url, isActive = _a.isActive;
        return react_1["default"].createElement(react_1.Fragment, { key: i }, isActive ?
            react_1["default"].createElement("div", { className: cnTabs('Tab', { active: true }) }, title) :
            react_1["default"].createElement(wouter_1.Link, { href: url, className: cnTabs('Tab') }, title));
    }))) : react_1["default"].createElement(react_1["default"].Fragment, null);
}
exports["default"] = Tabs;

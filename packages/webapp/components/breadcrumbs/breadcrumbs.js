"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var wouter_1 = require("wouter");
var classname_1 = require("@bem-react/classname");
require("./breadcrumbs.styl");
var cnBreadcrumbs = classname_1.cn('Breadcrumbs');
function Breadcrumbs(props) {
    var className = props.className, _a = props.items, items = _a === void 0 ? [] : _a;
    return !!items.length ? (react_1["default"].createElement("ul", { className: cnBreadcrumbs(null, [className]) }, items.map(function (_a, i) {
        var title = _a.title, url = _a.url;
        return react_1["default"].createElement("li", { className: cnBreadcrumbs('Item'), key: i }, i !== items.length - 1 ?
            react_1["default"].createElement(wouter_1.Link, { href: url, className: cnBreadcrumbs('Link') }, title) :
            react_1["default"].createElement("div", { className: cnBreadcrumbs('Link', { active: true }) }, title));
    }))) : react_1["default"].createElement(react_1["default"].Fragment, null);
}
exports["default"] = Breadcrumbs;

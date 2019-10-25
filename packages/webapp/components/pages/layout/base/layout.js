"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var header_1 = __importDefault(require("./header/header"));
var breadcrumbs_1 = __importDefault(require("../../../breadcrumbs/breadcrumbs"));
var title_1 = __importDefault(require("../../../title/title"));
var footer_1 = __importDefault(require("../../../footer/footer"));
function Layout(props) {
    var title = props.title, titleSuffix = props.titleSuffix, subtitle = props.subtitle, children = props.children, breadcrumbs = props.breadcrumbs;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(header_1["default"], { className: "Layout-Header", wrapperClassName: "Layout-Wrap" }),
        react_1["default"].createElement("div", { className: "Layout-Content" },
            react_1["default"].createElement("div", { className: "Layout-Wrap" },
                react_1["default"].createElement(breadcrumbs_1["default"], { items: breadcrumbs })),
            title && react_1["default"].createElement("div", { className: "Layout-Wrap" },
                react_1["default"].createElement(title_1["default"], { elSuffix: titleSuffix, elSubheader: subtitle },
                    title,
                    "\u00A0")),
            children),
        react_1["default"].createElement(footer_1["default"], { className: "Layout-Footer", elInfo: [
                react_1["default"].createElement(react_1["default"].Fragment, null, "UI: 0.1.15"),
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    "\u00A9 2007\u20142019 ",
                    react_1["default"].createElement("a", { href: "#" }, "Yandex"))
            ] }, "Trade secrets of Yandex LLC. 16, Lev Tolstoy Str., Moscow, Russia, 119021")));
}
exports["default"] = Layout;

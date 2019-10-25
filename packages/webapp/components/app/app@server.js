"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var wouter_1 = require("wouter");
var static_location_1 = __importDefault(require("wouter/static-location"));
var store_1 = __importDefault(require("../../store"));
var app_1 = __importDefault(require("./app"));
function App(props) {
    var url = props.url, state = props.state;
    return (react_1["default"].createElement(react_redux_1.Provider, { store: store_1["default"](state) },
        react_1["default"].createElement(wouter_1.Router, { hook: static_location_1["default"](url) },
            react_1["default"].createElement("html", { lang: "ru" },
                react_1["default"].createElement("head", null,
                    react_1["default"].createElement("meta", { charSet: "UTF-8" }),
                    react_1["default"].createElement("title", null, "Title"),
                    react_1["default"].createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" })),
                react_1["default"].createElement("body", null,
                    react_1["default"].createElement("div", { id: "app", className: "Layout Typography" },
                        react_1["default"].createElement(app_1["default"], null)))))));
}
exports["default"] = App;

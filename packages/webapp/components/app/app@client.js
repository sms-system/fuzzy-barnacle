"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var wouter_1 = require("wouter");
var react_redux_1 = require("react-redux");
var store_1 = __importDefault(require("../../store"));
var app_1 = __importDefault(require("./app"));
function App(props) {
    return (react_1["default"].createElement(react_redux_1.Provider, { store: store_1["default"](props.state) },
        react_1["default"].createElement(wouter_1.Router, null,
            react_1["default"].createElement(app_1["default"], null))));
}
exports["default"] = App;

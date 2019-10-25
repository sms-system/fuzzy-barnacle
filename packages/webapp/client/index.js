"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_imported_component_1 = require("react-imported-component");
var react_dom_1 = require("react-dom");
var app_client_1 = __importDefault(require("../components/app/app@client"));
if (process.env.NODE_ENV === 'production') {
    require('../generated/imports');
}
var element = document.getElementById('app');
document.addEventListener('DOMContentLoaded', function () {
    if (process.env.NODE_ENV === 'production') {
        var state_1 = window.__PRELOADED_STATE__;
        react_imported_component_1.rehydrateMarks().then(function () { react_dom_1.hydrate(react_1["default"].createElement(app_client_1["default"], { state: state_1 }), element); });
    }
    else {
        var getState = require('../store/get-state-for-url')["default"];
        getState(window.location.pathname).then(function (state) { return react_dom_1.render(react_1["default"].createElement(app_client_1["default"], { state: state }), element); });
    }
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var redux_1 = require("redux");
var logOnlyInProduction_1 = require("redux-devtools-extension/logOnlyInProduction");
var reducer_1 = __importDefault(require("./reducer"));
function default_1(state) {
    return redux_1.createStore(reducer_1["default"], state, logOnlyInProduction_1.devToolsEnhancer());
}
exports["default"] = default_1;

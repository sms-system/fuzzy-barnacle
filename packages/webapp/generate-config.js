"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var config_1 = __importDefault(require("./config"));
var API_URL = config_1["default"].get('api').url;
console.log(JSON.stringify({
    API_URL: API_URL
}));

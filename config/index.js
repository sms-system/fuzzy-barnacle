"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var convict_1 = __importDefault(require("convict"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var path_1 = __importDefault(require("path"));
var schema_1 = __importDefault(require("./schema"));
convict_1["default"].addParser({ extension: ['yml', 'yaml'], parse: js_yaml_1["default"].safeLoad });
var config = convict_1["default"](__assign({ env: {
        doc: 'The application environment',
        format: ['production', 'development', 'test'],
        "default": 'production',
        env: 'NODE_ENV'
    } }, schema_1["default"]));
try {
    config.loadFile(path_1["default"].resolve(__dirname, 'env', config.get('env') + ".yaml"));
}
catch (e) {
}
exports["default"] = config;

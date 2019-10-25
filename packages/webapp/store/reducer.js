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
var types_1 = __importDefault(require("./types"));
function default_1(state, action) {
    switch (action.type) {
        case types_1["default"].SET_FILE_LIST:
            return __assign(__assign({}, state), { fileList: action.payload });
        case types_1["default"].SET_REPO_LIST:
            return __assign(__assign({}, state), { repoList: action.payload });
        case types_1["default"].SET_REPO_POS:
            return __assign(__assign({}, state), { repo: action.payload.repo, branch: action.payload.branch, path: action.payload.path });
        default:
            return state;
    }
}
exports["default"] = default_1;

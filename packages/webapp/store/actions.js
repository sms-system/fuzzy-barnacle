"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var types_1 = __importDefault(require("./types"));
function setRepoList(data) {
    return {
        type: types_1["default"].SET_REPO_LIST,
        payload: data
    };
}
exports.setRepoList = setRepoList;
function setFileList(data) {
    return {
        type: types_1["default"].SET_FILE_LIST,
        payload: data
    };
}
exports.setFileList = setFileList;
function setRepoPos(data) {
    return {
        type: types_1["default"].SET_REPO_POS,
        payload: data
    };
}
exports.setRepoPos = setRepoPos;

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
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var wouter_1 = require("wouter");
var dropdown_1 = __importDefault(require("../../../dropdown/dropdown"));
var menu_1 = __importDefault(require("../../../menu/menu"));
function RepoSelect(props) {
    var _a = react_redux_1.useSelector(function (_a) {
        var repo = _a.repo, repoList = _a.repoList;
        return ({ repo: repo, repoList: repoList });
    }), repo = _a.repo, repoList = _a.repoList;
    return (repo && repoList && repoList.length && !repoList.ERROR) ? (react_1["default"].createElement(dropdown_1["default"], __assign({}, props, { currentItemText: repo }), function (props) { return react_1["default"].createElement(menu_1["default"], __assign({}, props), repoList.map(function (repo) { return function (props) {
        return react_1["default"].createElement(wouter_1.Link, __assign({}, props, { href: "/repos/" + repo, key: repo }), repo);
    }; })); })) : react_1["default"].createElement(react_1["default"].Fragment, null);
}
exports["default"] = RepoSelect;

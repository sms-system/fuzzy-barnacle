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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _a;
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_imported_component_1 = __importDefault(require("react-imported-component"));
var repo_page_view_types_1 = __importDefault(require("./repo-page-view-types"));
var Home = react_imported_component_1["default"](function () { return Promise.resolve().then(function () { return __importStar(require('./repo-list/repo-list')); }); });
var FileList = react_imported_component_1["default"](function () { return Promise.resolve().then(function () { return __importStar(require('./file-list/file-list')); }); });
var FileContent = react_imported_component_1["default"](function () { return Promise.resolve().then(function () { return __importStar(require('./file-content/file-content')); }); });
var NotFound = react_imported_component_1["default"](function () { return Promise.resolve().then(function () { return __importStar(require('./404/404')); }); });
var page_names_1 = __importDefault(require("./page-names"));
var routes = (_a = {},
    _a[page_names_1["default"].HOME] = { path: '/', component: Home },
    _a[page_names_1["default"].REPO_LIST] = { path: '/repos', component: Home },
    _a[page_names_1["default"].REPO_PAGE] = { path: '/repos/:repo/:view_type?/:branch?/:path*', component: function (props) {
            switch (props.params.view_type) {
                case undefined:
                case repo_page_view_types_1["default"].TREE: return react_1["default"].createElement(FileList, __assign({}, props.params));
                case repo_page_view_types_1["default"].BLOB: return react_1["default"].createElement(FileContent, __assign({}, props.params));
                default: return react_1["default"].createElement(NotFound, null);
            }
        } },
    _a);
exports["default"] = routes;

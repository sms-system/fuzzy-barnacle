"use strict";
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
var page_names_1 = __importDefault(require("../components/pages/page-names"));
var sources = __importStar(require("./index"));
var actions = __importStar(require("../store/actions"));
var repo_page_view_types_1 = __importDefault(require("../components/pages/repo-page-view-types"));
var baseDataSources = {
    text: [function () { return 'test'; }],
    repoList: [sources.getRepoList]
};
exports.baseDataSources = baseDataSources;
var pageDataSources = (_a = {},
    _a[page_names_1["default"].REPO_PAGE] = function (props) {
        var repo = props.repo, _a = props.branch, branch = _a === void 0 ? 'master' : _a, path = props.path, view_type = props.view_type;
        switch (view_type) {
            case undefined:
            case repo_page_view_types_1["default"].TREE: return {
                fileList: [sources.getFileList, actions.setFileList],
                repo: [function () { return repo; }],
                branch: [function () { return branch; }],
                path: [function () { return path; }]
            };
            case repo_page_view_types_1["default"].BLOB: return {
                // fileContent: [sources.getFileContent, actions.setFileContent],
                repo: [function () { return repo; }],
                branch: [function () { return branch; }],
                path: [function () { return path; }]
            };
        }
    },
    _a);
exports.pageDataSources = pageDataSources;

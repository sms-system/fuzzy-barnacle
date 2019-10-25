"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var layout_1 = __importDefault(require("../layout/base/layout"));
var link_1 = __importDefault(require("../../link/link"));
var table_1 = __importDefault(require("../../table/table"));
var react_redux_1 = require("react-redux");
var actions_1 = require("../../../store/actions");
function RepoList() {
    var dispatch = react_redux_1.useDispatch();
    var stateData = react_redux_1.useSelector(function (state) { return state; });
    var repo = stateData.repo, repoList = stateData.repoList;
    if (repo) {
        dispatch(actions_1.setRepoPos({ repo: undefined, branch: undefined, path: undefined }));
    }
    return (repoList.length ? (react_1["default"].createElement(layout_1["default"], { breadcrumbs: [] },
        react_1["default"].createElement("div", { className: "Layout-Wrap" },
            react_1["default"].createElement("div", { className: "Layout-Scrollarea" },
                react_1["default"].createElement(table_1["default"], { headers: ['Repository folder', ''], rows: repoList.map(function (repo) {
                        return [react_1["default"].createElement(link_1["default"], { href: "/repos/" + repo }, repo), ''];
                    }) }))))) : react_1["default"].createElement(react_1["default"].Fragment, null, "500"));
}
exports["default"] = RepoList;

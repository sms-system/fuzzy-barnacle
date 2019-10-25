"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var wouter_1 = require("wouter");
var react_imported_component_1 = __importDefault(require("react-imported-component"));
var cancelable_promise_1 = __importDefault(require("../../../helpers/cancelable-promise"));
var file_list_1 = __importDefault(require("../../../data-sources/file-list"));
var actions_1 = require("../../../store/actions");
var svg_1 = __importDefault(require("../../svg"));
var link_1 = __importDefault(require("../../link/link"));
var layout_1 = __importDefault(require("../layout/base/layout"));
var tabs_1 = __importDefault(require("../../tabs/tabs"));
var table_1 = __importDefault(require("../../table/table"));
var icon_plus_1 = __importDefault(require("../../icon-plus/icon-plus"));
var NotFound = react_imported_component_1["default"](function () { return Promise.resolve().then(function () { return __importStar(require('../404/404')); }); });
//@ts-ignore
var file_folder_svg_1 = __importDefault(require("../../../assets/file_folder.svg"));
//@ts-ignore
var file_html_svg_1 = __importDefault(require("../../../assets/file_html.svg"));
//@ts-ignore
var file_text_svg_1 = __importDefault(require("../../../assets/file_text.svg"));
function getIcon(type, filename) {
    var ext = filename.split('.').pop();
    switch (type) {
        case 'tree': return file_folder_svg_1["default"];
        case 'blob':
            switch (ext) {
                case 'html': return file_html_svg_1["default"];
                case 'md': return file_html_svg_1["default"];
                default:
                    return file_text_svg_1["default"];
            }
        default: return file_text_svg_1["default"];
    }
}
function getLink(path, repoPos, type) {
    var location = '/repos/' + repoPos.repo + '/' + type + '/' + (repoPos.branch || 'master') + (repoPos.path ? '/' + repoPos.path : '/').replace(/\/$/, '');
    return path === '..' ?
        location.replace(/\/[^\/]+$/, '') :
        location + '/' + path;
}
var page = function (repoPos, fileList, isLoading, location) { return (react_1["default"].createElement(layout_1["default"], { title: repoPos.repo, breadcrumbs: __spreadArrays([
        { url: "/repos/" + repoPos.repo, title: repoPos.repo },
        { url: "/repos/" + repoPos.repo + "/tree/" + repoPos.branch, title: repoPos.branch }
    ], (repoPos.path ? repoPos.path.split('/').map(function (slug, i) { return ({ url: "/repos/" + repoPos.repo + "/tree/" + repoPos.branch + "/" + repoPos.path.split('/').slice(0, i + 1).join('/'), title: slug }); }) : [])) },
    react_1["default"].createElement("div", { className: "Layout-Wrap" },
        react_1["default"].createElement(tabs_1["default"], { items: [
                { title: 'Files', url: '#', isActive: true }
            ] })),
    react_1["default"].createElement("div", { className: "Layout-Wrap " + (isLoading && '_loading') },
        react_1["default"].createElement("div", { className: "Layout-Scrollarea" },
            react_1["default"].createElement(table_1["default"], { headers: ['Name', 'Size (bytes)'], rows: fileList.map(function (row) {
                    return [
                        react_1["default"].createElement(icon_plus_1["default"], { elIcon: react_1["default"].createElement(svg_1["default"], { className: "IconPlus-Icon", icon: getIcon(row.type, row.name) }) },
                            react_1["default"].createElement(link_1["default"], { href: getLink(row.name, repoPos, row.type), mods: { text: true } }, row.name)),
                        row.size
                    ];
                }) }))))); };
function FileList(props) {
    var repo = props.repo, _a = props.branch, branch = _a === void 0 ? 'master' : _a, path = props.path;
    var dispatch = react_redux_1.useDispatch();
    var fileList = react_redux_1.useSelector(function (_a) {
        var fileList = _a.fileList;
        return fileList;
    });
    var currentRepoPos = react_redux_1.useSelector(function (_a) {
        var repo = _a.repo, branch = _a.branch, path = _a.path;
        return ({ repo: repo, branch: branch, path: path });
    }, function () { return true; });
    var location = wouter_1.useLocation()[0];
    var _b = react_1.useState(true), isLoadingFromState = _b[0], setIsLoading = _b[1];
    var isLoading = react_redux_1.shallowEqual(currentRepoPos, { repo: repo, branch: branch, path: path }) ?
        isLoadingFromState : true;
    var setLoadingState = function (state) { if (isLoading !== state)
        setIsLoading(state); };
    function onData(data) {
        dispatch(actions_1.setRepoPos({ repo: repo, branch: branch, path: path }));
        dispatch(actions_1.setFileList(data));
        setLoadingState(false);
    }
    react_1.useEffect(function () {
        if (react_redux_1.shallowEqual(currentRepoPos, { repo: repo, branch: branch, path: path })) {
            setLoadingState(false);
            return;
        }
        setLoadingState(true);
        var fileListPromise = cancelable_promise_1["default"](file_list_1["default"]({ repo: repo, branch: branch, path: path }));
        fileListPromise
            .then(onData)["catch"](function (err) {
            if (err === 'CANCEL') {
                return;
            }
            onData({ ERROR: err.ERROR || true });
        });
        //@ts-ignore
        return function () { fileListPromise.cancel(); };
    }, [repo, branch, path]);
    if (!fileList || !currentRepoPos.repo) {
        return page({ repo: repo, branch: branch }, [], true, location);
    }
    if (Array.isArray(fileList)) {
        var files = currentRepoPos.path ? __spreadArrays([{ type: 'tree', name: '..', size: '-' }], fileList) :
            fileList;
        return page(currentRepoPos, files, isLoading, location);
    }
    if (typeof fileList === 'object' && fileList.ERROR) {
        switch (fileList.ERROR) {
            case 'REPO_DOES_NOT_EXISTS':
            case 'IS_NOT_A_DIRECTORY':
            case 'BRANCH_OR_COMMIT_OR_PATH_DOES_NOT_EXISTS':
                return react_1["default"].createElement(NotFound, null);
        }
    }
    return react_1["default"].createElement(react_1["default"].Fragment, null, "500");
}
exports["default"] = FileList;

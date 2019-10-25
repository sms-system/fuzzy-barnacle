"use strict";
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
var file_content_1 = __importDefault(require("../../../data-sources/file-content"));
var cancelable_promise_1 = __importDefault(require("../../../helpers/cancelable-promise"));
//@ts-ignore
var file_html_svg_1 = __importDefault(require("../../../assets/file_html.svg"));
//@ts-ignore
var file_text_svg_1 = __importDefault(require("../../../assets/file_text.svg"));
function getIcon(filename) {
    var ext = filename.split('.').pop();
    switch (ext) {
        case 'html': return file_html_svg_1["default"];
        case 'md': return file_html_svg_1["default"];
        default: return file_text_svg_1["default"];
    }
}
function FileContent(props) {
    var repo = props.repo, _a = props.branch, branch = _a === void 0 ? 'master' : _a, path = props.path;
    var _b = react_1.useState(null), fileContent = _b[0], setFileContent = _b[1];
    react_1.useEffect(function () {
        if (fileContent)
            return;
        // setLoadingState(true)
        function onData(data) {
            // setLoadingState(false)
            setFileContent(data);
        }
        var fileContentPromise = cancelable_promise_1["default"](file_content_1["default"]({ repo: repo, branch: branch, path: path }));
        fileContentPromise
            //@ts-ignore
            .then(onData)["catch"](function (err) {
            if (err === 'CANCEL') {
                return;
            }
            //@ts-ignore
            onData({ ERROR: err.ERROR || true });
        });
        //@ts-ignore
        return function () { fileContentPromise.cancel(); };
    }, [fileContent]);
    if (!fileContent) {
        return react_1["default"].createElement("div", null, "LOADING");
    }
    else {
        return react_1["default"].createElement("pre", null, fileContent);
    }
}
exports["default"] = FileContent;

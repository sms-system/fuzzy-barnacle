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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
//@ts-ignore
var matcher_1 = __importDefault(require("../generated/matcher"));
var routes_1 = __importDefault(require("../components/pages/routes"));
var page_data_sources_1 = require("../data-sources/page-data-sources");
var matcher = matcher_1["default"]();
function getPage(url) {
    var _loop_1 = function (page) {
        var route = routes_1["default"][page];
        var _a = matcher(route.path, url), match = _a[0], params = _a[1];
        if (match === true) {
            var parsedParams_1 = {};
            Object.keys(params).forEach(function (key) { return parsedParams_1[key] = params[key] && decodeURI(params[key]); });
            return { value: [page, params, parsedParams_1] };
        }
    };
    for (var _i = 0, _a = Object.keys(routes_1["default"]); _i < _a.length; _i++) {
        var page = _a[_i];
        var state_1 = _loop_1(page);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return [null, null, null];
}
exports["default"] = (function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var state, sources, params, _a, pageName, routeParams, parsedParams, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                state = {};
                sources = page_data_sources_1.baseDataSources, params = {};
                _a = getPage(url), pageName = _a[0], routeParams = _a[1], parsedParams = _a[2];
                if (routeParams) {
                    params = routeParams;
                }
                if (pageName && page_data_sources_1.pageDataSources[pageName]) {
                    sources = __assign(__assign({}, sources), page_data_sources_1.pageDataSources[pageName](parsedParams));
                }
                return [4 /*yield*/, Promise.all(Object.values(sources).map(function (_a) {
                        var source = _a[0], _ = _a[1];
                        //@ts-ignore
                        var getter = source(params);
                        if (getter && getter["catch"]) {
                            getter = getter["catch"](function (e) {
                                return { ERROR: e.ERROR || true };
                            });
                        }
                        return getter;
                    }))];
            case 1:
                data = _b.sent();
                Object.keys(sources).forEach(function (key, i) {
                    state[key] = data[i];
                });
                return [2 /*return*/, state];
        }
    });
}); });

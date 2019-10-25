"use strict";
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
var fs_1 = __importDefault(require("fs"));
var fsPromise = fs_1["default"].promises;
var path_1 = __importDefault(require("path"));
var config_1 = __importDefault(require("../config"));
var GIT_DATA_FOLDER = config_1["default"].get('git').dataFolder;
function isGitRepo(repoPath) {
    return fs_1["default"].existsSync(path_1["default"].join(repoPath, GIT_DATA_FOLDER));
}
exports.isGitRepo = isGitRepo;
function normalizeDirPath(name) {
    return path_1["default"].normalize(name) + '/';
}
exports.normalizeDirPath = normalizeDirPath;
function sanitizeRepositoryId(name) {
    var normalizedName = normalizeDirPath(name);
    return !normalizedName ||
        normalizedName.startsWith('../') ||
        normalizedName.slice(0, -1).indexOf(path_1["default"].sep) !== -1 ? null : normalizedName;
}
exports.sanitizeRepositoryId = sanitizeRepositoryId;
function rmrf(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsPromise.readdir(dirPath, { withFileTypes: true })];
                case 1:
                    entries = _a.sent();
                    return [4 /*yield*/, Promise.all(entries.map(function (entry) {
                            var fullPath = path_1["default"].join(dirPath, entry.name);
                            return entry.isDirectory() ? rmrf(fullPath) : fsPromise.unlink(fullPath);
                        }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fsPromise.rmdir(dirPath)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.rmrf = rmrf;
function isLooksLikeArg(str) {
    return str.startsWith('-');
}
exports.isLooksLikeArg = isLooksLikeArg;
function getDelimeterKey(postfix) {
    return "__RND_DELIMETER__" + (Math.random() * 10e8).toString(36).replace('.', '_') + "__" + postfix + "__";
}
exports.getDelimeterKey = getDelimeterKey;
function constructGitLogFmtTpl(obj, quoteDelimeter, endOfLineDelimeter) {
    var parts = Object.keys(obj).map(function (key) { return "" + quoteDelimeter + key + quoteDelimeter + ": " + quoteDelimeter + obj[key] + quoteDelimeter; });
    return "{" + parts.join(',') + "}" + endOfLineDelimeter;
}
exports.constructGitLogFmtTpl = constructGitLogFmtTpl;
function setProcessTimeout(proc, callback, time) {
    return setTimeout(function () {
        proc.stdout.destroy();
        proc.stderr.destroy();
        proc.kill();
        callback();
    }, time);
}
exports.setProcessTimeout = setProcessTimeout;
function doJSONEscape(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/\r\n/g, '\\n')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/"/g, '\\\"')
        .replace(/\u0008/g, '\\b')
        .replace(/[\u007F-\uFFFF]/g, function (chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
    });
}
exports.doJSONEscape = doJSONEscape;
// Страшно выглядящая функция, для магии потокового эскепинга двойных кавычек в строке и экранирующая переносы
function getChunksJSONNormalizer(quoteDelimeter, endOfLineDelimeter) {
    var endOfLineDelimeterOnTheBorders = endOfLineDelimeter + '\n{';
    var maxRestLength = Math.max(quoteDelimeter.length, endOfLineDelimeterOnTheBorders.length);
    var doReplaces = function (chunk) { return doJSONEscape(chunk.replace(new RegExp(endOfLineDelimeterOnTheBorders, 'g'), ',{'))
        .replace(new RegExp(quoteDelimeter, 'g'), '"'); };
    var chunk, lastChunk = '';
    var processor = function (data, handler) {
        if (!lastChunk) {
            lastChunk = data.toString();
            return;
        }
        var currentChunk = data.toString();
        var lastPlaceholderPos = Math.max(currentChunk.lastIndexOf(quoteDelimeter), currentChunk.lastIndexOf(endOfLineDelimeterOnTheBorders));
        if (lastPlaceholderPos !== -1) {
            chunk = lastChunk + currentChunk.substr(0, lastPlaceholderPos);
            lastChunk = currentChunk.substr(lastPlaceholderPos);
        }
        else {
            chunk = lastChunk + currentChunk.slice(0, -maxRestLength);
            lastChunk = currentChunk.slice(-maxRestLength);
        }
        handler(doReplaces(chunk));
    };
    processor.getLastChunk = function () { return lastChunk && doReplaces(lastChunk.replace(new RegExp(endOfLineDelimeter + '\n', 'g'), '')); };
    return processor;
}
exports.getChunksJSONNormalizer = getChunksJSONNormalizer;
function gitTreeRecordFormat(line) {
    var delimeterPos = line.indexOf('\t');
    var fileName = doJSONEscape(line.substr(delimeterPos + 1).replace(/^"|"$/g, ''));
    var _a = line.substr(0, delimeterPos).split(/\s+/), mode = _a[0], type = _a[1], objHash = _a[2], size = _a[3];
    return "{\"name\": \"" + fileName + "\", \"type\": \"" + type + "\", \"size\": \"" + size + "\", \"objHash\": \"" + objHash + "\", \"mode\": \"" + mode + "\"}";
}
exports.gitTreeRecordFormat = gitTreeRecordFormat;

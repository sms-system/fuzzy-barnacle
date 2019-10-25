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
var git_repo_1 = __importDefault(require("./git-repo"));
var p_queue_1 = __importDefault(require("p-queue"));
var os_1 = __importDefault(require("os"));
var numCPUs = os_1["default"].cpus().length;
var QUEUE_LIMIT = numCPUs;
function countSymbols(data, symbolsMap, ignoreBinary) {
    for (var i = 0; i < data.length; i++) {
        var char = data[i];
        var charCode = char.charCodeAt(0);
        if (charCode === 13) {
            return;
        }
        if (ignoreBinary && charCode < 32 && charCode !== 9 && charCode !== 10) {
            return char.charCodeAt(0);
        }
        var prevVal = symbolsMap[char];
        symbolsMap[char] = prevVal ? prevVal + 1 : 1;
    }
}
process.on('message', function (_a) {
    var fileList = _a.fileList, repoPath = _a.repoPath, commitHash = _a.commitHash, ignoreBinary = _a.ignoreBinary;
    var queue = new p_queue_1["default"]({ concurrency: QUEUE_LIMIT });
    var repo = new git_repo_1["default"](repoPath, null, false);
    var symbols = {}, ignoredFiles = [];
    function processFile(repo, commitHash, fileName) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var doCount, localSymbols;
            return __generator(this, function (_a) {
                doCount = true, localSymbols = {};
                repo.getBlobContent(commitHash, fileName, function (data) {
                    if (!doCount) {
                        return;
                    }
                    var err = countSymbols(data.toString(), localSymbols, ignoreBinary);
                    if (err) {
                        doCount = false, ignoredFiles.push(fileName), resolve();
                    }
                }, function () { doCount = false, ignoredFiles.push(fileName), resolve(); }, function () {
                    Object.keys(localSymbols).forEach(function (key) { symbols[key] = symbols[key] ? symbols[key] + localSymbols[key] : localSymbols[key]; });
                    resolve();
                });
                return [2 /*return*/];
            });
        }); });
    }
    fileList.forEach(function (entry) {
        queue.add(function () { return processFile(repo, commitHash, entry.name); });
    });
    queue.onIdle().then(function () {
        if (process.send) {
            process.send({ symbols: symbols, ignoredFiles: ignoredFiles });
        }
    });
});

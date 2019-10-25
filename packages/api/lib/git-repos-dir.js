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
var child_process_1 = require("child_process");
var config_1 = __importDefault(require("../config"));
var error_codes_1 = __importDefault(require("./error-codes"));
var gitConfig = config_1["default"].get('git');
var GIT_BINARY = gitConfig.binary;
var GIT_CLONE_TIMEOUT = gitConfig.cloneTimeout;
var utils_1 = require("./utils");
var GitReposDir = /** @class */ (function () {
    function GitReposDir(dirPath) {
        this.path = utils_1.normalizeDirPath(dirPath);
        if (!fs_1["default"].existsSync(this.path))
            throw error_codes_1["default"].REPOS_DIR_NOT_EXISTS;
    }
    GitReposDir.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            var entries;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fsPromise.readdir(this.path, { withFileTypes: true })];
                    case 1:
                        entries = _a.sent();
                        return [2 /*return*/, entries
                                .filter(function (entry) { return entry.isDirectory() && utils_1.isGitRepo(path_1["default"].join(_this.path, entry.name)); })
                                .map(function (entry) { return entry.name; })];
                }
            });
        });
    };
    GitReposDir.prototype.removeRepo = function (repositoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var sanitizedRepositoryId, repoPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sanitizedRepositoryId = utils_1.sanitizeRepositoryId(repositoryId);
                        if (!sanitizedRepositoryId)
                            throw error_codes_1["default"].HACKING_ATTEMPT;
                        repoPath = path_1["default"].join(this.path, sanitizedRepositoryId);
                        if (!utils_1.isGitRepo(repoPath))
                            throw error_codes_1["default"].REPO_DOES_NOT_EXISTS;
                        return [4 /*yield*/, utils_1.rmrf(repoPath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitReposDir.prototype.cloneRepo = function (url, repositoryId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var args = ['clone', '--', url];
            if (repositoryId) {
                var sanitizedRepositoryId = utils_1.sanitizeRepositoryId(repositoryId);
                if (!sanitizedRepositoryId) {
                    return reject(error_codes_1["default"].HACKING_ATTEMPT);
                }
                args.push(sanitizedRepositoryId);
            }
            var child = child_process_1.spawn(GIT_BINARY, args, {
                cwd: _this.path
            });
            var execTimeout = utils_1.setProcessTimeout(child, function () { return reject(error_codes_1["default"].TIMEOUT_EXCEEDED); }, GIT_CLONE_TIMEOUT);
            var errorMsg = '';
            child.stderr.on('data', function (data) { errorMsg = data.toString(); });
            child.on('close', function (code) {
                clearTimeout(execTimeout);
                if (!code)
                    return resolve();
                if (errorMsg.endsWith('already exists and is not an empty directory.\n'))
                    return reject(error_codes_1["default"].REPO_ALREADY_EXISTS);
                if (errorMsg.startsWith('fatal: unable to access '))
                    return reject(error_codes_1["default"].INVALID_GIT_REPO_URL);
                reject(error_codes_1["default"].UNEXPECTED_ERROR);
            });
        });
    };
    return GitReposDir;
}());
exports["default"] = GitReposDir;

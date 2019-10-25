"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var config_1 = __importDefault(require("../config"));
var gitConfig = config_1["default"].get('git');
var error_codes_1 = __importDefault(require("./error-codes"));
var GIT_BINARY = gitConfig.binary;
var COMMITS_PER_PAGE = config_1["default"].get('commitsPerPage');
var USE_COMMITS_LOG_PAGING = !!COMMITS_PER_PAGE;
var utils_1 = require("./utils");
var GitRepo = /** @class */ (function () {
    function GitRepo(dirPath, repositoryId, checkIsGitDir) {
        if (checkIsGitDir === void 0) { checkIsGitDir = true; }
        if (repositoryId) {
            var sanitizedRepositoryId = utils_1.sanitizeRepositoryId(repositoryId);
            if (!sanitizedRepositoryId)
                throw error_codes_1["default"].REPO_DOES_NOT_EXISTS;
            this.path = path_1["default"].join(dirPath, sanitizedRepositoryId);
        }
        else {
            this.path = dirPath;
        }
        if (!utils_1.isGitRepo(this.path) && checkIsGitDir)
            throw error_codes_1["default"].REPO_DOES_NOT_EXISTS;
    }
    GitRepo.prototype.getCommits = function (commitHash, pageNum, streamHandler, errHandler, closeHandler) {
        if (pageNum === void 0) { pageNum = 0; }
        if (streamHandler === void 0) { streamHandler = function (data) { }; }
        if (errHandler === void 0) { errHandler = function (data) { }; }
        if (closeHandler === void 0) { closeHandler = function (code) { }; }
        if (utils_1.isLooksLikeArg(commitHash))
            return errHandler(error_codes_1["default"].HACKING_ATTEMPT);
        var QUOTE_DELIMETER = utils_1.getDelimeterKey('QUOTE');
        var END_OF_LINE_DELIMETER = utils_1.getDelimeterKey('EOL');
        var fmtTpl = utils_1.constructGitLogFmtTpl({
            hash: '%H',
            parent: '%P',
            subject: '%s',
            body: '%b',
            time: '%at',
            author: '%aN <%ae>'
        }, QUOTE_DELIMETER, END_OF_LINE_DELIMETER);
        var fromPos = (parseInt(pageNum.toString()) - 1) * COMMITS_PER_PAGE;
        var paginator = USE_COMMITS_LOG_PAGING ? ['--skip', fromPos.toString(), '-n', COMMITS_PER_PAGE.toString()] : [];
        var child = child_process_1.spawn(GIT_BINARY, __spreadArrays(['log'], paginator, ["--format=" + fmtTpl, commitHash, '--']), {
            cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
        });
        var chunkProcessor = utils_1.getChunksJSONNormalizer(QUOTE_DELIMETER, END_OF_LINE_DELIMETER);
        var errorMsg = '', outputStarted = false;
        child.stderr.on('data', function (data) { errorMsg = data.toString(); });
        child.stdout.on('data', function (data) {
            chunkProcessor(data, function (chunk) {
                if (!outputStarted) {
                    streamHandler('[');
                    outputStarted = true;
                }
                streamHandler(chunk);
            });
        });
        child.on('close', function (code) {
            var lastChunk = chunkProcessor.getLastChunk();
            if (lastChunk)
                streamHandler(lastChunk + ']');
            if (!code)
                return closeHandler(code);
            if (errorMsg.startsWith('fatal: bad revision'))
                return errHandler(error_codes_1["default"].BRANCH_OR_COMMIT_DOES_NOT_EXISTS);
            return errHandler(error_codes_1["default"].UNEXPECTED_ERROR);
        });
    };
    GitRepo.prototype.getCommitDiff = function (commitHash, streamHandler, errHandler, closeHandler) {
        if (streamHandler === void 0) { streamHandler = function (data) { }; }
        if (errHandler === void 0) { errHandler = function (data) { }; }
        if (closeHandler === void 0) { closeHandler = function (code) { }; }
        if (utils_1.isLooksLikeArg(commitHash))
            return errHandler(error_codes_1["default"].HACKING_ATTEMPT);
        var child = child_process_1.spawn(GIT_BINARY, ['show', '-m', commitHash, '--'], {
            cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
        });
        var errorMsg = '', outputStarted = false;
        child.stderr.on('data', function (data) { errorMsg = data.toString(); });
        child.stdout.on('data', function (data) {
            if (!outputStarted) {
                streamHandler('{"diffContent":"');
                outputStarted = true;
            }
            streamHandler(utils_1.doJSONEscape(data.toString()));
        });
        child.on('close', function (code) {
            if (outputStarted) {
                streamHandler('"}');
            }
            if (!code)
                return closeHandler(code);
            if (errorMsg.startsWith('fatal: bad revision') || errorMsg.startsWith('fatal: bad object')) {
                return errHandler(error_codes_1["default"].BRANCH_OR_COMMIT_DOES_NOT_EXISTS);
            }
            return errHandler(error_codes_1["default"].UNEXPECTED_ERROR);
        });
    };
    GitRepo.prototype.getTree = function (commitHash, dirPath, _a, streamHandler, errHandler, closeHandler) {
        if (commitHash === void 0) { commitHash = 'master'; }
        var _b = _a.isRecursive, isRecursive = _b === void 0 ? false : _b, _c = _a.isJSONStr, isJSONStr = _c === void 0 ? true : _c;
        if (streamHandler === void 0) { streamHandler = function (data) { }; }
        if (errHandler === void 0) { errHandler = function (data) { }; }
        if (closeHandler === void 0) { closeHandler = function (code) { }; }
        var recursiveFlags = isRecursive ? ['-r'] : [];
        var child = child_process_1.spawn(GIT_BINARY, __spreadArrays(['ls-tree', '-l'], recursiveFlags, ['--', commitHash + (dirPath ? ':' + dirPath : '')]), {
            cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
        });
        var errorMsg = '', JSONOutputStarted = false, prevChunk = '', isFirstChunk = true;
        child.stderr.on('data', function (data) { errorMsg = data.toString(); });
        child.stdout.on('data', function (data) {
            if (!JSONOutputStarted && isJSONStr) {
                streamHandler('[');
                JSONOutputStarted = true;
            }
            var lines = (prevChunk + data.toString()).split('\n');
            prevChunk = lines.pop() || '';
            if (lines.length) {
                if (!isFirstChunk && isJSONStr) {
                    streamHandler(',');
                }
                isFirstChunk = false;
                var processedPart = isJSONStr ?
                    lines.map(function (line) { return utils_1.gitTreeRecordFormat(line); }).join(',') :
                    lines.map(function (line) { return JSON.parse(utils_1.gitTreeRecordFormat(line)); });
                streamHandler(processedPart);
            }
        });
        child.on('close', function (code) {
            if (prevChunk.length) {
                var processedPart = isJSONStr ?
                    ',' + utils_1.gitTreeRecordFormat(prevChunk) :
                    JSON.parse(utils_1.gitTreeRecordFormat(prevChunk));
                streamHandler(processedPart);
            }
            if (JSONOutputStarted) {
                streamHandler(']');
            }
            if (!code)
                return closeHandler(code);
            if (errorMsg.startsWith('fatal: Not a valid object name'))
                return errHandler(error_codes_1["default"].BRANCH_OR_COMMIT_OR_PATH_DOES_NOT_EXISTS);
            if (errorMsg.startsWith('fatal: not a tree object'))
                return errHandler(error_codes_1["default"].IS_NOT_A_DIRECTORY);
            return errHandler(error_codes_1["default"].UNEXPECTED_ERROR);
        });
    };
    GitRepo.prototype.getBlobContent = function (commitHash, filePath, streamHandler, errHandler, closeHandler) {
        if (streamHandler === void 0) { streamHandler = function (data) { }; }
        if (errHandler === void 0) { errHandler = function (data) { }; }
        if (closeHandler === void 0) { closeHandler = function (code) { }; }
        if (utils_1.isLooksLikeArg(commitHash) || commitHash.indexOf(':') >= 0)
            return errHandler(error_codes_1["default"].HACKING_ATTEMPT);
        var child = child_process_1.spawn(GIT_BINARY, ['show', commitHash + ":" + filePath], {
            cwd: this.path, stdio: ['ignore', 'pipe', 'pipe']
        });
        var errorMsg = '';
        child.stderr.on('data', function (data) { errorMsg = data.toString(); });
        child.stdout.on('data', function (data) { streamHandler(data); });
        child.on('close', function (code) {
            if (!code)
                return closeHandler(code);
            if (errorMsg.startsWith('fatal: Invalid object name'))
                return errHandler(error_codes_1["default"].BRANCH_OR_COMMIT_DOES_NOT_EXISTS);
            if (errorMsg.startsWith('fatal: Path'))
                return errHandler(error_codes_1["default"].FILE_NOT_FOUND);
            return errHandler(error_codes_1["default"].UNEXPECTED_ERROR);
        });
    };
    GitRepo.prototype.getSymbolsCount = function (commitHash, ignoreBinary, streamHandler, errHandler, closeHandler) {
        var _this = this;
        if (ignoreBinary === void 0) { ignoreBinary = true; }
        if (streamHandler === void 0) { streamHandler = function (data) { }; }
        if (errHandler === void 0) { errHandler = function (data) { }; }
        if (closeHandler === void 0) { closeHandler = function (obj) { }; }
        var globalSymbols = {};
        var workersCount = 0, isEnded = false;
        this.getTree(commitHash, null, { isRecursive: true, isJSONStr: false }, function (tree) {
            var fileList = tree.filter(function (entry) { return entry.type === 'blob'; });
            var child = child_process_1.fork('./lib/symbol-counter.js');
            workersCount++;
            child.send({ fileList: fileList, repoPath: _this.path, commitHash: commitHash, ignoreBinary: ignoreBinary });
            child.on('message', function (_a) {
                var symbols = _a.symbols, ignoredFiles = _a.ignoredFiles;
                Object.keys(symbols).forEach(function (key) {
                    globalSymbols[key] = globalSymbols[key] ? globalSymbols[key] + symbols[key] : symbols[key];
                });
                // ignoredFilesHandler(ignoredFiles)
                workersCount--;
                child.kill();
                if (!workersCount && isEnded) {
                    closeHandler(globalSymbols);
                }
            });
        }, errHandler, function () {
            isEnded = true;
            if (!workersCount) {
                isEnded = false, closeHandler(globalSymbols);
            }
        });
    };
    return GitRepo;
}());
exports["default"] = GitRepo;

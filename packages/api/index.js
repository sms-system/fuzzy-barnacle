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
var config_1 = __importDefault(require("./config"));
var express_1 = __importDefault(require("express"));
var mime_types_1 = __importDefault(require("mime-types"));
var path_1 = __importDefault(require("path"));
var lib_1 = require("./lib");
var PORT = config_1["default"].get('api').port;
var REPOS_DIR = config_1["default"].get('reposDir') || process.argv[2];
if (!REPOS_DIR) {
    throw 'Missed REPOS_DIR argument. Usage: "npm run start -- /path/to/repos" or "yarn start /path/to/repos" ';
}
if (!path_1["default"].isAbsolute(REPOS_DIR)) {
    REPOS_DIR = path_1["default"].resolve(__dirname, '..', '..', REPOS_DIR);
}
var errHandler = function (res, code) { return function (errorCode) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(code).json({ errorCode: errorCode });
}; };
var app = express_1["default"]();
app.use(express_1["default"].json());
app.param('repositoryId', function (req, res, next, repositoryId) {
    try {
        req.repo = new lib_1.GitRepo(REPOS_DIR, repositoryId);
        next();
    }
    catch (err) {
        errHandler(res, 404)(err);
    }
});
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.repo)
        return next();
    try {
        req.reposDir = new lib_1.GitReposDir(REPOS_DIR);
        next();
    }
    catch (err) {
        errHandler(res, 404)(err);
    }
});
function blobMiddleware(req, res, next) {
    res.setHeader('Content-Type', mime_types_1["default"].lookup(req.url) || 'application/octet-stream');
    return next();
}
app.get('/api/repos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).json;
                return [4 /*yield*/, req.reposDir.list()];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
// Send page positiion with `page` query
// Example: /api/repos/cool-timer/commits/master?page=3
app.get('/api/repos/:repositoryId/commits/:commitHash', function (req, res) {
    var commitHash = req.params.commitHash;
    var page = req.query.page;
    req.repo.getCommits(commitHash, page, function (data) { return res.write(data); }, errHandler(res, 500), function () { return res.end(); });
});
app.get('/api/repos/:repositoryId/commits/:commitHash/diff', function (req, res) {
    var commitHash = req.params.commitHash;
    req.repo.getCommitDiff(commitHash, function (data) { return res.write(data); }, errHandler(res, 500), function () { return res.end(); });
});
function getTreeHandler(req, res) {
    var _a = req.params, commitHash = _a.commitHash, path = _a.path;
    req.repo.getTree(commitHash, path, {}, function (data) { return res.write(data); }, errHandler(res, 500), function () { return res.end(); });
}
app.get('/api/repos/:repositoryId', getTreeHandler);
app.get('/api/repos/:repositoryId/tree/:commitHash/:path(*)', getTreeHandler);
app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile(*)', blobMiddleware, function (req, res) {
    var _a = req.params, commitHash = _a.commitHash, pathToFile = _a.pathToFile;
    req.repo.getBlobContent(commitHash, pathToFile, function (data) { return res.write(data); }, errHandler(res, 500), function () { return res.end(); });
});
app["delete"]('/api/repos/:dirRepositoryId', function (req, res) {
    var dirRepositoryId = req.params.dirRepositoryId;
    req.reposDir.removeRepo(dirRepositoryId)
        .then(function () { return res.json({ status: 'OK' }); })["catch"](errHandler(res, 500));
});
app.post('/api/repos', function (req, res) {
    var _a = req.body, url = _a.url, repositoryId = _a.repositoryId;
    req.reposDir.cloneRepo(url, repositoryId)
        .then(function () { return res.json({ status: 'OK' }); })["catch"](errHandler(res, 500));
});
app.get('/api/repos/:repositoryId/charsCount/:commitHash', function (req, res) {
    var commitHash = req.params.commitHash;
    req.repo.getSymbolsCount(commitHash, true, errHandler(res, 500), function (data) { return res.json(data); });
});
app.listen(PORT, function () { return console.log("Web server started on port " + PORT); });

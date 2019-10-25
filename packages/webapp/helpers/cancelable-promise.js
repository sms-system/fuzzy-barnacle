"use strict";
exports.__esModule = true;
function default_1(promise) {
    var defferedReject;
    var wrap = new Promise(function (resolve, reject) {
        defferedReject = reject;
        promise
            .then(function (res) { return resolve(res); })["catch"](function (err) { return reject(err); });
    });
    wrap.cancel = function () { return defferedReject('CANCEL'); };
    return wrap;
}
exports["default"] = default_1;

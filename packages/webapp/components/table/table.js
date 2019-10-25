"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var classname_1 = require("@bem-react/classname");
require("./table.styl");
var cnTable = classname_1.cn('Table');
function Table(props) {
    var className = props.className, _a = props.headers, headers = _a === void 0 ? [] : _a, _b = props.rows, rows = _b === void 0 ? [] : _b;
    return (react_1["default"].createElement("table", { className: cnTable(null, [className]), cellSpacing: "0" },
        react_1["default"].createElement("thead", null,
            react_1["default"].createElement("tr", { className: cnTable('Row') }, headers.map(function (cell, i) {
                return react_1["default"].createElement("th", { key: i, className: cnTable('Cell', { head: true }) }, cell);
            }))),
        react_1["default"].createElement("tbody", null, rows.map(function (row, i) {
            return react_1["default"].createElement("tr", { key: i, className: cnTable('Row', { hoverable: true }) }, row.map(function (cell, i) {
                return react_1["default"].createElement("td", { key: i, className: cnTable('Cell') }, cell);
            }));
        }))));
}
exports["default"] = Table;

parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"kUj2":[function(require,module,exports) {
function n(n,o){if(!(n instanceof o))throw new TypeError("Cannot call a class as a function")}module.exports=n;
},{}],"dMjH":[function(require,module,exports) {
function e(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function r(r,n,t){return n&&e(r.prototype,n),t&&e(r,t),r}module.exports=r;
},{}],"FlpK":[function(require,module,exports) {
function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o})(t)}function t(n){return"function"==typeof Symbol&&"symbol"===o(Symbol.iterator)?module.exports=t=function(t){return o(t)}:module.exports=t=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":o(t)},t(n)}module.exports=t;
},{}],"oXBW":[function(require,module,exports) {
function e(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}module.exports=e;
},{}],"3cbG":[function(require,module,exports) {
var e=require("../helpers/typeof"),r=require("./assertThisInitialized");function t(t,i){return!i||"object"!==e(i)&&"function"!=typeof i?r(t):i}module.exports=t;
},{"../helpers/typeof":"FlpK","./assertThisInitialized":"oXBW"}],"XApn":[function(require,module,exports) {
function t(e){return module.exports=t=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},t(e)}module.exports=t;
},{}],"AQ4X":[function(require,module,exports) {
var r=require("./getPrototypeOf");function e(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=r(e)););return e}module.exports=e;
},{"./getPrototypeOf":"XApn"}],"rXSD":[function(require,module,exports) {
var e=require("./getPrototypeOf"),t=require("./superPropBase");function r(e,o,u){return"undefined"!=typeof Reflect&&Reflect.get?module.exports=r=Reflect.get:module.exports=r=function(e,r,o){var u=t(e,r);if(u){var f=Object.getOwnPropertyDescriptor(u,r);return f.get?f.get.call(o):f.value}},r(e,o,u||e)}module.exports=r;
},{"./getPrototypeOf":"XApn","./superPropBase":"AQ4X"}],"+Omx":[function(require,module,exports) {
function t(o,e){return module.exports=t=Object.setPrototypeOf||function(t,o){return t.__proto__=o,t},t(o,e)}module.exports=t;
},{}],"1PhT":[function(require,module,exports) {
var e=require("./setPrototypeOf");function r(r,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");r.prototype=Object.create(t&&t.prototype,{constructor:{value:r,writable:!0,configurable:!0}}),t&&e(r,t)}module.exports=r;
},{"./setPrototypeOf":"+Omx"}],"6x3D":[function(require,module,exports) {
function e(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}module.exports=e;
},{}],"F50/":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}function i(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}Object.defineProperty(exports,"__esModule",{value:!0});var s=function(){function t(i){e(this,t),this._reducer=i,this._state=void 0,this._listeners=[],this.dispatch({type:"@@init"})}return i(t,[{key:"_notifyListeners",value:function(){var e=this;this._listeners.forEach(function(t){t(e._state)})}},{key:"getState",value:function(){return this._state}},{key:"subscribe",value:function(e){var t=this;return this._listeners.push(e),function(){var i=t._listeners.indexOf(e);t._listeners.splice(i,1)}}},{key:"dispatch",value:function(e){this._state=this._reducer(this._state,e),this._notifyListeners()}}]),t}(),r=function(){function t(i,s){e(this,t),this._el=i,this._store=s,this._unsubscribe=s.subscribe(this._prepareRender.bind(this)),this._prepareRender(s.getState())}return i(t,[{key:"_prepareRender",value:function(e){this.shouldUpdate&&!this.shouldUpdate(e)||(this._el.innerHTML=this.render(e))}},{key:"render",value:function(){throw new Error("This method should be overriden")}},{key:"destroy",value:function(){this._el.innerHTML="",this._unsubscribe()}}]),t}(),n={DOMView:r},u={Store:s,views:n},o=u.Store,a=u.views;exports.Store=o,exports.default=u,exports.views=a;
},{}],"eQFW":[function(require,module,exports) {
module.exports=function(n){return function(o){return console.log("LOG:",o),n(o)}};
},{}],"vACF":[function(require,module,exports) {
"use strict";var e=a(require("@babel/runtime/helpers/classCallCheck")),r=a(require("@babel/runtime/helpers/createClass")),t=a(require("@babel/runtime/helpers/possibleConstructorReturn")),i=a(require("@babel/runtime/helpers/getPrototypeOf")),n=a(require("@babel/runtime/helpers/get")),u=a(require("@babel/runtime/helpers/inherits")),l=a(require("@babel/runtime/helpers/defineProperty"));function a(e){return e&&e.__esModule?e:{default:e}}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);r&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,i)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(t,!0).forEach(function(r){(0,l.default)(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(t).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}var c=require("redux"),p=c.Store,f=require("./middlewares/logger"),b=function(e,r){switch(r.type){case"@@init":return{filter:"",files:[],isLoading:!1};case"SET_FILTER":return o({},e,{filter:r.payload});case"SET_LOADING_STATE":return o({},e,{isLoading:r.payload});case"SET_FILES_LIST":return o({},e,{files:r.payload});default:return e}},d=function(l){function a(){return(0,e.default)(this,a),(0,t.default)(this,(0,i.default)(a).call(this,b))}return(0,u.default)(a,l),(0,r.default)(a,[{key:"dispatch",value:function(e){var r=(0,n.default)((0,i.default)(a.prototype),"dispatch",this).bind(this),t=f(r);t(e)}}]),a}(p);module.exports=d;
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/possibleConstructorReturn":"3cbG","@babel/runtime/helpers/getPrototypeOf":"XApn","@babel/runtime/helpers/get":"rXSD","@babel/runtime/helpers/inherits":"1PhT","@babel/runtime/helpers/defineProperty":"6x3D","redux":"F50/","./middlewares/logger":"eQFW"}],"FOL9":[function(require,module,exports) {
var T={INIT:"@@init",SET_FILTER:"SET_FILTER",SET_LOADING_STATE:"SET_LOADING_STATE",SET_FILES_LIST:"SET_FILES_LIST"},S=function(T){return function(S){return{type:T,payload:S}}};module.exports={types:T,action:{setFilter:S(T.SET_FILTER),setLoadingState:S(T.SET_LOADING_STATE),setFilesList:S(T.SET_FILES_LIST)}};
},{}],"ap3F":[function(require,module,exports) {
"use strict";var e=a(require("@babel/runtime/helpers/classCallCheck")),t=a(require("@babel/runtime/helpers/createClass")),r=a(require("@babel/runtime/helpers/possibleConstructorReturn")),i=a(require("@babel/runtime/helpers/assertThisInitialized")),u=a(require("@babel/runtime/helpers/getPrototypeOf")),l=a(require("@babel/runtime/helpers/get")),n=a(require("@babel/runtime/helpers/inherits"));function a(e){return e&&e.__esModule?e:{default:e}}var s=require("redux"),o=s.views,h=require("../actions"),d=h.action,c="input";module.exports=function(a){function s(t,l){var n;return(0,e.default)(this,s),(n=(0,r.default)(this,(0,u.default)(s).call(this,t,l)))._val="",n._el.addEventListener(c,n._onInput.bind((0,i.default)(n))),n}return(0,n.default)(s,a),(0,t.default)(s,[{key:"_onInput",value:function(e){this._val=e.target.value,this._store.dispatch(d.setFilter(this._val))}},{key:"shouldUpdate",value:function(e){return e.filter!==this._val}},{key:"render",value:function(e){var t=e.filter;return this._val=t,'<input value="'.concat(t,'">')}},{key:"destroy",value:function(){(0,l.default)((0,u.default)(s.prototype),"destroy",this).call(this),this._el.removeEventListener(c,this._onInput)}}]),s}(o.DOMView);
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/possibleConstructorReturn":"3cbG","@babel/runtime/helpers/assertThisInitialized":"oXBW","@babel/runtime/helpers/getPrototypeOf":"XApn","@babel/runtime/helpers/get":"rXSD","@babel/runtime/helpers/inherits":"1PhT","redux":"F50/","../actions":"FOL9"}],"4iRk":[function(require,module,exports) {
"use strict";var e=a(require("@babel/runtime/helpers/classCallCheck")),r=a(require("@babel/runtime/helpers/createClass")),t=a(require("@babel/runtime/helpers/possibleConstructorReturn")),u=a(require("@babel/runtime/helpers/getPrototypeOf")),l=a(require("@babel/runtime/helpers/get")),i=a(require("@babel/runtime/helpers/inherits"));function a(e){return e&&e.__esModule?e:{default:e}}var s=require("redux"),n=s.views;module.exports=function(a){function s(r,l){return(0,e.default)(this,s),(0,t.default)(this,(0,u.default)(s).call(this,r,l))}return(0,i.default)(s,a),(0,r.default)(s,[{key:"render",value:function(e){var r=e.filter;return"<b>".concat(r,"</b>")}},{key:"destroy",value:function(){(0,l.default)((0,u.default)(s.prototype),"destroy",this).call(this)}}]),s}(n.DOMView);
},{"@babel/runtime/helpers/classCallCheck":"kUj2","@babel/runtime/helpers/createClass":"dMjH","@babel/runtime/helpers/possibleConstructorReturn":"3cbG","@babel/runtime/helpers/getPrototypeOf":"XApn","@babel/runtime/helpers/get":"rXSD","@babel/runtime/helpers/inherits":"1PhT","redux":"F50/"}],"dssR":[function(require,module,exports) {
var e=require("./logic/store"),t=require("./logic/views/FilterField"),i=require("./logic/views/Text"),n=new e;new t(document.getElementById("text"),n),new t(document.getElementById("text2"),n),new i(document.getElementById("res"),n);
},{"./logic/store":"vACF","./logic/views/FilterField":"ap3F","./logic/views/Text":"4iRk"}]},{},["dssR"], null)
//# sourceMappingURL=https://sms-system.github.io/fuzzy-barnacle/redux-demo.04d5fe3a.js.map
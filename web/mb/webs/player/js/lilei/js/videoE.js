/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		1: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData === 0) {
/******/ 			return new Promise(function(resolve) { resolve(); });
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunkData) {
/******/ 			return installedChunkData[2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunkData[2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + chunkId + ".js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'timeFormat',
        value: function timeFormat(value) {
            var minute = void 0;
            var h = void 0,
                o = void 0,
                m = void 0,
                s = parseInt(value); //时:分:秒
            h = Math.floor(value / 3600);
            o = value % 3600;
            m = Math.floor(o / 60);
            s = parseInt(o % 60);

            h = !h ? '00' : h < 10 ? '0' + h : h;
            m = !m ? '00' : m < 10 ? '0' + m : m;
            s = !s ? '00' : s < 10 ? '0' + s : s;
            minute = h + ':' + m + ':' + s;
            return minute;
        }
    }, {
        key: 'scaleImage',
        value: function scaleImage(value) {
            var standardWidth = 960;
            var scaleMin = 0.8;
            var scaleMax = 1.3;
            var scaleNumber = value / standardWidth;
            if (scaleNumber < scaleMin) {
                scaleNumber = scaleMin;
            }
            if (scaleNumber > scaleMax) {
                scaleNumber = scaleMax;
            }
            return scaleNumber;
        }
    }]);

    return Utils;
}();

exports.default = Utils;

/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PICSprite = __webpack_require__(16);

var _PICSprite2 = _interopRequireDefault(_PICSprite);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoE = function () {
    function VideoE() {
        _classCallCheck(this, VideoE);
    }

    _createClass(VideoE, [{
        key: "videoEinit",
        value: function videoEinit(mid, cpid) {
            var xmlhttp = new XMLHttpRequest();
            var url = "http://test.videoyi.cn/workorder/get-line-list";
            var variables = "video_id=" + mid + "&platform=" + cpid;
            console.log(variables);
            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(variables);
            xmlhttp.addEventListener("readystatechange", dataChangeHandler);
        }
    }]);

    return VideoE;
}();

function dataChangeHandler(event) {

    if (event.target.readyState == 4 && event.target.status == 200) {
        var json = JSON.parse(event.target.responseText);
        var data = new Array();
        for (var index = 0; index < json.data.length; index++) {
            if (json.data[index].product_ad_type == "12") {
                data.push(json.data[index]);
            }
        }
        var picSprite = new _PICSprite2.default();
        var div = document.getElementById(moivebook.videoE);
        picSprite.addedPicSprite(data, div);
    }
}
var videoE = new VideoE();
videoE.videoEinit(moivebook.mid, moivebook.cpid);
window.onresize = function () {
    if (moivebook.showVideoE != "000") {
        var player = document.getElementById("myplayer").offsetWidth;
        var scale = _Utils2.default.scaleImage(player);
        var w = moivebook.videoEWidth * scale + "px";
        var h = moivebook.videoEheight * scale + "px";
        var t = document.getElementById("myplayer").offsetHeight * moivebook.videoETop + "px";
        var l = document.getElementById("myplayer").offsetWidth * moivebook.videoELeft + "px";
        document.getElementById(moivebook.showVideoE).style.setProperty("width", w);
        document.getElementById(moivebook.showVideoE).style.setProperty("height", h);
        document.getElementById(moivebook.showVideoE).style.setProperty("left", l);
        document.getElementById(moivebook.showVideoE).style.setProperty("top", t);
        console.log(w, h, l, t);
    }
};

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PICSprite = function () {
    function PICSprite() {
        _classCallCheck(this, PICSprite);
    }

    _createClass(PICSprite, [{
        key: "addedPicSprite",
        value: function addedPicSprite(data, div) {
            var showTimeArray = new Array();
            var closeTimeArray = new Array();

            for (var index = 0; index < data.length; index++) {
                var image = document.createElement("img");
                image.id = parseInt(data[index].start_time);
                var end = parseInt(data[index].start_time) + parseInt(data[index].time);
                image.setAttribute("class", end);
                image.src = "http://test.videoyi.cn" + data[index].corner_img;
                var top = document.getElementById("myplayer").offsetHeight * (data[index].y / 100) + "px";
                var left = document.getElementById("myplayer").offsetWidth * (data[index].x / 100) + "px";
                var scale = _Utils2.default.scaleImage(document.getElementById("myplayer").offsetWidth);
                var w = image.width * scale + "px";
                var h = image.height * scale + "px";
                moivebook.videoEWidth = image.width;
                moivebook.videoEheight = image.height;
                console.log(top, left, w, h);
                image.style.setProperty("position", "absolute");
                image.style.setProperty("top", top);
                image.style.setProperty("left", left);
                image.width = w;
                image.height = h;
                image.style.setProperty("display", "none");
                div.appendChild(image);
                showTimeArray.push(parseInt(data[index].start_time));
                closeTimeArray.push(parseInt(data[index].start_time) + parseInt(data[index].time));
            }
            setInterval(function () {

                var time = parseInt(moivebook.time);
                var count = -1;
                if (closeTimeArray.indexOf(time) != -1) {
                    count = closeTimeArray.indexOf(time);
                    document.getElementsByClassName(closeTimeArray[count])[0].style.setProperty("display", "none");
                }
                if (showTimeArray.indexOf(time) != -1) {
                    count = showTimeArray.indexOf(time);
                    document.getElementById(showTimeArray[count]).style.setProperty("display", "block");
                    moivebook.showVideoE = showTimeArray[count];
                    moivebook.videoETop = document.getElementById(showTimeArray[count]).style.getPropertyValue("top").replace("px", "") / document.getElementById("myplayer").offsetHeight;
                    moivebook.videoELeft = document.getElementById(showTimeArray[count]).style.getPropertyValue("left").replace("px", "") / document.getElementById("myplayer").offsetWidth;
                }
            }, 1000);
        }
    }]);

    return PICSprite;
}();

exports.default = PICSprite;

/***/ })

/******/ });
webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Display = __webpack_require__(2);

var _Display2 = _interopRequireDefault(_Display);

var _Control = __webpack_require__(3);

var _Control2 = _interopRequireDefault(_Control);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function Main(div, url) {
    _classCallCheck(this, Main);

    var _div = document.getElementById(div);
    var _url = url;
    var control = new _Control2.default(_div);
    var display = new _Display2.default(_div, _url);
};

var p = new Main(core, source);
document.addEventListener("fullscreenchange", function (e) {
    console.log("fullscreenchange", e);
});
document.addEventListener("mozfullscreenchange", function (e) {
    if (document.mozIsFullScreen) {
        document.getElementById("fullButton").setAttribute("class", "screenFull");
    } else {
        document.getElementById("fullButton").setAttribute("class", "fullScreen");
    }
});
document.addEventListener("webkitfullscreenchange", function (e) {
    if (document.webkitIsFullScreen) {

        document.getElementById("fullButton").setAttribute("class", "fullScreen");
    } else {
        document.getElementById("fullButton").setAttribute("class", "screenFull");
    }
});
document.addEventListener("msfullscreenchange", function (e) {
    console.log("msfullscreenchange", e);
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Display = function Display(div, url) {
    _classCallCheck(this, Display);

    addedVideo(div, url);
};

function addedVideo(div, url) {
    var _div = div;
    var _url = url;
    var video = document.createElement("video");
    video.id = 'myplayer';
    video.setAttribute("width", "100%");
    video.setAttribute("height", "100%");
    //video.controls = false;
    video.autoplay = true;
    video.src = _url;
    video.setAttribute("oncontextmenu", "return false;");
    video.addEventListener("canplay", oncanplayHandler);
    video.addEventListener("loadedmetadata", metadataHandler);
    video.addEventListener("timeupdate", timeUpdateHandler);
    video.addEventListener("error", errorHandler);
    video.addEventListener("click", videoClickHandler);
    video.addEventListener("dblclick", videodblHandler);
    video.addEventListener("progress", progressHandler);
    video.addEventListener("waiting", waitingHandler);
    _div.appendChild(video);
}

function oncanplayHandler(event) {
    console.log(event.target.oncanplay);
}
function metadataHandler(event) {
    var duration = "/" + _Utils2.default.timeFormat(event.target.duration);
    document.getElementById("durationTime").innerText = duration;
}
function timeUpdateHandler(event) {
    var time = _Utils2.default.timeFormat(event.target.currentTime);
    document.getElementById("currentTime").innerText = time;
    var playLenght = 100 * event.target.currentTime / event.target.duration;
    document.getElementById("processPlay").style.width = playLenght + "%";
    document.getElementById("processButton").style.left = playLenght * document.getElementById("player").offsetWidth / 100 - 12 + "px";
    moivebook.time = event.target.currentTime;
}
function errorHandler(event) {
    console.log(event.target.onerror);
}
var intervalTimer = null;
function videoClickHandler(event) {
    clearTimeout(intervalTimer);
    intervalTimer = setTimeout(function () {
        if (event.target.paused) {
            event.target.play();
            document.getElementById("playPasue").setAttribute("class", "pasueButton");
            document.getElementById("playPasue").innerText = "||";
        } else {
            event.target.pause();
            document.getElementById("playPasue").setAttribute("class", "playButton");
            document.getElementById("playPasue").innerText = "";
        }
    }, 300);
}
function videodblHandler(event) {
    clearTimeout(intervalTimer);
    displayFullHandler();
}
function progressHandler(event) {
    var buffLength = void 0;
    if (event.target.buffered.length != 0) {
        buffLength = 100 * event.target.buffered.end(0) / event.target.duration;
    }
    document.getElementById("processLoad").style.width = buffLength + "%";
}
function waitingHandler(event) {
    console.log("waiting...");
}
function displayFullHandler() {
    var element = document.documentElement;
    if (document.webkitIsFullScreen) {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } else {

        if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.requestFullscreen) {
            element.requestFullscreen();
        } else {
            element.mozRequestFullScreen();
        }
    }
}
exports.default = Display;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _PlayToggle = __webpack_require__(4);

var _PlayToggle2 = _interopRequireDefault(_PlayToggle);

var _Forward = __webpack_require__(5);

var _Forward2 = _interopRequireDefault(_Forward);

var _TimeDuration = __webpack_require__(6);

var _TimeDuration2 = _interopRequireDefault(_TimeDuration);

var _ControlRight = __webpack_require__(7);

var _ControlRight2 = _interopRequireDefault(_ControlRight);

var _ProcessBar = __webpack_require__(14);

var _ProcessBar2 = _interopRequireDefault(_ProcessBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Control = function Control(div) {
    _classCallCheck(this, Control);

    addedControl(div);
};

function addedControl(div) {
    var control = document.createElement("div");
    var playToggle = new _PlayToggle2.default();
    var forward = new _Forward2.default();
    var timeDuration = new _TimeDuration2.default();
    var controlRight = new _ControlRight2.default();
    var processBar = new _ProcessBar2.default();
    control.id = "control";
    div.appendChild(control);
    playToggle.addedPlayPuase(control);
    forward.addedForward(control);
    timeDuration.addedTimeDuration(control);
    controlRight.addedControlRight(control);
    processBar.addedProcessBar(control);
}
exports.default = Control;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayToggle = function () {
    function PlayToggle() {
        _classCallCheck(this, PlayToggle);
    }

    _createClass(PlayToggle, [{
        key: "addedPlayPuase",
        value: function addedPlayPuase(_div) {
            var div = document.createElement("div");
            div.setAttribute("class", "toggleControl");
            var a = document.createElement("a");
            a.setAttribute("class", "toggleHerf");
            var i = document.createElement("i");
            i.id = "playPasue";
            i.setAttribute("class", "pasueButton");
            i.innerText = "||";
            i.addEventListener("click", clickHandler);
            a.appendChild(i);
            div.appendChild(a);
            _div.appendChild(div);
        }
    }]);

    return PlayToggle;
}();

function clickHandler(event) {
    var video = document.getElementById("myplayer");
    console.log(video.paused);
    if (video.paused) {
        video.play();
        event.target.setAttribute("class", "pasueButton");
        event.target.innerText = "||";
    } else {
        video.pause();
        event.target.setAttribute("class", "playButton");
        event.target.innerText = "";
    }
}
exports.default = PlayToggle;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Forward = function () {
    function Forward() {
        _classCallCheck(this, Forward);
    }

    _createClass(Forward, [{
        key: "addedForward",
        value: function addedForward(_div) {
            var div = document.createElement("div");
            var arrow = document.createElement("a");
            var line = document.createElement("a");
            div.setAttribute("class", "forwardControl");
            arrow.setAttribute("class", "forwardArrow");
            line.setAttribute("class", "forwardLine");
            div.appendChild(arrow);
            div.appendChild(line);
            _div.appendChild(div);
            arrow.addEventListener("mouseover", function () {
                setAttributes(arrow, "forwardArrowHover");
                setAttributes(line, "forwardLineHover");
            });
            arrow.addEventListener("mouseout", function () {
                setAttributes(arrow, "forwardArrow");
                setAttributes(line, "forwardLine");
            });
            line.addEventListener("mouseover", function () {
                setAttributes(arrow, "forwardArrowHover");
                setAttributes(line, "forwardLineHover");
            });
            line.addEventListener("mouseout", function () {
                setAttributes(arrow, "forwardArrow");
                setAttributes(line, "forwardLine");
            });
        }
    }]);

    return Forward;
}();

function setAttributes(obj, value) {
    obj.setAttribute("class", value);
}
exports.default = Forward;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeDuration = function () {
    function TimeDuration() {
        _classCallCheck(this, TimeDuration);
    }

    _createClass(TimeDuration, [{
        key: "addedTimeDuration",
        value: function addedTimeDuration(_div) {
            var div = document.createElement("div");
            var time = document.createElement("span");
            var duration = document.createElement("span");
            div.id = "timeDuration";
            time.id = "currentTime";
            duration.id = "durationTime";
            time.innerText = "00:00";
            duration.innerText = "/99:99";
            div.appendChild(time);
            div.appendChild(duration);
            _div.appendChild(div);
        }
    }]);

    return TimeDuration;
}();

exports.default = TimeDuration;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Clarty = __webpack_require__(8);

var _Clarty2 = _interopRequireDefault(_Clarty);

var _Voice = __webpack_require__(10);

var _Voice2 = _interopRequireDefault(_Voice);

var _WebFull = __webpack_require__(12);

var _WebFull2 = _interopRequireDefault(_WebFull);

var _ScreenFull = __webpack_require__(13);

var _ScreenFull2 = _interopRequireDefault(_ScreenFull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ControlRight = function () {
    function ControlRight() {
        _classCallCheck(this, ControlRight);
    }

    _createClass(ControlRight, [{
        key: "addedControlRight",
        value: function addedControlRight(div) {
            var controlRight = document.createElement("div");
            var ul = document.createElement("ul");
            var clarty = new _Clarty2.default();
            var voice = new _Voice2.default();
            var webFull = new _WebFull2.default();
            var screenFull = new _ScreenFull2.default();
            clarty.addedClarty(ul);
            voice.addedVoice(ul);
            webFull.addedWebFull(ul);
            screenFull.addedScreenFull(ul);
            controlRight.id = "controlRight";
            controlRight.setAttribute("class", "controlRight");
            controlRight.appendChild(ul);
            div.appendChild(controlRight);
        }
    }]);

    return ControlRight;
}();

exports.default = ControlRight;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClartyPanel = __webpack_require__(9);

var _ClartyPanel2 = _interopRequireDefault(_ClartyPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Clarty = function () {
    function Clarty() {
        _classCallCheck(this, Clarty);
    }

    _createClass(Clarty, [{
        key: "addedClarty",
        value: function addedClarty(ul) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var span = document.createElement("span");
            var div = document.createElement("div");
            div.id = "clarty";
            div.addEventListener("mouseover", clartyMouseOverHandler);
            div.addEventListener("mouseout", clartyMouseOutHandler);
            div.setAttribute("class", "clarty");
            span.innerText = "高清";
            span.id = "clartyText";
            a.setAttribute("class", "streamText");
            a.appendChild(span);
            li.appendChild(a);
            li.appendChild(div);
            ul.appendChild(li);
            a.addEventListener("click", function () {
                div.setAttribute("class", "clartyblack");
            });
            var clartyPanel = new _ClartyPanel2.default();
            clartyPanel.addedClartyPanel(div);
        }
    }]);

    return Clarty;
}();

function clartyMouseOverHandler(event) {
    document.getElementById("clarty").setAttribute("class", "clartyblack");
}
function clartyMouseOutHandler(event) {
    document.getElementById("clarty").setAttribute("class", "clarty");
}
exports.default = Clarty;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClartyPanel = function () {
    function ClartyPanel() {
        _classCallCheck(this, ClartyPanel);
    }

    _createClass(ClartyPanel, [{
        key: "addedClartyPanel",
        value: function addedClartyPanel(div) {
            var array = ["p1080", "p720", "p640", "p480", "p320"];
            for (var i = 0; i < array.length; i++) {
                var a = document.createElement("a");
                switch (array[i]) {
                    case "p1080":
                        a.innerText = "1080p";
                        break;
                    case "p720":
                        a.innerText = "720p";
                        break;
                    case "p640":
                        a.innerText = "高清";
                        break;
                    case "p480":
                        a.innerText = "流畅";
                        break;
                    case "p320":
                        a.innerText = "极速";
                        break;
                }
                a.setAttribute("class", "clartyA");
                a.addEventListener("click", clartyTextHandler);
                div.appendChild(a);
            }
        }
    }]);

    return ClartyPanel;
}();

function clartyTextHandler(event) {
    var text = void 0;
    switch (event.target.innerText) {
        case '1080p':
            text = '1080p';
            break;
        case '720p':
            text = '720p';
            break;
        case '高清':
            text = '高清';
            break;
        case '流畅':
            text = '流畅';
            break;
        case '极速':
            text = '极速';
            break;
    }
    document.getElementById("clartyText").innerText = text;
    document.getElementById("clarty").setAttribute("class", "clarty");
}
exports.default = ClartyPanel;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _VoicePanel = __webpack_require__(11);

var _VoicePanel2 = _interopRequireDefault(_VoicePanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Voice = function () {
    function Voice() {
        _classCallCheck(this, Voice);
    }

    _createClass(Voice, [{
        key: "addedVoice",
        value: function addedVoice(ul) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var i = document.createElement("i");
            var voiceBox = document.createElement("div");
            var voicePanel = new _VoicePanel2.default();
            voiceBox.id = "voiceBox";
            voiceBox.setAttribute("class", "voiceBox");
            voicePanel.addedVoicePanel(voiceBox);
            i.setAttribute("class", "voiceMax");
            a.setAttribute("class", "liHerf");
            a.appendChild(i);
            a.addEventListener("click", voiceClickHandler);
            li.appendChild(a);
            li.appendChild(voiceBox);
            ul.appendChild(li);
        }
    }]);

    return Voice;
}();

function voiceClickHandler(event) {
    document.getElementById("voiceBox").style.setProperty("display", "block");
}
exports.default = Voice;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mouseDown = false;

var VoicePanel = function () {
    function VoicePanel() {
        _classCallCheck(this, VoicePanel);
    }

    _createClass(VoicePanel, [{
        key: "addedVoicePanel",
        value: function addedVoicePanel(div) {
            var voiceIcon = document.createElement("div");
            voiceIcon.id = "voiceIcon";
            voiceIcon.setAttribute("class", "voiceIcon");
            var voiceTrack = document.createElement("div");
            voiceTrack.id = "voiceTrack";
            voiceTrack.setAttribute("class", "voiceTrack");
            var voiceSilder = document.createElement("div");
            voiceSilder.id = "voiceSilder";
            voiceSilder.setAttribute("class", "voiceSilder");
            div.addEventListener("mousemove", voiceBoxMoveHandler);
            voiceSilder.addEventListener("mousedown", silderDownHandler);
            window.addEventListener("mouseup", windowUpHandler);
            window.addEventListener("mousemove", windowMoveHandler);
            voiceIcon.appendChild(voiceTrack);
            voiceIcon.appendChild(voiceSilder);
            div.appendChild(voiceIcon);
        }
    }]);

    return VoicePanel;
}();

function voiceBoxMoveHandler(event) {

    var up = document.getElementById("voiceIcon").getBoundingClientRect().top;
    var locY = window.event.y;
    var topValue = locY - up;
    var temp = void 0;
    var tempHight = void 0;
    if (mouseDown) {
        if (topValue > 0 && topValue <= 80) {
            temp = topValue - 3;
            temp = temp + "px";
            tempHight = 80 - topValue + "px";
            //console.log("voice max:>",(80-topValue) / 80);
            document.getElementById("voiceSilder").style.setProperty("top", temp);
            document.getElementById("voiceTrack").style.setProperty("height", tempHight);
            document.getElementById("myplayer").volume = (80 - topValue) / 80;
        }
    }
}
function silderDownHandler(event) {
    mouseDown = true;
    console.log(mouseDown);
}

function windowUpHandler(event) {
    mouseDown = false;
}
function windowMoveHandler(event) {
    var mouseX = window.event.x;
    var mouseY = window.event.y;
    if (document.getElementById("voiceBox").style.getPropertyValue("display") == "block") {
        var top = document.getElementById("control").offsetTop - 108;
        var bottom = top + 150;
        var left = document.getElementById("voiceBox").offsetLeft + 10;
        var right = left + 40;
        if (mouseX < left || mouseX > right) {
            document.getElementById("voiceBox").style.setProperty("display", "none");
        }
        if (mouseY < top || mouseY > bottom) {
            document.getElementById("voiceBox").style.setProperty("display", "none");
        }
    }

    if (document.getElementById("clarty").className == "clartyblack") {
        var topPanl = document.getElementById("control").offsetTop - 150;
        var bottomPanl = topPanl + 188;
        var leftPanl = document.getElementById("clartyText").offsetLeft - 10;
        var rightPanl = leftPanl + 60;
        if (mouseY < topPanl || mouseY > bottomPanl) {
            document.getElementById("clarty").setAttribute("class", "clarty");
        }
        if (mouseX < leftPanl || mouseX > rightPanl) {
            document.getElementById("clarty").setAttribute("class", "clarty");
        }
    }
}
exports.default = VoicePanel;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebFull = function () {
    function WebFull() {
        _classCallCheck(this, WebFull);
    }

    _createClass(WebFull, [{
        key: "addedWebFull",
        value: function addedWebFull(ul) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var i = document.createElement("i");
            i.setAttribute("class", "webFull");
            a.setAttribute("class", "liHerf");
            a.appendChild(i);
            li.appendChild(a);
            ul.appendChild(li);
        }
    }]);

    return WebFull;
}();

exports.default = WebFull;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScreenFull = function () {
    function ScreenFull() {
        _classCallCheck(this, ScreenFull);
    }

    _createClass(ScreenFull, [{
        key: "addedScreenFull",
        value: function addedScreenFull(ul) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var i = document.createElement("i");
            i.id = "fullButton";
            i.setAttribute("class", "screenFull");
            i.addEventListener("click", screenFullHandler);
            a.setAttribute("class", "liHerf");
            a.appendChild(i);
            li.appendChild(a);
            ul.appendChild(li);
        }
    }]);

    return ScreenFull;
}();

function screenFullHandler(event) {
    var element = document.documentElement;
    if (document.webkitIsFullScreen) {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } else {

        if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.requestFullscreen) {
            element.requestFullscreen();
        } else {
            element.mozRequestFullScreen();
        }
    }
}
exports.default = ScreenFull;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var array = ["processBox", "processLoad", "processPlay", "processButton"];

var ProcessBar = function () {
    function ProcessBar() {
        _classCallCheck(this, ProcessBar);
    }

    _createClass(ProcessBar, [{
        key: "addedProcessBar",
        value: function addedProcessBar(div) {
            var processBox = document.createElement("div");
            processBox.id = "processBox";
            for (var i = 1; i < array.length; i++) {
                var _div = document.createElement("div");
                _div.id = array[i];
                _div.addEventListener("mouseover", divOverHandler);
                _div.addEventListener("mouseout", divOutHandler);
                _div.addEventListener("click", processClickHandler);
                processBox.appendChild(_div);
            }
            processBox.addEventListener("mouseover", divOverHandler);
            processBox.addEventListener("mouseout", divOutHandler);
            processBox.addEventListener("click", processClickHandler);
            div.appendChild(processBox);
        }
    }]);

    return ProcessBar;
}();

function divOverHandler(event) {
    for (var i = 0; i < array.length - 1; i++) {
        document.getElementById(array[i]).style.setProperty("height", "16px");
    }
    document.getElementById("processButton").style.setProperty("opacity", "1");
}
function divOutHandler(event) {
    for (var i = 0; i < array.length - 1; i++) {
        document.getElementById(array[i]).style.setProperty("height", "2px");
    }
    document.getElementById("processButton").style.setProperty("opacity", "0");
}
function processClickHandler(event) {
    var position = (event.pageX - document.getElementById("processBox").offsetLeft) / document.getElementById("processBox").offsetWidth;
    var video = document.getElementById("myplayer");
    document.getElementById("processPlay").style.width = position * document.getElementById("processBox").offsetWidth;
    document.getElementById("processButton").style.left = document.getElementById("processPlay").offsetWidth - 12 + "px";
    video.currentTime = position * video.duration;
    video.play();
}

exports.default = ProcessBar;

/***/ })
],[1]);
var container, stats;
let wam;
let media = 'video';
let jsActive = true;
let jsCanvasOn = true;
let playing = true;
let filter = 'Normal', prevFilter;
let frameNum;
let slowSpeed = 0.5, fastSpeed = 2;
let t0, t1 = Infinity, t2, t3 = Infinity, line1, line2;

let cw, ch;

var Module = {};


loadWASM()
.then(module => {
    wam = module;
}).catch((err) => {
    console.log('Error in fetching module:', err);
}).then(() => {
    window.onload = (() => {
        // createStats();
        addButtons();
        // graphStats();
        appendWasmCheck();

        addStats();

        // playToggle();

        // draw();
        // setTimeout(draw, 3000);

        timeData();

        // loadVideo();
    })();
});

// function loadVideo() {

// wasm video
    var vid = document.getElementById('v');
    var canvas = document.getElementById('c');
    var context = canvas.getContext('2d');
    vid.addEventListener("loadeddata", function() {
        canvas.setAttribute('height', vid.videoHeight);
        canvas.setAttribute('width', vid.videoWidth);
        cw = canvas.clientWidth;// usually same as canvas.width
        ch = canvas.clientHeight;
        // draw();
        // timeData();
    });
// }


function printMess()
{
    console.log("--------------------May I ? -------------")
}

function loadWASM()
{
    return new Promise((resolve, reject) => {
        if (!('WebAssembly' in window)) {
            console.log('Couldn\'t load WASM!');
            reject(error);
        }
        else {
            // fetch('lib/webdsp0.wasm')
            fetch('lib/webdsp_c.wasm')
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    Module.wasmBinary = buffer;
                    script = document.createElement('script');
                    doneEvent = new Event('done');
                    script.addEventListener('done', buildWam);
                    // let wam = buildWam();
                    // resolve(wam);

                    // script.src = './lib/webdsp0.js';
                    script.src = './lib/webdsp_c.js';
                    document.body.appendChild(script);

                    function buildWam() {
                        console.log('Emscripten boilerplate loaded.');
                        const wam = {};
                        wam.sobelFilter = function (pixelData, width, height, invert = false) {
                            const len = pixelData.length;
                            const mem = _malloc(len);
                            HEAPU8.set(pixelData, mem);
                            _sobelFilter(mem, width, height, invert);
                            const filtered = HEAPU8.subarray(mem, mem + len);
                            _free(mem);
                            return filtered;
                        };
                        resolve(wam);
                        // return wam;
                    }
                })
        }
    });
}





function draw() {
    if (vid.paused)
        return false;
    stats.begin();
    context.drawImage(vid, 0, 0);
    pixels = context.getImageData(0, 0, vid.videoWidth, vid.videoHeight);
    if(filter !== 'Normal') {
        setPixels(filter, 'wasm');
    }
    context.putImageData(pixels, 0, 0);
    // if(stats)
    stats.end();
    frameNum = requestAnimationFrame(draw);
    // console.log("current frameNum is " + frameNum);
    // stats.update();
    // stats.end();
}



function playToggle () { // does both vids together
    if (vid.paused) {
        document.getElementById('playImg').setAttribute('src', 'img/pause1.svg');
        vid.play();
        draw();
    }
    else
    {
        document.getElementById('playImg').setAttribute('src', 'img/play1.svg');
        vid.pause();
    }

}


function rewind() {
    vid.currentTime = vid.currentTime - 5 > 0 ? vid.currentTime - 5 : 0;

}

function fastForward() {
    vid.currentTime = vid.currentTime + 5 > vid.duration ? vid.duration : vid.currentTime + 5;

}


function timeData() {
    let vidTime = document.getElementById('vidTime');
    function getTimeCode(microseconds) {
        let hours = Math.floor(microseconds / 3600);
        if (hours < 10)
            hours = '0' + hours;
        let minutes = Math.floor((microseconds % 3600) / 60);
        if (minutes < 10)
            minutes = '0' + minutes;
        let seconds = Math.floor((microseconds % 3600) % 60);
        if (seconds < 10)
            seconds = '0' + seconds;
        let intSeconds = Math.floor(microseconds);
        let millseconds1 = microseconds - intSeconds;
        let millseconds2 = String(millseconds1).slice(2, 4);
        // return result = '${String(hours)} : {String(minutes)}'
            return result = hours+':'+minutes+':'+seconds+':'+millseconds2;

    }

    // add thing for frameNum;
    vidTime.innerHTML = getTimeCode(vid.currentTime);
    setTimeout(timeData, 15);
}

function addButtons(filtersArr) {
    const filters = ['Normal', 'Super Edge', 'Super Edge Inv'];
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'filters';
    const editor = document.getElementById('editor');
    editor.insertBefore(buttonDiv, editor.firstChild);

    for (let i = 0; i < filters.length; i++) {
        let filterDiv = document.createElement('div');
        filterDiv.className = 'indFilter';
        filterDiv.innerText = filters[i];
        filterDiv.addEventListener('click', function() {
            filter = filters[i];
            // remove any that have it;
            if (document.getElementsByClassName('slectedFilter')[0])
            {
                document.getElementsByClassName('selectedFilter')[0].classList.remove('selectedFilter');
            }
            this.classList.add('selectedFilter');
        });
        buttonDiv.appendChild(filterDiv);
    }
}

function appendWasmCheck() {
    let p = document.createElement('p');
    p.className = 'wasmCheck';
    let before = document.getElementById('editor');
    if ('WebAssembly' in window) {
        p.innerHTML = '(\u2713 WebAssembly is supported in your browser)';
        document.body.insertBefore(p, before);
    }
    else if (/Mobi/.test(navigator.userAgent)) {
        document.getElementById('statsContainer').innerHTML = `<h3 style="color:#a37c6e;">\u2639 WEbAssembly is not yet supported on mobile devices. Please view on desktop browser.</h3>`
    }
    else {
        document.getElementById('statsContainer').innerHTML = `<h3 style="color:#a37c6e;">\u2639 WEbAssembly is not supported in your browser. Please update to the latest version of Chrome or Firefox to enable WebAssembly.</h3>`
    }

}

function addStats() {
    // container = document.createElement( 'div' );
    container = document.getElementById('middle-col');
    // document.body.appendChild( container );
    stats = new Stats();
    container.appendChild( stats.dom );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = document.querySelector('#c').offsetLeft+'px';
    stats.domElement.style.top = document.querySelector('#c').offsetTop+'px';
}

function setPixels (filter, language) {
    if (language === 'wasm') {
        let kernel, divisor;
        switch (filter) {
            case 'Super Edge':
                pixels.data.set(wam.sobelFilter(pixels.data, cw, ch));
                // pixels.data.set(sobelFilter(pixels.data, cw, ch));
                // pixels.data.set(window.testwam.sobelFilter(pixels.data, cw, ch));

                break;
            case 'Super Edge Inv':
                pixels.data.set(wam.sobelFilter(pixels.data, cw, ch, true));
                // pixels.data.set(sobelFilter(pixels.data, cw, ch, true));
                // pixels.data.set(window.testwam.sobelFilter(pixels.data, cw, ch, true));
                break;
        }
    }
}

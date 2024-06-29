
"use strict";

var planeVertexShaderSource1 = `
    attribute vec4 a_position;
    // uniform vec2 u_resolution;
    
    uniform mat4 u_matrix;
    
    void main() {
        gl_Position = u_matrix * a_position;
    }
    

`;

var planeFragmentShaderSource1 = `
    precision mediump float;
    
    void main() {
        // gl_FragColor = vec4(0.2, 0, 0.5, 0.2);// return redish-purple
        gl_FragColor = vec4(1, 0, 0.5, 0.2);// return redish-purple
    }
    
`;


var cubeVertexShaderSource1 = `
  uniform mat4 u_worldViewProjection;
  uniform vec3 u_lightWorldPos;
  uniform mat4 u_world;
  uniform mat4 u_viewInverse;
  uniform mat4 u_worldInverseTranspose;

  attribute vec4 a_position;
  attribute vec3 a_normal;

  varying vec4 v_position;
  varying vec2 v_texCoord;
  varying vec3 v_normal;
  varying vec3 v_surfaceToLight;
  varying vec3 v_surfaceToView;

  void main() {
    v_position = (u_worldViewProjection * a_position);
    v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
    v_surfaceToLight = u_lightWorldPos - (u_world * a_position).xyz;
    v_surfaceToView = (u_viewInverse[3] - (u_world * a_position)).xyz;
    gl_Position = v_position;
   
  }
`;

var cubeFragmentShaderSource1 = `
  precision mediump float;

  varying vec4 v_position;
  varying vec3 v_normal;
  varying vec3 v_surfaceToLight;
  varying vec3 v_surfaceToView;

  uniform vec4 u_lightColor;
  uniform vec4 u_ambient;
  uniform vec4 u_diffuse;
  uniform vec4 u_specular;
  uniform float u_shininess;
  uniform float u_specularFactor;
  uniform vec4 u_fogColor;
  uniform float u_fogNear;
  uniform float u_fogFar;

  vec4 lit(float l ,float h, float m) {
    return vec4(1.0,
                abs(l),
                (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
                1.0);
  }

  void main() {
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(u_fogNear, u_fogFar, depth);
    vec4 diffuseColor = u_diffuse;
    vec3 a_normal = normalize(v_normal);
    vec3 surfaceToLight = normalize(v_surfaceToLight);
    vec3 surfaceToView = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLight + surfaceToView);
    vec4 litR = lit(dot(a_normal, surfaceToLight),
                      dot(a_normal, halfVector), u_shininess);
    vec4 outColor = vec4((
    u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient +
                  u_specular * litR.z * u_specularFactor)).rgb,
        diffuseColor.a);
    gl_FragColor = mix(outColor, u_fogColor, fogFactor);
  }
`;

var boujouDataURL = "src_files/data/t3/res.txt";

var renderer1, scene1, camera1, banana;

var renderer2, scene2, camera2;

var curFrame;

var boujouDataStr = "";
var boujouData = [];
var boujouFramesDataStr = "";
var boujouFramesData = [];

var boujouPointsDataStr = "";
var boujouPointsData = [];


var boujouCameraModelDataStr = "";
var boujouCameraModelData = [];
var boujouCameraModelDataStr = "";
var boujouCameraModelData = [];

var boujouCameraModelVerticesDataStr = "";
var boujouCameraModelVerticesData = [];

var boujouCameraModelNormalsDataStr = "";
var boujouCameraModelNormalsData = [];

var isMouseDown = false;
var lastMouseX = null;
var lastMouseY= null;


var aspect1, aspect2;

var threeCameraTarget1 = [0, 0, 0];
var threeCameraUp1 = [0, 1, 0];

var threeCameraTarget2 = [0, 0, 0];
var threeCameraUp2 = [0, 1, 0];

// --------------------------------------------- free camera1 --------------------------------------------------

var freeCameraOrbitRadius = 2500;
// var orbitRadius = 60;


// var freeCameraPosition = [0, 0, freeCameraOrbitRadius];
var freeCameraPosition = [-200, 0, freeCameraOrbitRadius];
var freeCameraTarget = [0, 0, 0];
var freeCameraUp = [0, 1, 0];
var freeCameraRotationX = Math.PI/30;
var freeCameraRotationY = -Math.PI/9;

var lastFreeCameraRotationX = Math.PI/30;
var lastFreeCameraRotationY = -Math.PI/9;

var freeCameraOrbitTime;
var freeCameraMatrix;
var freeCameraViewMatrix;
var freeCameraProjectionMatrix;
var freeCameraViewProjectionMatrix;


var freeCameraAngleRadians = degToRad(0);
var freeCameraFieldOfView = 40;
var freeCameraFieldOfViewRadians = degToRad(40);
var freeCameraHeight = 40;
var freeCameraZNear = 0.1;
// var zFar  = 150;
var freeCameraZFar  = 100000;

const worldScaleFactor = 600;
// ------------------------------------------- plane -----------------------------------//
// plane in gl1--------------------------------------------------->>

var planeBufferInfo1;

var planeProgramInfo1;

var planeProgram1;

var planePositionAttributeLocation1;

// var planeResolutionUniformLocation1;

var planePositionBuffer1;



var planePositions;

var planeTranslationArr = [0, 0, -600];
// var planeTranslationArr = [0, 0, 0];

var planeMatrixLocation1;

var planeViewMatrix1;

// plane in gl2--------------------------------------------------->>

var planeProgram2;

var planePositionAttributeLocation2;

// var planeResolutionUniformLocation1;

var planePositionBuffer2;

var planeMatrixLocation2;

var planeViewMatrix2;

// --------------------------------- cube -----------------------------------------//

var cubeBufferInfo1;// in canvas1

var cubeProgramInfo1;// in canvas1

var cubeBufferInfo2;// in canvas2

var cubeProgramInfo2;// in canvas2

// -------------------------------- boujou camera1 model---------------------------------------//
var boujouCameraModelProgram1;

var boujouCameraModelPositionAttributeLocation1;

var boujouCameraModelPostionBuffer1;

var boujouCameraModelPositions1 = [];

var boujouCameraOriginPosition;

var boujouCameraOriginRotation;

var originalBoujouCameraRotateMatrix;

var curBoujouCameraRotateMatrix;

// -------------------------------- boujou camera1 ---------------------------------------//

var boujouCameraAspect;

// 全画幅相机传感器尺寸为36mmx24mm
var boujouCameraCMOSWidth = 36;
var boujouCameraCMOSHeight = 24;
// const boujouCameraCMOSHeight = 12;
// const boujouCameraCMOSHeight = 10;
// const boujouCameraCMOSHeight = 8;
// const boujouCameraCMOSHeight = 11.3175;


// boujou相机焦距（F(mm)）
var boujouCameraFocalLength;

// var boujouCameraPosition = [-200, 0, boujouCameraOrbitRadius];
var boujouCameraTarget = [0, 0, 0];
var boujouCameraUp = [0, 1, 0];
// var boujouCameraPosition;
var boujouCameraRotationX = Math.PI/30;
var boujouCameraRotationY = Math.PI/9;
var boujouCameraOrbitTime;
var orginalBoujouCameraMatrix;
var boujouCameraMatrix;
var boujouCameraViewMatrix;
var boujouCameraProjectionMatrix;
var boujouCameraViewProjectionMatrix;


var boujouCameraAngleRadians = degToRad(0);
/*视场角：
* 计算公式：
* tan(fov/2) = (h/2) / f    ==> fov/2 = arctan((h/2) / f )   ==> fov = 2 * arctan((h/2) / f );
*
* */
var boujouCameraFieldOfView;
// var boujouCameraFieldOfViewRadians = degToRad(40);
var boujouCameraFieldOfViewRadians;
var boujouCameraHeight = 40;
var boujouCameraZNear = 0.1;
// var zFar  = 150;
var boujouCameraZFar  = 10000;

// -------------------------------------------------------------------------------------------------------

let animationBegin = false;

let animationFrameCount = 1;


var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

/*
planePositions = [
    -800, -600, 0,
    800, -600, 0,
    -800, 600, 0,
    -800, 600, 0,
    800, -600, 0,
    // 400, 300
    800, 600, 0
];*/

planePositions = [
    -500, -600, 0,
    500, -600, 0,
    -800, 600, 0,
    -800, 600, 0,
    500, -600, 0,
    // 400, 300
    800, 600, 0
];

/*planePositions = [
    -80, -60, 0,
    80, -60, 0,
    -80, 60, 0,
    -80, 60, 0,
    80, -60, 0,
    // 40, 30
    80, 60, 0
];*/


var boujouCameraModelNormals1 = [];

// var boujouCameraModelTranslationArr1 = [0, 0, -100];
var boujouCameraModelTranslationArr1 = [0, 0, 0];

var boujouCameraModelMatrixLocation1;

var boujouCameraModelViewMatrix;


// var container = document.getElementById("container");
// var isCanvas = (container instanceof HTMLCanvasElement);
var canvas1; // = document.getElementById("scene1");
var canvas2; // = document.getElementById("boujouScene");
// canvas1.width = 1600;
// canvas1.height = 900;

var gl1;

var gl2; //= canvas2.getContext("webgl", {alpha: false});
// gl2.enable(gl2.CULL_FACE);
// gl2.enable(gl2.DEPTH_TEST);

// canvas1.onmousedown = MouseDownHandler;
document.onmouseup = MouseUpHandler;
document.onmousemove = MouseMoveHandler;

// addMouseWheelEvent(canvas1, MouseWheelHandler);

// var gl1 = canvas1.getContext("webgl", { alpha: false });



// gl1.enable(gl1.CULL_FACE);
// gl1.enable(gl1.DEPTH_TEST);

function degToRad(d) {
    return d * Math.PI / 180;
}

function radToDeg(r) {
    return r * 180 / Math.PI;
}


var uniformsThatAreTheSameForAllObjects = {
    u_lightWorldPos:         [-50, 30, 100],
    u_viewInverse:           m4.identity(),
    u_lightColor:            [3, 3, 3, 3],
    u_fogColor:              [1, 1, 1, 1],
    u_fogNear:               freeCameraZNear + (freeCameraZFar - freeCameraZNear) * 0.33,
    u_fogFar:                freeCameraZFar,
};

var uniformsThatAreComputedForEachObject = {
    u_worldViewProjection:   m4.identity(),
    u_world:                 m4.identity(),
    u_worldInverseTranspose: m4.identity(),
};

var materialUniforms = {
    u_ambient:               [0, 0, 0, 0],
    u_diffuse:               [0, 0, 0, 1],
    u_specular:              [1, 1, 1, 1],
    u_shininess:             100,
    u_specularFactor:        1,
};

// canvas1 = document.getElementById('scene1');
// var ww1 = window.innerWidth;
//     wh1 = window.innerHeight;

var ww1, ww2; // = canvas1.clientWidth;
var wh1, wh2; // = canvas1.clientHeight;

var directionalLight1;
var directionalLight2;
var directionalLight3;

var directionalLight4;
var directionalLight5;
var directionalLight6;

const pointLight1 = new THREE.PointLight(0xffffff);// blue;
const pointLight2 = new THREE.PointLight(0xffffff);// green;
const pointLight3 = new THREE.PointLight(0xffffff);// red;

const pointLight4 = new THREE.PointLight(0x0000ff);// blue;
const pointLight5 = new THREE.PointLight(0x00ff00);// green;
const pointLight6 = new THREE.PointLight(0xff0000);// red;

///------------------------------fot test only ----------------------------------------

/*const RADIUS = 50;
const SEGMENTS = 16;
const RINGS = 16;

const sphereMaterial = new THREE.MeshLambertMaterial(
    {
        color: 0xffffff
    }
);

const testSphere = new THREE.Mesh(
  new THREE.Sphere(
      RADIUS,
      SEGMENTS,
      RINGS
  ), sphereMaterial
);*/

var geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var mesh = new THREE.Mesh( geometry, material );

var map1;

var material1;

var objectMaterial1;







function boujouInit1(c1, c2) {
    var promise = new Promise(function(resolve, reject){
        canvas1 = c1;
        canvas2 = c2;

        /*gl2 = canvas2.getContext("webgl", {alpha: true});
        // gl2 = canvas2.getContext("webgl", {alpha: false});
        // gl2.enable(gl2.CULL_FACE);
        gl2.enable(gl2.DEPTH_TEST);*/

        canvas1.onmousedown = MouseDownHandler;
        addMouseWheelEvent(canvas1, MouseWheelHandler);

        ww1 = canvas1.clientWidth;
        wh1 = canvas1.clientHeight;



        renderer1 = new THREE.WebGLRenderer({
            // canvas1: document.getElementById('scene1'), alpha: true, premultipliedAlpha: true
            // canvas: document.getElementById('scene1')
            // canvas: c1, alpha: true, antialias: true
            canvas: c1, antialias: true

        });
        gl1 = renderer1.getContext();


        ww2 = canvas2.clientWidth;
        wh2 = canvas2.clientHeight;

        renderer2 = new THREE.WebGLRenderer({
            // canvas1: document.getElementById('scene1'), alpha: true, premultipliedAlpha: true
            // canvas: document.getElementById('scene1')
            canvas: c2, alpha: true, antialias: true
            // canvas: c2, antialias: true

        });
        gl2 = renderer2.getContext();

        initMaterials();

        loadOBJ().then(function(data){
            resolve(data);
        })
    });

    return promise;





}


function renewBoujouData(url) {
    boujouDataURL = boujouDataURL;
    reqData(boujouDataURL);
}



function reqData() {
    // var url = "http://testopen.videoyi.com/webs/glsl/demo/boujou/test1/data/t3/res.txt";
    // var url = "data/t3/res.txt";

    // var url = "src_files/data/123/123.txt";


    // var url = "src_files/data/t3/res.txt";
    // $.get(url, onGotBoujouData);

}

function reqModel() {
    // var url = "http://testopen.videoyi.com/webs/glsl/demo/boujou/test1/data/t3/res.txt";
    // var url = "data/t3/res.txt";
    // var url = "src_files/models/3/banana.obj";
    // var url = "src_files/models/3/banana2.obj";
    // var url = "src_files/models/4/chair.obj";
    // var url = "src_files/models/5/scene1.obj";
    var url = "src_files/models/3/sxj.obj";
    $.get(url, onGotCameraModelData);

}


function onGotBoujouData(data, status) {
    console.log("BoujouData == " + data);
    boujouDataStr = data;
    // boujouFramesData = getBoujouFramesData(boujouDataStr);
    // boujouPointsData = getBoujouPointsData(boujouDataStr);

    getBoujouCameraParameters(data);
    getBoujouFramesData(data);
    getBoujouPointsData(data);

    // reqModel();
    // renderthis();
    initScene();
    initBoujouScene();

}

function onGotCameraModelData(data, status) {
    console.log("ModelData == " + data);
    if (status == "success") {
        boujouCameraModelDataStr = data;

        getCameraModelVerticesData(data);
        getCameraModelNormalsData(data);
    }

    renderthis();
}

function initScene() {

    initRenderer1();

    initObject1();
    // -------------------------------------------------------init renderer2 ------------------------------------------------//



    initLights1();

    // loadOBJ();
}

function initRenderer1() {
    if (!gl1) {
        return;
    }

    // Compute the projection matrix
    aspect1 = gl1.canvas.clientWidth / gl1.canvas.clientHeight;

    renderer1.setSize(ww1, wh1);

    scene1 = new THREE.Scene();

    // camera1 = new THREE.PerspectiveCamera(50, ww1 / wh1, 0.1, 10000);
    camera1 = new THREE.PerspectiveCamera(freeCameraFieldOfView, aspect1, freeCameraZNear, freeCameraZFar);
    // camera1.position.set(0, 0, 500);
    camera1.position.set(0, 0, freeCameraOrbitRadius);
    // var a = new THREE.Vector3( 0, -100, 80 );
    var a = new THREE.Vector3( 0, 0, 0 );

    // threeCameraTarget1 = [a.x, a.y, a.z];
    freeCameraTarget = [a.x, a.y, a.z];
    camera1.lookAt(a);
    // camera1.target()
    // console.log(camera1.target);

    scene1.add(camera1);
}


function initObject1()
{
    // var planeMesh1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 205, 115, 4, 4 ), material1 );
    var planeMesh1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 410, 230, 4, 4 ), material1 );
    // planeMesh1.position.set( 0, 0, 0 );
    planeMesh1.position.set( 0, 0, 500 );
    // scene1.add(planeMesh1);
}

function initRenderer2() {
    if (!gl2) {
        return;
    }

    // Compute the projection matrix
    aspect2 = gl2.canvas.clientWidth / gl2.canvas.clientHeight;

    renderer2.setSize(ww2, wh2);

    scene2 = new THREE.Scene();

    // camera1 = new THREE.PerspectiveCamera(50, ww1 / wh1, 0.1, 10000);
    camera2 = new THREE.PerspectiveCamera(boujouCameraFieldOfView, aspect2, boujouCameraZNear, boujouCameraZFar);
    camera2.position.set(0, 0, 6000);
    // camera1.position.set(0, 0, boujouCameraOrbitRadius);
    // var a = new THREE.Vector3( 0, -100, 80 );
    var a = new THREE.Vector3( 0, 0, 0 );

    threeCameraTarget2 = [a.x, a.y, a.z];
    camera2.lookAt(a);
    // camera1.target()
    // console.log(camera1.target);

    scene2.add(camera2);
}

function onTextureLoaded () {
    console.log("onTextureLoaded");
}

function initMaterials()
{
    map1 = new THREE.TextureLoader().load('static/textures/0017457.jpg', onTextureLoaded, undefined, function (err) {
        console.error( 'An error happened.' + err );
    });

    map1.wrapS = map1.wrapT = THREE.RepeatWrapping;
    map1.anisotropy = 16;
    material1 = new THREE.MeshPhongMaterial({map: map1, side: THREE.DoubleSide});

    // --------------------------------------------//
    objectMaterial1 = new THREE.MeshStandardMaterial({color:0xffffff, roughness: 0.5, metalness: 1.0});
}

function initTestSphere() {
    // scene2.add(testSphere);
    // scene2.add(mesh);

    // map1 = new THREE.TextureLoader().load('static/textures/UV_Grid_Sm.jpg', onTextureLoaded, undefined, function (err) {
    //         console.error( 'An error happened.' + err );
    // });

    // var planeMesh1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2048, 1152, 4, 4 ), material1 );
    // var planeMesh1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 205, 115, 4, 4 ), material1 );
    var planeMesh1 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 410, 230, 4, 4 ), material1 );
    // planeMesh1.position.set( 0, 0, 0 );
    planeMesh1.position.set( 0, 0, 500 );
    // scene2.add(planeMesh1);


    /*var boxMesh1 = new THREE.Mesh( new THREE.BoxBufferGeometry( 1000, 1000, 1000, 4, 4, 4 ), material1 );
    boxMesh1.position.set( 100, 0, 0 );
    scene2.add( boxMesh1 );*/
}


function initBoujouScene() {
    if (!gl2) {
        return;
    }

    var curCameraPos = boujouFramesData[1];
    // orginalBoujouCameraMatrix = boujouCameraMatrix = new Float32Array([
    curBoujouCameraRotateMatrix = new Float32Array([
        curCameraPos[0], curCameraPos[1], curCameraPos[2], 0,
        curCameraPos[3], curCameraPos[4], curCameraPos[5], 0,
        curCameraPos[6], curCameraPos[7], curCameraPos[8], 0,
        0,              0,                0,              1]);

    curBoujouCameraRotateMatrix = m4.transpose(curBoujouCameraRotateMatrix);

    curBoujouCameraRotateMatrix = m4.xRotate(curBoujouCameraRotateMatrix, Math.PI);

    boujouCameraMatrix = m4.translate(curBoujouCameraRotateMatrix, curCameraPos[9] * worldScaleFactor, curCameraPos[10] * worldScaleFactor, curCameraPos[11] * worldScaleFactor);
    // boujouCameraMatrix = m4.translate(curBoujouCameraRotateMatrix, -curCameraPos[9] * worldScaleFactor, curCameraPos[10] * worldScaleFactor, curCameraPos[11] * worldScaleFactor);

    boujouCameraFocalLength = boujouFramesData[0][12];

    boujouCameraFieldOfViewRadians =2 * Math.atan((boujouCameraCMOSHeight/2)/boujouCameraFocalLength);
    // boujouCameraFieldOfViewRadians = degToRad(boujouCameraFieldOfView);
    boujouCameraFieldOfView = radToDeg(boujouCameraFieldOfViewRadians);

    // Compute the projection matrix
    boujouCameraAspect = gl2.canvas.clientWidth / gl2.canvas.clientHeight;

    // drawBoujouScene();

    initRenderer2();

    initTestSphere();
    initBoujouPoints2();

    initLights2();
}




function drawBoujouScene() {
    // webglUtils.resizeCanvasToDisplaySize(canvas2);

    gl2.viewport(0, 0, gl2.canvas.width, gl2.canvas.height);

    // gl2.clearColor(0, 0, 0, 1);
    gl2.clearColor(0, 0, 0, 0);
    gl2.clear(gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT);

    boujouCameraProjectionMatrix = m4.perspective(boujouCameraFieldOfViewRadians, boujouCameraAspect, boujouCameraZNear, boujouCameraZFar);

    // boujouCameraPosition = [banana.position.x, banana.position.y, banana.position.z];
    // boujouCameraMatrix = m4.lookAt(boujouCameraPosition, boujouCameraTarget, boujouCameraUp, uniformsThatAreTheSameForAllObjects.u_viewInverse);
    //  curBoujouCameraRotateMatrix
    // boujouCameraMatrix = freeCameraMatrix;// for test only!
    // var rotateMatrix = m4.xRotation(cameraAngleRadians);
    // var rotateMatrix = m4.xRotation(Math.PI);
    boujouCameraViewMatrix = m4.inverse(boujouCameraMatrix);
    // boujouCameraViewMatrix = boujouCameraMatrix;

    boujouCameraViewProjectionMatrix = m4.multiply(boujouCameraProjectionMatrix, boujouCameraViewMatrix);
    // boujouCameraViewProjectionMatrix = freeCameraViewProjectionMatrix;

    renderBoujouPointsInGL2();

    // renderPlane2();

}

function initLights1() {
    directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);// 前
    directionalLight1.position.set(0, 0, 2500);
    directionalLight1.lookAt(new THREE.Vector3(0, 0, 0));
    scene1.add(directionalLight1);


    directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);// 左
    directionalLight2.position.set(-1500, 0, 200);
    directionalLight2.lookAt(new THREE.Vector3(0, 0, 0));
    scene1.add(directionalLight2);

    directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);// 右
    directionalLight3.position.set(1500, 0, 200);
    directionalLight3.lookAt(new THREE.Vector3(0, 0, 0));
    scene1.add(directionalLight3);

    // Set its position 蓝
    pointLight1.position.x = 1600;// 右前方
    pointLight1.position.y = 500;
    pointLight1.position.z = 1300;



    // Set its position 绿
    pointLight2.position.x = -1600;// 左前方
    pointLight2.position.y = 500;
    pointLight2.position.z = 1300;


    // Set its position 红
    pointLight3.position.x = 0;// 前下方
    pointLight3.position.y = -500;
    pointLight3.position.z = 1300;

    // add to the scene1
    scene1.add(pointLight1);
    scene1.add(pointLight2);
    scene1.add(pointLight3);
}



function initLights2() {
    directionalLight4 = new THREE.DirectionalLight(0xff00ff, 0.5);// 前
    directionalLight4.position.set(0, 0, 2500);
    directionalLight4.lookAt(new THREE.Vector3(0, 0, 0));
    scene2.add(directionalLight4);


    directionalLight5 = new THREE.DirectionalLight(0x00ffff, 0.5);// 左
    directionalLight5.position.set(-1500, 0, 200);
    directionalLight5.lookAt(new THREE.Vector3(0, 0, 0));
    scene2.add(directionalLight5);

    directionalLight6 = new THREE.DirectionalLight(0xffff00, 0.5);// 右
    directionalLight6.position.set(1500, 0, 200);
    directionalLight6.lookAt(new THREE.Vector3(0, 0, 0));
    scene2.add(directionalLight6);

    // Set its position 蓝
    pointLight4.position.x = 1600;// 右前方
    pointLight4.position.y = -500;
    pointLight4.position.z = -300;



    // Set its position 绿
    pointLight5.position.x = -1600;// 左前方
    pointLight5.position.y = -500;
    pointLight5.position.z = -300;


    // Set its position 红
    pointLight6.position.x = 0;// 前下方
    pointLight6.position.y = -500;
    pointLight6.position.z = 1300;

    // add to the scene1
    scene2.add(pointLight4);
    scene2.add(pointLight5);
    scene2.add(pointLight6);
}


function initBoujouPoints2()
{


    var spread = worldScaleFactor;
    for(var i = 0; i < boujouPointsData.length; i++) {
        // cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);
        var mygeometry = new THREE.BoxBufferGeometry(8, 8, 8);
        var x = boujouPointsData[i][0] * spread;
        var y = boujouPointsData[i][1] * spread;
        var z = boujouPointsData[i][2] * spread;

        // var colorValue = ((x / 5) + 0.5) << 24 + ((y / 5) + 0.5) << 16 + ((z / 5) + 0.5) << 8;
        // var colorValue = ((x / 3) + 0.5) << 24 + ((y / 3) + 0.5) << 16 + ((z / 3) + 0.5) << 8;
        // var colorValue = ((x / 2) + 0.5) << 24 + Number(0x0000ff);
        // var colorValue = ((x / 2) + 0.5) << 24 + 0.5 << 8;// red & blue
        // var mymaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var mymaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        // var mymaterial = new THREE.MeshBasicMaterial({color: colorValue});
        // var mymesh = new THREE.Mesh(mygeometry, mymaterial);

        var mymesh = new THREE.Mesh(mygeometry, objectMaterial1);

        // mymesh.position = new THREE.Vector3(boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);
        /*mymesh.position.x = boujouPointsData[i][0] * spread;
        mymesh.position.y = boujouPointsData[i][1] * spread;
        mymesh.position.z = boujouPointsData[i][2] * spread;*/

        mymesh.position.x = x;
        mymesh.position.y = y;
        mymesh.position.z = z;
        scene2.add(mymesh);
    }
}


function loadOBJ() {
    var promise = new Promise(function(resolve, reject){
        var manager = new THREE.LoadingManager();
        var loader = new THREE.OBJLoader(manager);
        // loader.load('static/js/camera002.1.obj', function(object){
        loader.load('static/js/camera003.2.obj', function(object){
            resolve(object);
        });

    });

 
    // loader.load('src_files/models/6/camera002.1.obj', onCameraModelLoaded);

    return promise;

}

function onCameraModelLoaded(object) {
    addBananaInScene(object);

    initPlane();
    initBoujouPoints();
    // render();
    // callRender();
    // todo 为什么要延迟一秒?
    // setTimeout(beginAnimation, 1000);
    beginAnimation();
}

function addBananaInScene (object) {
    banana = object;

    boujouCameraOriginPosition = [boujouFramesData[1][9] * worldScaleFactor, boujouFramesData[1][10]* worldScaleFactor, boujouFramesData[1][11]* worldScaleFactor];
    //  boujouCameraOriginPosition = [-boujouFramesData[1][9] * worldScaleFactor, boujouFramesData[1][10]* worldScaleFactor, boujouFramesData[1][11]* worldScaleFactor];
    // banana.scale.x = banana.scale.y =banana.scale.z = 10;

    var rotateMatrix = new THREE.Matrix4();
    var curCameraPos = boujouFramesData[1];
    rotateMatrix.set(
        Number(curCameraPos[0]), Number(curCameraPos[1]), Number(curCameraPos[2]), 0,
        Number(curCameraPos[3]), Number(curCameraPos[4]), Number(curCameraPos[5]), 0,
        Number(curCameraPos[6]), Number(curCameraPos[7]), Number(curCameraPos[8]), 0,
        0,              0,                0,              1
    );

    rotateMatrix.transpose();

    boujouCameraOriginRotation = rotateMatrix;

    banana.setRotationFromMatrix(rotateMatrix);

    banana.position.x = boujouCameraOriginPosition[0];
    banana.position.y = boujouCameraOriginPosition[1];
    banana.position.z = boujouCameraOriginPosition[2];


    freeCameraOrbitRadius = Math.sqrt(Math.pow(banana.position.x,  2) + Math.pow(banana.position.y, 2) + Math.pow(banana.position.z, 2)) + 1500;

    // 设定自由摄像机初始状态跟随目标摄像机模型

    /*freeCameraPosition = [banana.position.x, banana.position.y, banana.position.z + 800];

    freeCameraOrbitRadius = Math.sqrt(Math.pow(freeCameraPosition[0], 2) + Math.pow(freeCameraPosition[1], 2) + Math.pow(freeCameraPosition[2], 2));
    freeCameraRotationX = banana.rotation.x;
    // freeCameraRotationY = banana.rotation.y - Math.PI;
    freeCameraRotationY = banana.rotation.y;*/
    // banana.setPosition()

    // object.traverse()
    banana.traverse(function(child) {
        if(child instanceof THREE.Mesh) {
            child.material.color = new THREE.Color(0x00FF00);
            // child.geometry.computeVertexNormals();
        }
    });
    scene1.add(banana);
    // Add the 3D object in the scene1

}

function beginAnimation() {
    animationBegin = true;
}

function initPlane() {
    planeProgram1 = webglUtils.createProgramFromSources(gl1, [planeVertexShaderSource1, planeFragmentShaderSource1]);
    planePositionAttributeLocation1 = gl1.getAttribLocation(planeProgram1, "a_position");
    // planeResolutionUniformLocation1 = gl1.getUniformLocation(planeProgram1, "u_resolution");
    planeMatrixLocation1 = gl1.getUniformLocation(planeProgram1, "u_matrix");
    planePositionBuffer1 = gl1.createBuffer();
    gl1.bindBuffer(gl1.ARRAY_BUFFER, planePositionBuffer1);
    gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(planePositions), gl1.STATIC_DRAW);


    planeProgram2 = webglUtils.createProgramFromSources(gl2, [planeVertexShaderSource1, planeFragmentShaderSource1]);
    planePositionAttributeLocation2 = gl2.getAttribLocation(planeProgram2, "a_position");
    // planeResolutionUniformLocation1 = gl1.getUniformLocation(planeProgram1, "u_resolution");
    planeMatrixLocation2 = gl2.getUniformLocation(planeProgram2, "u_matrix");
    planePositionBuffer2 = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, planePositionBuffer2);
    gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(planePositions), gl2.STATIC_DRAW);

}

function initBoujouPoints() {
    cubeBufferInfo1 = window.primitives.createCubeBufferInfo(gl1, 8);

    cubeProgramInfo1 = webglUtils.createProgramInfo(gl1, [cubeVertexShaderSource1, cubeFragmentShaderSource1]);

    cubeBufferInfo2 = window.primitives.createCubeBufferInfo(gl2, 8);

    cubeProgramInfo2 = webglUtils.createProgramInfo(gl2, [cubeVertexShaderSource1, cubeFragmentShaderSource1]);
}

function onUpdate() {

}


function tick() {
// function tick(updateFunc) {
    requestAnimationFrame(tick);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
        then = now - (delta % interval);
        // draw(); // ... Code for Drawing the Frame ...
        // updateFunc();
        onUpdate();
    }
}
// tick();


function renderBoujou(frameNum) {
    // requestAnimationFrame(render);
    // renderer1.resetGLState();

    if(frameNum <= 0 || frameNum > boujouFramesData.length - 1)
        return;

    curFrame = frameNum;
    renderer1.state.reset();


    if (animationBegin) {
        // banana.position = boujouFramesData[animationFrameCount];
        // if(animationFrameCount % 3 == 0)
        // {
        // var curCameraPos = boujouFramesData[animationFrameCount / 3];
        var curCameraPos = boujouFramesData[frameNum];

        // banana.position.x = -curCameraPos[9] * worldScaleFactor;
        banana.position.x = curCameraPos[9] * worldScaleFactor;
        banana.position.y = curCameraPos[10] * worldScaleFactor;
        banana.position.z = curCameraPos[11] * worldScaleFactor;

            // var arr = curCameraPos.slice(0, 8);

            var rotateMatrix = new THREE.Matrix4();

           // var matrix1 = m4.identity();
            // var matrix2 = m4.zRotate(matrix1, Math.PI);
            // var matrix2 = m4.xRotate(matrix1, Math.PI);


            var matrix3 = new Float32Array([
                curCameraPos[0], curCameraPos[1], curCameraPos[2], 0,
                curCameraPos[3], curCameraPos[4], curCameraPos[5], 0,
                curCameraPos[6], curCameraPos[7], curCameraPos[8], 0,
                0,              0,                0,              1]);

        // curBoujouCameraRotateMatrix = m4.multiply(matrix2, matrix3);
        // curBoujouCameraRotateMatrix = m4.multiply(matrix3, matrix2);

        curBoujouCameraRotateMatrix = m4.xRotate(matrix3, Math.PI);
        // curBoujouCameraRotateMatrix = m4.zRotate(curBoujouCameraRotateMatrix, Math.PI);

        /*curBoujouCameraRotateMatrix = new Float32Array([
            curCameraPos[0], curCameraPos[1], curCameraPos[2], 0,
            curCameraPos[3], curCameraPos[4], curCameraPos[5], 0,
            curCameraPos[6], curCameraPos[7], curCameraPos[8], 0,
            0,              0,                0,              1]);*/

           // curBoujouCameraRotateMatrix = m4.transpose(curBoujouCameraRotateMatrix);


             // curBoujouCameraRotateMatrix = m4.xRotate(curBoujouCameraRotateMatrix, Math.PI);
            // curBoujouCameraRotateMatrix = m4.yRotate(curBoujouCameraRotateMatrix, Math.PI);
        // curBoujouCameraRotateMatrix = m4.zRotate(curBoujouCameraRotateMatrix, Math.PI);

            boujouCameraMatrix = m4.translate(curBoujouCameraRotateMatrix, -curCameraPos[9] * worldScaleFactor, -curCameraPos[10] * worldScaleFactor, curCameraPos[11] * worldScaleFactor);
            // boujouCameraMatrix = m4.translate(curBoujouCameraRotateMatrix, -curCameraPos[9] * worldScaleFactor, curCameraPos[10] * worldScaleFactor, -curCameraPos[11] * worldScaleFactor);
            //  boujouCameraMatrix = m4.translate(curBoujouCameraRotateMatrix, -curCameraPos[9] * worldScaleFactor, curCameraPos[10] * worldScaleFactor, curCameraPos[11] * worldScaleFactor);
        // boujouCameraMatrix = m4.translate(curBoujouCameraRotateMatrix, -curCameraPos[9] * worldScaleFactor, -curCameraPos[10] * worldScaleFactor, curCameraPos[11] * worldScaleFactor);

            // boujouCameraMatrix = m4.xRotate(boujouCameraMatrix, Math.PI);
            // boujouCameraMatrix = m4.yRotate(boujouCameraMatrix, Math.PI);
            // boujouCameraMatrix = m4.zRotate(boujouCameraMatrix, Math.PI);

            rotateMatrix.set(
                Number(curCameraPos[0]), Number(curCameraPos[1]), Number(curCameraPos[2]), 0,
                Number(curCameraPos[3]), Number(curCameraPos[4]), Number(curCameraPos[5]), 0,
                Number(curCameraPos[6]), Number(curCameraPos[7]), Number(curCameraPos[8]), 0,
                0,              0,                0,              1
            );

            rotateMatrix.transpose();
            // curBoujouCameraRotateMatrix.fromArray(arr);
            // var curBoujouCameraRotateMatrix = []

            banana.setRotationFromMatrix(rotateMatrix);


        // }

        if(frameNum >= boujouFramesData.length - 1)
        {
            resetFrameIndex();
        }


        animationFrameCount++;
        if(animationFrameCount >= (boujouFramesData.length * 3))

        {
            animationFrameCount = 1;
        }
    }
    // renderer1.state.setCullFace(THREE.CullFaceNone);
    // gl1.disable(gl1.CULL_FACE);
    // banana.rotation.z += .01;
    // banana.rotation.x = 90;
    // gl1.clearColor( 0, 0, 0, 1 );
    // renderer1.render(scene1, camera1);

    // var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect1, 1, 150);
    freeCameraProjectionMatrix = m4.perspective(freeCameraFieldOfViewRadians, aspect1, freeCameraZNear, freeCameraZFar);
    // console.log("freeCameraProjectionMatrix == " + freeCameraProjectionMatrix);
    // console.log("camera1.projectionMatrix == " + camera1.projectionMatrix.elements);


    freeCameraPosition = [-Math.sin(freeCameraRotationY) * freeCameraOrbitRadius, Math.sin(freeCameraRotationX) * freeCameraOrbitRadius, Math.cos(freeCameraRotationX) * Math.cos(freeCameraRotationY) * freeCameraOrbitRadius];

    // freeCameraPosition = [-Math.sin(freeCameraRotationY) * freeCameraOrbitRadius, Math.sin(freeCameraRotationX) * freeCameraOrbitRadius, -Math.cos(freeCameraRotationX) * Math.cos(freeCameraRotationY) * freeCameraOrbitRadius];

    camera1.position.set(freeCameraPosition[0], freeCameraPosition[1], freeCameraPosition[2]);

    camera1.lookAt(freeCameraTarget[0], freeCameraTarget[1], freeCameraTarget[2]);
    camera1.updateMatrixWorld();
    renderer1.render(scene1, camera1);

    freeCameraMatrix = m4.lookAt(freeCameraPosition, freeCameraTarget, freeCameraUp, uniformsThatAreTheSameForAllObjects.u_viewInverse);
    // Make a view matrix from the camera1 matrix.
    freeCameraViewMatrix = m4.inverse(freeCameraMatrix);
    // var viewProjectionMatrix = m4.multiply(perspectiveMatrix, viewMatrix);
    freeCameraViewProjectionMatrix = m4.multiply(freeCameraProjectionMatrix, freeCameraViewMatrix);
    // freeCameraViewProjectionMatrix = boujouCameraViewProjectionMatrix ? freeCameraViewProjectionMatrix = boujouCameraViewProjectionMatrix : m4.identity();
    // renderPlane1();
    renderBoujouPointsInGL1();
    // drawBoujouScene();
    renderScene2();

    console.log("freeCameraOrbitRadius == " + freeCameraOrbitRadius);
}

function renderPlane1() {

    // webglUtils.resizeCanvasToDisplaySize(gl1.canvas1);
    // gl1.viewport(0, 0, gl1.canvas1.width, gl1.canvas1.height);
    // gl1.clearColor(0, 0, 0, 0);
    // gl1.clear(gl1.COLOR_BUFFER_BIT);
    gl1.useProgram(planeProgram1);
    gl1.enableVertexAttribArray(planePositionAttributeLocation1);
    gl1.bindBuffer(gl1.ARRAY_BUFFER, planePositionBuffer1);

    // var size = 2;
    var size1 = 3;
    // var type1 = gl1.FLOAT;
    var type1 = gl1.FLOAT;
    var normalize = false;
    var stride1 = 0;
    var offset11 = 0;
    gl1.vertexAttribPointer(
        planePositionAttributeLocation1, size1, type1, normalize, stride1, offset11);
    // gl1.uniform2f(planeResolutionUniformLocation1, gl1.canvas1.width, gl1.canvas1.height);
    planeViewMatrix1 = m4.translate(freeCameraViewProjectionMatrix, planeTranslationArr[0], planeTranslationArr[1], planeTranslationArr[2]);
    // planeViewMatrix1 = m4.translate(camera1.projectionMatrix, planeTranslationArr[0], planeTranslationArr[1], planeTranslationArr[2]);


    // gl1.uniformMatrix4fv(planeMatrixLocation1, false, viewProjectionMatrix);
    gl1.uniformMatrix4fv(planeMatrixLocation1, false, planeViewMatrix1);
    // draw
    var primitiveType1 = gl1.TRIANGLES;
    var offset12 = 0;
    var vertexCount1 = 6;
    gl1.drawArrays(primitiveType1, offset12, vertexCount1);
}


function renderPlane2() {


    gl2.useProgram(planeProgram2);
    gl2.enableVertexAttribArray(planePositionAttributeLocation2);
    gl2.bindBuffer(gl2.ARRAY_BUFFER, planePositionBuffer2);

    // var size = 2;
    var size1 = 3;
    // var type1 = gl2.FLOAT;
    var type1 = gl2.FLOAT;
    var normalize = false;
    var stride1 = 0;
    var offset11 = 0;
    gl2.vertexAttribPointer(
        planePositionAttributeLocation2, size1, type1, normalize, stride1, offset11);

    planeViewMatrix2 = m4.translate(boujouCameraViewProjectionMatrix, planeTranslationArr[0], planeTranslationArr[1], planeTranslationArr[2]);
    gl2.uniformMatrix4fv(planeMatrixLocation2, false, planeViewMatrix2);
    // draw
    var primitiveType1 = gl2.TRIANGLES;
    var offset12 = 0;
    var vertexCount1 = 6;
    gl2.drawArrays(primitiveType1, offset12, vertexCount1);
}

function renderBoujouPointsInGL1() {
    var cubeWorldMatrix;
    var cubeViewMatrix;

    gl1.useProgram(cubeProgramInfo1.program);

    webglUtils.setBuffersAndAttributes(gl1, cubeProgramInfo1, cubeBufferInfo1);

    webglUtils.setUniforms(cubeProgramInfo1, uniformsThatAreTheSameForAllObjects);

    // Draw cubes
    var spread = worldScaleFactor;
    for(var i = 0; i < boujouPointsData.length; i++)
    {
        cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);
        m4.multiply(
            freeCameraViewProjectionMatrix, cubeWorldMatrix,
            uniformsThatAreComputedForEachObject.u_worldViewProjection);// 计算u_worldViewProjection
        // matrix = m4.multiply(viewMatrix, cubeWorldMatrix);
        // m4.transpose(m4.inverse(cubeWorldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);// 计算u_worldInverseTranspose：
        // Make a view matrix from the cube matrix
        cubeViewMatrix = m4.inverse(cubeWorldMatrix);
        // 计算u_worldInverseTranspose：
        m4.transpose(cubeViewMatrix, uniformsThatAreComputedForEachObject.u_worldInverseTranspose);
        // Set the uniforms we just computed
        webglUtils.setUniforms(cubeProgramInfo1, uniformsThatAreComputedForEachObject);
        // Set a color for this object;
        for(var j = 0; j < 3;j++)
        {
            materialUniforms.u_diffuse[j] = boujouPointsData[i][j]  * 0.5 + 0.5;
            // materialUniforms.u_diffuse[j] = 0.5;
        }
        // Set the uniforms that are specific to this object.
        webglUtils.setUniforms(cubeProgramInfo1, materialUniforms);

        // Draw the geometry.
        gl1.drawElements(gl1.TRIANGLES, cubeBufferInfo1.numElements, gl1.UNSIGNED_SHORT, 0);

    }
}


function renderBoujouPointsInGL2() {
    var cubeWorldMatrix;
    var cubeViewMatrix;

    gl2.useProgram(cubeProgramInfo2.program);

    webglUtils.setBuffersAndAttributes(gl2, cubeProgramInfo2, cubeBufferInfo2);

    webglUtils.setUniforms(cubeProgramInfo2, uniformsThatAreTheSameForAllObjects);

    // Draw cubes
    var spread = worldScaleFactor;
    for(var i = 0; i < boujouPointsData.length; i++)
    {
        cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);//
        // cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);
        // cubeWorldMatrix = m4.translation(-boujouPointsData[i][0] * spread, -boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);// 翻转xy：wrong
        // cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, -boujouPointsData[i][1] * spread, -boujouPointsData[i][2] * spread);// 翻转yz：wrong
        // cubeWorldMatrix = m4.translation(-boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, -boujouPointsData[i][2] * spread);// 翻转xz：wrong
        // cubeWorldMatrix = m4.translation(-boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);// 翻转x：wrong
        // cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, -boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);// 翻转y：wrong
        // cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, -boujouPointsData[i][2] * spread);// 翻转z：wrong


        // var newBoujouCameraViewProjectionMatrix = m4.yRotate(boujouCameraViewProjectionMatrix, Math.PI);
        m4.multiply(
            boujouCameraViewProjectionMatrix, cubeWorldMatrix,
            // newBoujouCameraViewProjectionMatrix, cubeWorldMatrix,
            uniformsThatAreComputedForEachObject.u_worldViewProjection);// 计算u_worldViewProjection
        // matrix = m4.multiply(viewMatrix, cubeWorldMatrix);
        // m4.transpose(m4.inverse(cubeWorldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);// 计算u_worldInverseTranspose：
        // Make a view matrix from the cube matrix
        cubeViewMatrix = m4.inverse(cubeWorldMatrix);
        // 计算u_worldInverseTranspose：
        m4.transpose(cubeViewMatrix, uniformsThatAreComputedForEachObject.u_worldInverseTranspose);
        // Set the uniforms we just computed
        webglUtils.setUniforms(cubeProgramInfo2, uniformsThatAreComputedForEachObject);
        // Set a color for this object;
        for(var j = 0; j < 3;j++)
        {
            materialUniforms.u_diffuse[j] = boujouPointsData[i][j]  * 0.5 + 0.5;
            // materialUniforms.u_diffuse[j] = 0.5;
        }
        // Set the uniforms that are specific to this object.
        webglUtils.setUniforms(cubeProgramInfo2, materialUniforms);

        // Draw the geometry.
        gl2.drawElements(gl2.TRIANGLES, cubeBufferInfo2.numElements, gl2.UNSIGNED_SHORT, 0);

    }
}


function renderScene2() {
    renderer2.state.reset();
    // camera2.updateMatrixWorld();
    // renderer2.render(scene2, camera2);

    // camera2.position.set(freeCameraPosition[0], freeCameraPosition[1], freeCameraPosition[2]);
    // camera2.lookAt(freeCameraTarget[0], freeCameraTarget[1], freeCameraTarget[2]);
    // camera2.applyMatrix(banana.matrix);
    // camera2.updateMatrixWorld();

    var curCameraPos = boujouFramesData[curFrame];

    camera2.position.x = curCameraPos[9] * worldScaleFactor;
    camera2.position.y = curCameraPos[10] * worldScaleFactor;
    camera2.position.z = curCameraPos[11] * worldScaleFactor;


    var rotateMatrix = new THREE.Matrix4();

    rotateMatrix.set(
        Number(curCameraPos[0]), Number(curCameraPos[1]), Number(curCameraPos[2]), 0,
        Number(curCameraPos[3]), Number(curCameraPos[4]), Number(curCameraPos[5]), 0,
        Number(curCameraPos[6]), Number(curCameraPos[7]), Number(curCameraPos[8]), 0,
        0,              0,                0,              1
    );

    // rotateMatrix.makeRotationZ(Math.PI);

    rotateMatrix.transpose();

    camera2.setRotationFromMatrix(rotateMatrix);

    /*camera2.rotateY(Math.PI);
    camera2.rotateZ(Math.PI);*/ // rotationY(Math.PI) + rotationZ(Math.PI) == rotationX(Math.PI)

    camera2.rotateX(Math.PI);

    // camera2.position.z = 2000;


    renderer2.render(scene2, camera2);
}



function onGotBoujouData(data, status)
{
    console.log("BoujouData == " + data);
    boujouDataStr = data;

    getBoujouCameraParameters(data);
    getBoujouFramesData(data);
    getBoujouPointsData(data);

    initScene();
    initBoujouScene();

}

function getBoujouCameraParameters(data)
{
    var searchStr = "#Filmback Size ";
    var beginIdx = data.indexOf(searchStr) + searchStr.length;
    var endIdx = data.indexOf("#Line Format");
    var str = data.substring(beginIdx, endIdx);
    var cmosSizeArr = str.split(" ");
    boujouCameraCMOSWidth = cmosSizeArr[0];
    boujouCameraCMOSHeight = cmosSizeArr[1];


}


function getBoujouFramesData(data)
{
    var beginIdx = data.indexOf("F(mm)");
    var endIdx = data.indexOf("#3D Scene Points");
    var str = data.substring(beginIdx + 5, endIdx);
    var tempData = str.split("\n");
    for(var i = 0; i < tempData.length;i++)
    {
        if((tempData[i].length > 1) && (tempData[i] != " "))
        {
            var arr = tempData[i].split("\t");
            // console.log("boujouFramesData ： 第" + i +"行数据：" + arr);
            boujouFramesData.push(arr);
        }
    }

    // boujouFramesData
    console.log("\n\n\n\n------------------------------------\nboujouFramesData == " + boujouFramesData);
}

function getBoujouPointsData(data)
{
    var beginIdx = data.indexOf("#x\ty\tz");
    var endIdx = data.lastIndexOf("#End of boujou export file");
    var str = data.substring(beginIdx + 7, endIdx);
    var tempData = str.split("\n");
    for(var i = 0; i < tempData.length;i++)
    {
        if((tempData[i].length > 1) && (tempData[i] != " "))
        {
            var arr = tempData[i].split("\t");
            // console.log("boujouPointsData ： 第" + i +"行数据：" + arr);
            boujouPointsData.push(arr);
        }
    }

    // boujouPointsData
    console.log("\n\n\n\n------------------------------------\nboujouPointsData == " + boujouPointsData);

}


function getCameraModelVerticesData(data)
{
    var beginIdx = data.indexOf("\nv ");
    // var endIdx = data.indexOf("\n\nvt");
    var endIdx = data.indexOf("\n\#v");
    var str = data.substring(beginIdx, endIdx);
    var tempData = str.split("\n");
    for(var i = 0; i < tempData.length;i++)
    {
        if((tempData[i].length > 1) && (tempData[i] != " "))
        {
            var arr = tempData[i].split(" ");
            // console.log("boujouCameraModelVerticesData ： 第" + i +"行数据：" + arr);
            arr.splice(0, 1);
            boujouCameraModelPositions1 = boujouCameraModelPositions1.concat(arr);
            boujouCameraModelVerticesData.push(arr);
        }
    }

    // boujouFramesData
    console.log("\n\n\n\n------------------------------------\nboujouCameraModelVerticesData == " + boujouCameraModelVerticesData);
}

function initBoujouCameraModel() {
    // 创建boujou摄像机模型:
    boujouCameraModelProgram1 = webglUtils.createProgramFromSources(gl, [boujouCameraModelVertexShaderSource1, boujouCameraModelFragmentShaderSource1]);
    boujouCameraModelPositionAttributeLocation1 = gl.getAttribLocation(boujouCameraModelProgram1, "a_position");

    boujouCameraModelMatrixLocation1 = gl.getUniformLocation(boujouCameraModelProgram1, "u_matrix");
    boujouCameraModelPostionBuffer1 = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, boujouCameraModelPostionBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boujouCameraModelPositions1), gl.STATIC_DRAW);

    // requestAnimationFrame(drawScene);
}


function drawBoujouCameraModel() {
    // ---------------------------------------------------------------draw boujou camera1 model ! -----------------------------------------------------------------------------

    gl.useProgram(boujouCameraModelProgram1);
    gl.enableVertexAttribArray(boujouCameraModelPositionAttributeLocation1);
    gl.bindBuffer(gl.ARRAY_BUFFER, boujouCameraModelPostionBuffer1);

    var size3 = 3;
    var type3 = gl.FLOAT;
    var normalize = false;
    var stride3 = 0;
    var offset31 = 0;
    gl.vertexAttribPointer(
        boujouCameraModelPositions1, size3, type3, normalize, stride3, offset31);
    boujouCameraModelViewMatrix = m4.translate(viewProjectionMatrix, boujouCameraModelTranslationArr1[0], boujouCameraModelTranslationArr1[1], boujouCameraModelTranslationArr1[2]);
    gl.uniformMatrix4fv(boujouCameraModelMatrixLocation1, false, boujouCameraModelViewMatrix);

    // draw
    var primitiveType3 = gl.TRIANGLES;
    var offset32 = 0;
    var vertexCount3 = boujouCameraModelPositions1.length/3;
    gl.drawArrays(primitiveType3, offset32, vertexCount3);
}

function MouseDownHandler(event) {
    isMouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    console.log("Now isMouseDown == true!");
}


function MouseUpHandler(event) {
    isMouseDown = false;
    console.log("Now isMouseDown == false!");
}

function MouseWheelHandler(event) {
    var delta = event.wheelDelta ? event.wheelDelta/120 : event.detail/(-3);
    console.log(" wheel delta == " + delta);
    // orbitRadius *= (1 - delta/100);// 滚轮向上滚，镜头推进，orbitRadius减小
    freeCameraOrbitRadius *= (1 - delta/100);// 滚轮向上滚，镜头推进，orbitRadius减小

}

function MouseMoveHandler(event) {
    if(! isMouseDown)
    {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    // var newRotationMatrix

    var deltaY = newY - lastMouseY;

    lastFreeCameraRotationX = freeCameraRotationX;
    lastFreeCameraRotationY = freeCameraRotationY;

    freeCameraRotationX += (deltaY/3)/180;

    freeCameraRotationY += (deltaX/3)/180;


    // freeCameraRotationX -= (deltaY/3)/180;
    // freeCameraRotationY -= (deltaX/3)/180;

    lastMouseX = newX;
    lastMouseY = newY;

    boujouCameraMatrix = m4.yRotate(boujouCameraMatrix, (deltaX/3)/180);

    console.log(" deltaX == " + deltaX + ", deltaY == " + deltaY);
}

function addMouseWheelEvent(element, func) {
    if(typeof element.onmousewheel == "object") {
       element.onmousewheel = func;
    }

    if(typeof element.onmousewheel == "undefined") {
        element.addEventListener("DOMMouseScroll", func, false);
    }
}

// init();
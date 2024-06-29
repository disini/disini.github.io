/* Licensed under a BSD license. See license.html for license */

/*drawing rectangle in 3D space with a camera view：\
*
* reference web pages:
* https://webglfundamentals.org/webgl/lessons/resources/cross-product-diagram.html?mode=1 //WebGL - Cross Product Diagram
*
* */

"use strict";

var planeVertexShaderSource1 = `
    attribute vec4 a_position;
    // uniform vec2 u_resolution;
    
    uniform mat4 u_matrix;
    
    void main() {
        /*// vec2 zeroToOne = a_position.xy / u_resolution;
    
     // convert from 0->1 to 0->2
     //    vec2 zeroToTwo = zeroToOne * 2.0;
        
     // convert from 0->2 to -1->+1 (clipspace)
     //    vec2 clipSpace = zeroToTwo - 1.0;
    
    // gl_Position = vec4(clipSpace, 0, 1);
    // gl_Position = vec4(zeroToOne, 0, 1);
    
    // gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    // gl_Position = vec4(zeroToOne * vec2(1, -1), 0, 1);// 翻转y轴*/
    
       gl_Position = u_matrix * a_position;
    }
    

`;

var planeFragmentShaderSource1 = `
    precision mediump float;
    
    void main() {
        gl_FragColor = vec4(1, 0, 0.5, 1);// return redish-purple
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

var boujouCameraModelVertexShaderSource1 = `
    attribute vec4 a_position;
    // attribute vec4 a_color;
    
    uniform mat4 u_matrix;
    
    // uniform float u_fudgeFactor = 20;
    
    // varying vec4 v_color;
    
    void main() {
        gl_Position = u_matrix * a_position;
        // gl_Position = u_matrix * vec4(a_position.x * u_fudgeFactor, a_position.y * u_fudgeFactor, a_position.z * u_fudgeFactor, u_fudgeFactor);
    // gl_Position = u_matrix * vec4(a_position.x * 20.0, a_position.y * 20.0, a_position.z * 20.0, 1.0);
        // v_color = a_color;
    }   
    
`;


var boujouCameraModelFragmentShaderSource1 = `
    precision mediump float;
    
    // varying vec4 v_color;
    
    void main() {
        // gl_FragColor = v_color;
       gl_FragColor = vec4(0, 1, 0.5, 1);//
    }
`;


/*var boujouCameraModelVertexShaderSource1 = `
    attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;

    // Pass the color to the fragment shader.
    v_color = a_color;
}
`;

var boujouCameraModelFragmentShaderSource1 = `
    precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

void main() {
    gl_FragColor = v_color;
}
`;*/



// 文件存储对象
var fso;

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

var orbitRadius = 1600;
// var orbitRadius = 60;
var aspect;
var cameraPosition = [0, 0, orbitRadius];
var target = [0, 0, 0];
var up = [0, 1, 0];

var rotationX = 0;
var rotationY = 0;

// ------------------------------------------- plane -----------------------------------//


var planeBufferInfo1;

var planeProgramInfo1;

var planeProgram1;

var planePositionAttributeLocation1;

// var planeResolutionUniformLocation1;

var planePositionBuffer1;

var planePositions1;

var planeTranslationArr = [0, 0, -800];

var planeMatrixLocation;

var planeViewMatrix;

// --------------------------------- cube -----------------------------------------//

var cubeBufferInfo1;

var cubeProgramInfo1;

// --------------------------------  camera ---------------------------------------//
var boujouCameraModelProgram1;

var boujouCameraModelPositionAttributeLocation1;

var boujouCameraModelPostionBuffer1;

var boujouCameraModelPositions1 = [];



var boujouCameraModelNormals1 = [];

// var boujouCameraModelTranslationArr1 = [0, 0, -100];
var boujouCameraModelTranslationArr1 = [0, 0, 0];

var boujouCameraModelMatrixLocation1;

var boujouCameraModelViewMatrix;


var container = document.getElementById("container");
// var isCanvas = (container instanceof HTMLCanvasElement);
var canvas = document.getElementById("scene");
// canvas1.width = 1600;
// canvas1.height = 900;

canvas.onmousedown = MouseDownHandler;
document.onmouseup = MouseUpHandler;
document.onmousemove = MouseMoveHandler;

addMouseWheelEvent(canvas, MouseWheelHandler);

var gl = canvas.getContext("webgl", { alpha: false });



// gl1.enable(gl1.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

function degToRad(d) {
    return d * Math.PI / 180;
}

var cameraAngleRadians = degToRad(0);
var fieldOfViewRadians = degToRad(40);
var cameraHeight = 40;
var zNear = 1;
// var zFar  = 150;
var zFar  = 15000;


var uniformsThatAreTheSameForAllObjects = {
    u_lightWorldPos:         [-50, 30, 100],
    u_viewInverse:           m4.identity(),
    u_lightColor:            [3, 3, 3, 3],
    u_fogColor:              [1, 1, 1, 1],
    u_fogNear:               zNear + (zFar - zNear) * 0.33,
    u_fogFar:                zFar,
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

function drawScene(time) {
    webglUtils.resizeCanvasToDisplaySize(canvas);

    time *= 0.001;  // convert to seconds

    // Set the viewport to match the canvas1
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas1 AND the depth buffer.
    // gl1.clearColor( 1, 1, 1, 1 );
    gl.clearColor( 0, 0, 0, 1 );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl1.clear(gl1.COLOR_BUFFER_BIT);



    // var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 150);
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);



    // Compute the camera's matrix using look at.
    // var orbitRadius = 1600;
    var orbitTime = time * 0.05;
    // var cameraPosition = [Math.cos(orbitTime) * orbitRadius, Math.sin(orbitTime * 1.123) * orbitRadius, Math.sin(orbitTime) * orbitRadius];
    //   var cameraPosition = [0, 0, orbitRadius];
    var cameraPosition = [-Math.sin(rotationY) * orbitRadius, Math.sin(rotationX) * orbitRadius, Math.cos(rotationX) * Math.cos(rotationY) * orbitRadius];
    // var target = [0, 0, 0];
    // var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);
    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);
    // var viewProjectionMatrix = m4.multiply(perspectiveMatrix, viewMatrix);
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    var cubeWorldMatrix;
    var cubeViewMatrix;
    var matrix;

    // ---------------------------------------------------------------draw plane ! method 2-----------------------------------------------------------------------------

    // gl1.bindBuffer(gl1.ARRAY_BUFFER, planePositionBuffer1);
    // gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(planePositions1), gl1.STATIC_DRAW);
    // webglUtils.resizeCanvasToDisplaySize(gl1.canvas1);
    // gl1.viewport(0, 0, gl1.canvas1.width, gl1.canvas1.height);
    // gl1.clearColor(0, 0, 0, 0);
    // gl1.clear(gl1.COLOR_BUFFER_BIT);
    gl.useProgram(planeProgram1);
    gl.enableVertexAttribArray(planePositionAttributeLocation1);
    gl.bindBuffer(gl.ARRAY_BUFFER, planePositionBuffer1);

    // var size = 2;
    var size1 = 3;
    // var type1 = gl1.FLOAT;
    var type1 = gl.FLOAT;
    var normalize = false;
    var stride1 = 0;
    var offset11 = 0;
    gl.vertexAttribPointer(
        planePositionAttributeLocation1, size1, type1, normalize, stride1, offset11);
    // gl1.uniform2f(planeResolutionUniformLocation1, gl1.canvas1.width, gl1.canvas1.height);
    planeViewMatrix = m4.translate(viewProjectionMatrix, planeTranslationArr[0], planeTranslationArr[1], planeTranslationArr[2]);
    // gl1.uniformMatrix4fv(planeMatrixLocation, false, viewProjectionMatrix);
    gl.uniformMatrix4fv(planeMatrixLocation, false, planeViewMatrix);
    // draw
    var primitiveType1 = gl.TRIANGLES;
    var offset12 = 0;
    var vertexCount1 = 6;
    gl.drawArrays(primitiveType1, offset12, vertexCount1);

    // ---------------------------------------------------------------draw plane end! method 2-----------------------------------------------------------------------------



    // ---------------------------------------------------------------draw plane ! method 1-----------------------------------------------------------------------------
    /*gl1.useProgram(planeProgramInfo1.program);
    webglUtils.setBuffersAndAttributes(gl1, planeProgramInfo1, planeBufferInfo1);
    webglUtils.setUniforms(planeProgramInfo1, uniformsThatAreTheSameForAllObjects)
    // Draw plane
    cubeWorldMatrix = m4.translation(0, 0, 0);
    m4.multiply(viewProjectionMatrix, cubeWorldMatrix,
        uniformsThatAreComputedForEachObject.u_worldViewProjection);
    matrix = m4.multiply(viewMatrix, cubeWorldMatrix);
    m4.transpose(m4.inverse(cubeWorldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);
    // Set the uniforms we just computed
    webglUtils.setUniforms(planeProgramInfo1, uniformsThatAreComputedForEachObject);

    // Draw the geometry.
    gl1.drawElements(gl1.TRIANGLES, planeBufferInfo1.numElements, gl1.UNSIGNED_SHORT, 0);*/

    // ---------------------------------------------------------------draw plane end! method 1-----------------------------------------------------------------------------

    // ---------------------------------------------------------------draw cubes ! -----------------------------------------------------------------------------
    gl.useProgram(cubeProgramInfo1.program);

    // Setup all the needed attributes.
    webglUtils.setBuffersAndAttributes(gl, cubeProgramInfo1, cubeBufferInfo1);

    // Set the uniforms that are the same for all objects.
    webglUtils.setUniforms(cubeProgramInfo1, uniformsThatAreTheSameForAllObjects);


    // Draw objects

    var spread = 600;
    for(var i = 0; i < boujouPointsData.length; i++)
    {
        cubeWorldMatrix = m4.translation(boujouPointsData[i][0] * spread, boujouPointsData[i][1] * spread, boujouPointsData[i][2] * spread);
        m4.multiply(
            viewProjectionMatrix, cubeWorldMatrix,
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
        gl.drawElements(gl.TRIANGLES, cubeBufferInfo1.numElements, gl.UNSIGNED_SHORT, 0);

    }
    // ---------------------------------------------------------------draw cubes end! -----------------------------------------------------------------------------

    // ---------------------------------------------------------------draw boujou camera model ! -----------------------------------------------------------------------------

        gl.useProgram(boujouCameraModelProgram1);
        gl.enableVertexAttribArray(boujouCameraModelPositionAttributeLocation1);
        gl.bindBuffer(gl.ARRAY_BUFFER, boujouCameraModelPostionBuffer1);

        var size3 = 3;
        var type3 = gl.FLOAT;
        normalize = false;
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






    // ---------------------------------------------------------------draw boujou camera model end ! -----------------------------------------------------------------------------
    requestAnimationFrame(drawScene);
}

function reqData()
{
    // var url = "http://testopen.videoyi.com/webs/glsl/demo/boujou/test1/data/t3/res.txt";
    // var url = "data/t3/res.txt";
    var url = "src_files/data/t3/res.txt";
    $.get(url, onGotBoujouData);

}

function reqModel()
{
    // var url = "http://testopen.videoyi.com/webs/glsl/demo/boujou/test1/data/t3/res.txt";
    // var url = "data/t3/res.txt";
    // var url = "src_files/models/3/banana.obj";
    var url = "src_files/models/3/banana2.obj";
    // var url = "src_files/models/4/chair.obj";
    // var url = "src_files/models/5/scene.obj";
    $.get(url, onGotCameraModelData);

}


function onGotBoujouData(data, status)
{
    console.log("BoujouData == " + data);
    if(status == "success") {
        boujouDataStr = data;
        // boujouFramesData = getBoujouFramesData(boujouDataStr);
        // boujouPointsData = getBoujouPointsData(boujouDataStr);
        getBoujouFramesData(data);
        getBoujouPointsData(data);
    }

    // reqModel();
    renderthis();

}

function onGotCameraModelData(data, status)
{
    console.log("ModelData == " + data);
    if(status == "success") {
        boujouCameraModelDataStr = data;

        getCameraModelVerticesData(data);
        getCameraModelNormalsData(data);
    }

    renderthis();
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

    /*var str = '你的字符串'
    var res = str.match(/F(mm)(\S*)#3D Scene Points/)*/
    /*var str = data;
    var res = str.match(/F(mm)(\S*)#3D Scene Points/);

    console.log("------------------------------------\nnframesData == " + res);*/


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

function getCameraModelNormalsData(data)
{
    var beginIdx = data.indexOf("\nvn ");
    var endIdx = data.lastIndexOf("\n#vn");
    var str = data.substring(beginIdx, endIdx);
    var tempData = str.split("\n");
    for(var i = 0; i < tempData.length;i++)
    {
        if((tempData[i].length > 1) && (tempData[i] != " "))
        {
            var arr = tempData[i].split(" ");
            arr.splice(0, 1);
            // console.log("boujouCameraModelNormalsData ： 第" + i +"行数据：" + arr);
            boujouCameraModelNormalsData.push(arr);
        }
    }

    // boujouPointsData
    console.log("\n\n\n\n------------------------------------\nboujouCameraModelNormalsData == " + boujouCameraModelNormalsData);

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
    orbitRadius *= (1 - delta/100);// 滚轮向上滚，镜头推进，orbitRadius减小
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

    rotationX += (deltaY/3)/180;
    rotationY += (deltaX/3)/180;

    lastMouseX = newX;
    lastMouseY = newY;

    console.log(" deltaX == " + deltaX + ", deltaY == " + deltaY);
}

function addMouseWheelEvent(element, func) {
    if(typeof element.onmousewheel == "object") {
        // element.onmousewheel = function(event) {
        //     func(event);
        // };
        element.onmousewheel = func;
    }

    if(typeof element.onmousewheel == "undefined") {
        element.addEventListener("DOMMouseScroll", func, false);
    }
}

function main()
{
    reqData();
}

function renderthis() {
  // Get A WebGL context

  // Here we do this one 1 of 2 ways like many WebGL libraries. Either
  // we have a canvas1 on the page. Or else we have container and we
  // insert a canvas1 inside that container.
  // If we don't find a container we use the body of the document.

    if (!gl) {
        return;
    }

    // Compute the projection matrix
    aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    // 创建平面信息


    /*planePositions1 = [// wrong!
        -500, 300,
        500, 300,
        -400, -300,
        -400, -300,
        500, 300,
        400, -300
    ];*/

    /*planePositions1 = [// wrong!
        -400, 300,
        400, 300,
        -400, -300,
        -400, -300,
        400, 300,
        400, -300
    ];*/

    // x轴正方向向右，y轴正方向向下
    /*planePositions1 = [
        -400, -300,
        400, -300,
        -400, 300,
        -400, 300,
        400, -300,
        // 400, 300
        400, 390
    ];*/


    planePositions1 = [
        -800, -600, 0,
        800, -600, 0,
        -800, 600, 0,
        -800, 600, 0,
        800, -600, 0,
        // 400, 300
        800, 600, 0
    ];
    // planeBufferInfo1 = window.primitives.createPlaneBufferInfo(gl1, 320, 180, 16, 9);
    // planeProgramInfo1 = webglUtils.createProgramInfo(gl1, [planeVertexShaderSource1, planeFragmentShaderSource1]);
    planeProgram1 = webglUtils.createProgramFromSources(gl, [planeVertexShaderSource1, planeFragmentShaderSource1]);
    planePositionAttributeLocation1 = gl.getAttribLocation(planeProgram1, "a_position");
    // planeResolutionUniformLocation1 = gl1.getUniformLocation(planeProgram1, "u_resolution");
    planeMatrixLocation = gl.getUniformLocation(planeProgram1, "u_matrix");
    planePositionBuffer1 = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, planePositionBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planePositions1), gl.STATIC_DRAW);

    // gl1.bindBuffer(gl1.ARRAY_BUFFER, planePositionBuffer1);

  // 创建立方体顶点信息
    cubeBufferInfo1 = window.primitives.createCubeBufferInfo(gl, 8);// 8：size,表示单个立方体棱长
    //   var cubeBufferInfo1 = window.primitives.createCubeBufferInfo(gl1, 20);// 8：size,表示单个立方体棱长
    // setup GLSL program
    cubeProgramInfo1 = webglUtils.createProgramInfo(gl, [cubeVertexShaderSource1, cubeFragmentShaderSource1]);

    // 创建boujou摄像机模型:
    boujouCameraModelProgram1 = webglUtils.createProgramFromSources(gl, [boujouCameraModelVertexShaderSource1, boujouCameraModelFragmentShaderSource1]);
    boujouCameraModelPositionAttributeLocation1 = gl.getAttribLocation(boujouCameraModelProgram1, "a_position");

    boujouCameraModelMatrixLocation1 = gl.getUniformLocation(boujouCameraModelProgram1, "u_matrix");
    boujouCameraModelPostionBuffer1 = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, boujouCameraModelPostionBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boujouCameraModelPositions1), gl.STATIC_DRAW);

    requestAnimationFrame(drawScene);

  // Draw the scene.

}


function readFile(url)
{
  try {
    fso = new ActiveXObject("Scripting.FileSystemObject");
  }
  catch (e)
  {
    alert("当前浏览器不支持！");
    return;
  }

  alert("方法已执行！");
  var openf1 = fso.OpenTextFile(url);

  var str = openf1.ReadLine();
  alert("里面的内容为：'" + str + "'");
}

function jsReadFiles(file)
{
    var reader = new FileReader();
    if(/text+/.test(file.type))
    {
        reader.onload = function()
        {
            console.log(this.result);
        }
        // else if(/image/)
    }

}


// Check if we're running in jQuery
if (window.$) {
  window.$(function(){
      main();
  });
} else {
    main();
}




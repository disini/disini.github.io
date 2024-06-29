/* Licensed under a BSD license. See license.html for license */
"use strict";

var vertexShaderSource = `
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

var fragmentShaderSource = `
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

// 文件存储对象
var fso;

var boujouDataStr = "";
var boujouData = [];
var framesDataStr = "";
var framesData = [];

var pointsDataStr = "";
var pointsData = [];

var isMouseDown = false;
var lastMouseX = null;
var lastMouseY= null;

var orbitRadius = 1600;
var cameraPosition = [0, 0, orbitRadius];
var target = [0, 0, 0];
var up = [0, 1, 0];

var rotationX = 0;
var rotationY = 0;



function reqData()
{
    // var url = "http://testopen.videoyi.com/webs/glsl/demo/boujou/test1/data/t3/res.txt";
    // var url = "data/t3/res.txt";
    var url = "src_files/data/t3/res.txt";
    $.get(url, onGotData);

}


function onGotData(data, status)
{
    console.log(data);
    if(status == "success") {
        boujouDataStr = data;
        // framesData = getFramesData(boujouDataStr);
        // pointsData = getPointsData(boujouDataStr);
        getFramesData(boujouDataStr);
        getPointsData(boujouDataStr);
    }

    renderthis();
}

function getFramesData(data)
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
            console.log("framesData ： 第" + i +"行数据：" + arr);
            framesData.push(arr);
        }
    }

    // framesData
    console.log("\n\n\n\n------------------------------------\nframesData == " + framesData);

    /*var str = '你的字符串'
    var res = str.match(/F(mm)(\S*)#3D Scene Points/)*/
    /*var str = data;
    var res = str.match(/F(mm)(\S*)#3D Scene Points/);

    console.log("------------------------------------\nnframesData == " + res);*/


}

function getPointsData(data)
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
            console.log("pointsData ： 第" + i +"行数据：" + arr);
            pointsData.push(arr);
        }
    }

    // pointsData
    console.log("\n\n\n\n------------------------------------\npointsData == " + pointsData);

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
  // we have a canvas on the page. Or else we have container and we
  // insert a canvas inside that container.
  // If we don't find a container we use the body of the document.

  // var container = document.getElementById("canvas") || document.body;
  // var isCanvas = (container instanceof HTMLCanvasElement);
  // var canvas = isCanvas ? container : document.createElement("canvas");
  // canvas.width = 1600;
  // canvas.height = 900;

    // readFile("data/res.txt");
    // jsReadFiles("data/1.txt");
    // return;

    var container = document.getElementById("container");
    // var isCanvas = (container instanceof HTMLCanvasElement);
    var canvas = document.getElementById("canvas");
    // canvas.width = 1600;
    // canvas.height = 900;

    canvas.onmousedown = MouseDownHandler;
    // canvas.onmousewheel = MouseWheelHandler;
    // document.onmousewheel = MouseWheelHandler;
    document.onmouseup = MouseUpHandler;
    document.onmousemove = MouseMoveHandler;

    addMouseWheelEvent(canvas, MouseWheelHandler);

  var gl = canvas.getContext("webgl", { alpha: false });
  if (!gl) {
    return;
  }

  // if (!isCanvas) {
  //   container.appendChild(canvas);
  // }

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // 创建立方体顶点信息
  var bufferInfo = window.primitives.createCubeBufferInfo(gl, 8);// 8：size,表示单个立方体棱长
  //   var bufferInfo = window.primitives.createCubeBufferInfo(gl, 20);// 8：size,表示单个立方体棱长

  // setup GLSL program
  var programInfo = webglUtils.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource]);

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

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    webglUtils.resizeCanvasToDisplaySize(canvas);

    time *= 0.001;  // convert to seconds

    // Set the viewport to match the canvas
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas AND the depth buffer.
    // gl.clearColor( 1, 1, 1, 1 );
      gl.clearColor( 0, 0, 0, 1 );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
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

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.useProgram(programInfo.program);

    // Setup all the needed attributes.
    webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    // Set the uniforms that are the same for all objects.
    webglUtils.setUniforms(programInfo, uniformsThatAreTheSameForAllObjects);

    // Draw objects

      var spread = 600;
      for(var i = 0; i < pointsData.length; i++)
      {
          // for(var j = 0; j < pointsData[i].length;j++)
          // {
          //     var x = pointsData[i][j];
          // }
          var worldMatrix = m4.translation(pointsData[i][0] * spread, pointsData[i][1] * spread, pointsData[i][2] * spread);
          m4.multiply(
              viewProjectionMatrix, worldMatrix,
              uniformsThatAreComputedForEachObject.u_worldViewProjection);
          var matrix = m4.multiply(viewMatrix, worldMatrix);
          m4.transpose(m4.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);

          // Set the uniforms we just computed
          webglUtils.setUniforms(programInfo, uniformsThatAreComputedForEachObject);

          // Set a color for this object;
          for(var j = 0; j < 3;j++)
          {
              materialUniforms.u_diffuse[j] = pointsData[i][j]  * 0.5 + 0.5;
              // materialUniforms.u_diffuse[j] = 0.5;
          }
          // Set the uniforms that are specific to this object.
          webglUtils.setUniforms(programInfo, materialUniforms);

          // Draw the geometry.
            gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

      }

    /*var num = 4;
    var spread = 20;
    for (var zz = -num; zz <= num; ++zz) {
      for (var yy = -num; yy <= num; ++yy) {
        for (var xx = -num; xx <= num; ++xx) {
          var worldMatrix = m4.translation(xx * spread, yy * spread, zz * spread);

          // Multiply the matrices.
          m4.multiply(
              viewProjectionMatrix, worldMatrix,
              uniformsThatAreComputedForEachObject.u_worldViewProjection);
          var matrix = m4.multiply(viewMatrix, worldMatrix);
          m4.transpose(m4.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);

          // Set the uniforms we just computed
          webglUtils.setUniforms(programInfo, uniformsThatAreComputedForEachObject);

          // Set a color for this object.
          materialUniforms.u_diffuse[0] = xx / num * 0.5 + 0.5;
          materialUniforms.u_diffuse[1] = yy / num * 0.5 + 0.5;
          materialUniforms.u_diffuse[2] = zz / num * 0.5 + 0.5;

          // Set the uniforms that are specific to the this object.
          webglUtils.setUniforms(programInfo, materialUniforms);

          // Draw the geometry.
          gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
        }
      }
    }*/



    requestAnimationFrame(drawScene);
  }
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




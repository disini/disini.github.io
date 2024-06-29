"use strict";

var vertexShaderSource = `#version 300 es

        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        // in vec4 a_position;
        
        in vec2 a_position;
        
// Used to pass in the resolution of the canvas
        uniform vec2 u_resolution;
        
        uniform mat3 u_matrix;
        
        out vec4 v_color;
        
        // all shaders have a main function
        void main() {
            // gl_Position is a special variable a vertex shader is responsible for setting
            // gl_Position = a_position;
            
            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;
            
            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;
            
            // convert from 0->2 to -1->+1 (clipspace)
            vec2 clipSpace = zeroToTwo - 1.0;
            
            // gl_Position = vec4(clipSpace, 0, 1);
            // gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            // Multiply the position by the matrix.
             gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
            
            v_color = gl_Position * 0.5 + 0.5;
        }`;



var fragmentShaderSource = `#version 300 es

        // fragment shaders don't have a default precision so we need to pick one. mediump is a good default.
        // It means "medium precision"
        precision mediump float;
        // uniform vec4 u_color;
        in vec4 v_color;
        out vec4 outColor;

        void main() {
            // Just set the output to a constant reddish-purple
//            outColor = vec4(1, 0, 0.5, 1);
//                outColor = vec4(0, 1, 0.5, 1);
//               outColor = u_color;
            outColor = v_color;
        }`;

var increment_X = 0.3;
var increment_Y = 0.6;
var frame = 0;
var offsetX = 0;
var offsetY = 0;

function main() {
    // get a webgl context
    var canvas = document.getElementById("canvas1");
    var gl = canvas.getContext("webgl2");
    /*var gl = canvas.getContext("webgl2", {
        premultipliedAlpha: false
    });*/
    if(!gl) {
        console.log("this browser doesn't support webgl2!");
        return;

    }
    console.log("this browser support webgl2!");

    // create GLSL shader, upload the GLSL source, compile the shaders
    // var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    // var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the two shaders into a program
    // var program = createProgram(gl, vertexShader, fragmentShader);

    var program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");


   // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    var colorLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer and put a single pixel space rectangle in it(2 triangles)
    // // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    // three 2d points
   /* var positions = [
        0, 0,
        0, -0.5,
        -0.7, 0
    ];*/

    /*var positions = [
        -10, 20,
        180, 320,
        410, 30,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);*/


    setGeometry(gl);

    // Create a vertex array object(attribute state)
    var vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute;
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;// 2 components per iteration
    var type = gl.FLOAT;// the data is 32bit floats
    var normalize = false;// don't normalize the data
    var stride = 0;// 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;// start at the beginning of the buffer

    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    var translation = [250, 200];
    var angleInRadians = 0;
    var scale = [1, 1];

    drawScene();

    // webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    setupUI();


	function setupUI() {
        webglLessonsUI.setupSlider("#x", {value: translation[0], slide:updatePosition(0), max: gl.canvas.width });
        webglLessonsUI.setupSlider("#y", {value: translation[1], slide:updatePosition(1), max: gl.canvas.height});
        webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
        webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
        webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
    }
    
    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        angleInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        }
    }
    // Draw the scene
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell webgl how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        // gl.clearColor(0.6, 0, 0, 0.2);
        gl.clearColor(0, 0, 0.5, 0.2);
        // gl.clearColor(0, 0, 0, 0.01);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Compute the matrix
        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        // Tell it to use our program(pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // // Pass in the canvas resolution so we can convert from pixels to clipSpace in the shader
        // gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        console.log(matrixLocation);
        // Set the matrix
        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        // var count = 3;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }

    update();

    function update() {
        frame += 0.1;
        offsetX = 200 * Math.cos(Math.PI + frame/8);
        offsetY = 200 * Math.sin(frame/8);
        translation[0] = 250 + offsetX;
        translation[1] = 200 + offsetY;
        scale[0] = 0.5 + 0.1 * Math.cos(Math.PI + frame/8);
        scale[1] = 0.5 + 0.1 * Math.sin(frame/8);
        angleInRadians += 0.06;
        drawScene();

        requestAnimationFrame(update);
    }

    /*webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell webgl how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program(pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Pass in the canvas resolution so we cam convert from pixels to clipSpace in the shader
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);


    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    // var count = 3;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);*/


    }

// Fill the buffer with the value that define a triangle.
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, -100,
            150, 125,
            -175, 100]),
        gl.STATIC_DRAW);

}



    main();
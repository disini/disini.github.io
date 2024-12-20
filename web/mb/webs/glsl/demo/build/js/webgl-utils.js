
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function() {
            return factory.call(root);
        });
    } else {
        // Browser globals
        root.webglUtils = factory.call(root);
    }
}(this, function() {
    "use strict";

    var topWindow = this;

        function error(msg) {
            if (topWindow.console) {
                if(topWindow.console.error) {
                    topWindow.console.error(msg);
                } else if (topWindow.console.log) {
                    topWindow.console.log(msg);
                }
            }
        }

        function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
            var errFn = opt_errorCallback || error;
            // Create the shader object
            var shader = gl.createShader(shaderType);

            // Load the shader source
            gl.shaderSource(shader, shaderSource);

            // Compile the shader
            gl.compileShader(shader);

            // Check the compile status
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if(!compiled) {
                // Something went wrong during compilation: get the error
                var lastError = gl.getShaderInfoLog(shader);
                errFn("*** Error compiling shader '" + shader + "':" + lastError);
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }

        function createProgram(
            gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
            var errFn = opt_errorCallback || error;
            var program = gl.createProgram();
            shaders.forEach(function (shader) {
                gl.attachShader(program, shader);
            });

            if (opt_attribs) {
                opt_attribs.forEach(function (attrib, ndx) {
                    gl.bindAttribLocation(
                        program,
                        opt_lccations ? opt_locations[ndx] : ndx,
                        attrib
                    );
                });
            }

            gl.linkProgram(program);

            // Check the link status
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                // something went wrong with the link
                var lastError = gl.getProgramInfoLog(program);
                errFn("Error in program linking:" + lastError);


                gl.deleteProgram(program);
                return null;
            }

            return program;

        }

        var defaultShaderType = [
            "VERTEX_SHADER",
            "FRAGMENT_SHADER"
        ]


        function createProgramFromSources(
            gl, shaderSources,opt_attribs, opt_locations, opt_errorCallback) {
            var shaders = [];
            for (var ii = 0; ii < shaderSources.length; ii++) {
                shaders.push(loadShader(
                    gl, shaderSources[ii], gl[defaultShaderType[ii]], opt_errorCallback
                    )
                );
            }

            return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
        }


        function resizeCanvasToDisplaySize(canvas, multiplier) {
            multiplier = multiplier || 1;
            var width = canvas.clientWidth * multiplier | 0;
            var height = canvas.clientHeight * multiplier | 0;

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                return true;
            }

            return false;
        }

        return {
            createProgram: createProgram,
            createProgramFromSources: createProgramFromSources,
            resizeCanvasToDisplaySize: resizeCanvasToDisplaySize
        }

        }
    )
);
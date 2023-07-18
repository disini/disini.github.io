
<template>
  <div class="page-container">
    <div>{{ title }}</div>
    <div class="three-d-views">
      <div class="webgl-view">
        <canvas id="webgl-canvas" width="800" height="600"></canvas>
      </div>
      <div class="renderer-view">
        <canvas id="renderer-canvas" width="800" height="600"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  display: flex;
  background: #7f7f7f;
  min-height: 1024px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.three-d-views {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.webgl-view {
  background: black;
  width: 800px;
  height: 600px;
}

#webgl-canvas {
  width: 100%;
  height: 100%;
}

.renderer-view {
  background: green;
  width: 800px;
  height: 600px;
}
</style>

<script>
// @ is an alias to /src

import { Renderer } from '../renderer/renderer'

export default {
  name: "Home",
  data: () => {
    return { 
      title: "",
      renderer: null
    };
  },
  created: () => {
    console.log("Renderer.vue Created");
  },
  mounted: () => {
    console.log("Renderer.vue Mounted");

    var canvas = document.getElementById("renderer-canvas");
    var ctx = canvas.getContext("2d");

    const width = 800;
    const height = 600;

    var myImageData = ctx.createImageData(width, height);

    const data = myImageData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = Math.random() * 255;
      data[i + 1] = Math.random() * 255;
      data[i + 2] = Math.random() * 255;
      data[i + 3] = 255;
    }

    ctx.putImageData(myImageData, 0, 0);

    // this.initWebGL();
    // this.initRenderer();

    const renderer = new Renderer();
    console.log(renderer);
    renderer.render();
  },
  methods: {
    initRenderer: () => {},
    initWebGL() {
      var canvas = document.getElementById("webgl-canvas");
      var gl = canvas.getContext("experimental-webgl");

      /*======== Defining and storing the geometry ===========*/
      var vertices = [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
      var indices = [0, 1, 2];
      // Create an empty buffer object to store vertex buffer
      var vertex_buffer = gl.createBuffer();
      // Bind appropriate array buffer to it
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      // Pass the vertex data to the buffer
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
      );
      // Unbind the buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      // Create an empty buffer object to store Index buffer
      var Index_Buffer = gl.createBuffer();
      // Bind appropriate array buffer to it
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
      // Pass the vertex data to the buffer
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
      );
      // Unbind the buffer
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      /*================ Shaders ====================*/
      // Vertex shader source code
      var vertCode =
        "attribute vec3 coordinates;" +
        "void main(void) {" +
        " gl_Position = vec4(coordinates, 1.0);" +
        "}";
      // Create a vertex shader object
      var vertShader = gl.createShader(gl.VERTEX_SHADER);
      // Attach vertex shader source code
      gl.shaderSource(vertShader, vertCode);
      // Compile the vertex shader
      gl.compileShader(vertShader);
      //fragment shader source code
      var fragCode =
        "void main(void) {" + " gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);" + "}";
      // Create fragment shader object
      var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      // Attach fragment shader source code
      gl.shaderSource(fragShader, fragCode);
      // Compile the fragmenttshader
      gl.compileShader(fragShader);
      // Create a shader program object to store
      // the combined shader program
      var shaderProgram = gl.createProgram();
      // Attach a vertex shader
      gl.attachShader(shaderProgram, vertShader);
      // Attach a fragment shader
      gl.attachShader(shaderProgram, fragShader);
      // Link both the programs
      gl.linkProgram(shaderProgram);
      // Use the combined shader program object
      gl.useProgram(shaderProgram);
      /*======= Associatingshaders to buffer objects =======*/
      // Bind vertex buffer object
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      // Bind index buffer object
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
      // Get the attribute location
      var coord = gl.getAttribLocation(shaderProgram, "coordinates");
      // Point an attribute to the currently bound VBO
      gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
      // Enable the attribute
      gl.enableVertexAttribArray(coord);
      /*=========Drawing the triangle===========*/
      // Clear the canvas
      gl.clearColor(0.0, 0.0, 0.0, 1);
      // Enable the depth test
      gl.enable(gl.DEPTH_TEST);
      // Clear the color buffer bit
      gl.clear(gl.COLOR_BUFFER_BIT);
      // Set the view port
      gl.viewport(0, 0, canvas.width, canvas.height);
      // Draw the triangle
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    },
  },
};
</script>

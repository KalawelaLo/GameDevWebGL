// @ts-check

class Material {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {any} vs
   * @param {any} fs
   */
  constructor(gl, vs, fs) {
    //let vsShader = this.getShader(vs, this.gl.VERTEX_SHADER);
    //let fsShader = this.getShader(fs, this.gl.FRAGMENT_SHADER);

    this.gl = gl;
    this.program = this.gl.createProgram();

    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(this.vertexShader, vs);
    this.gl.compileShader(this.vertexShader);
    this.gl.attachShader(this.program, this.vertexShader);

    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(this.fragmentShader, fs);
    this.gl.compileShader(this.fragmentShader);
    this.gl.attachShader(this.program, this.fragmentShader);

    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.log(this.gl.getShaderInfoLog(this.vertexShader));
      console.log(this.gl.getShaderInfoLog(this.fragmentShader));
    }

    this.gl.detachShader(this.program, this.vertexShader);
    this.gl.detachShader(this.program, this.fragmentShader);
    this.gl.deleteShader(this.vertexShader);
    this.gl.deleteShader(this.fragmentShader);
    this.gl.useProgram(null);
  }
}
export class Sprite {
  /**
   * @param {WebGL2RenderingContext} gl
   */
  constructor(gl, img_url, vs, fs) {
    this.gl = gl;
    this.spritePos = [0,0];

    this.material = new Material(this.gl, vs, fs);
    this.gl.useProgram(this.material.program);
    this.aPosition = gl.getAttribLocation(this.material.program, "aPosition");
    this.aTexcoord = gl.getAttribLocation(this.material.program, "aTexCoord");
    this.aOffset = gl.getUniformLocation(this.material.program, "aOffset");
    this.uImage = gl.getUniformLocation(this.material.program, "uImage");

    this.positionBuffer = gl.createBuffer();
    this.textureBuffer = gl.createBuffer();
    this.offsetBuffer = gl.createBuffer();
    this.offsetData = new Float32Array(2); //2 floats each vertex

    this.setup();
    this.gl.useProgram(null);
  }

  setup() {
    //setup position buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    //changed once per draw so static_draw is fine for these
    this.gl.bufferData(this.gl.ARRAY_BUFFER, Sprite.createUnitSquare(), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.aPosition, 2, this.gl.FLOAT, false, 8, 0);
    this.gl.enableVertexAttribArray(this.aPosition);

    //setup offset buffer
    /*     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.offsetBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.offsetData.byteLength, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.aOffset, 2, this.gl.FLOAT, false, 8, 0);
    this.gl.enableVertexAttribArray(this.aOffset);
    this.gl.vertexAttribDivisor(this.aOffset, 1); //use twice for both traingles? 1 works?
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.offsetData); */




    
  }
  move(x, y) {
    this.gl.useProgram(this.material.program);
    this.spritePos[0] +=x;
    this.spritePos[1] +=y;
    this.gl.uniform2f(this.aOffset, this.spritePos[0], this.spritePos[1]);
    this.gl.useProgram(null);
  }
  setPos(x, y) {
    this.gl.useProgram(this.material.program);
    this.spritePos[0] =x;
    this.spritePos[1] =y;
    this.gl.uniform2f(this.aOffset, this.spritePos[0], this.spritePos[1]);
    this.gl.useProgram(null);
  }

  static createUnitSquare() {
    //length == 12
    return new Float32Array([-1, 0, 0, 1, -1, 1, -1, 0, 0, 0, 0, 1]);
  }

  draw() {
    this.gl.useProgram(this.material.program);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.useProgram(null);
  }
}

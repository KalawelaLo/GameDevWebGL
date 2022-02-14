// @ts-check
class Material {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} vs
   * @param {string} fs
   */
  constructor(gl, vs, fs) {
    this.gl = gl;
    this.program = this.gl.createProgram();

    //create, compile, and bind shaders
    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(this.vertexShader, vs);
    this.gl.compileShader(this.vertexShader);
    this.gl.attachShader(this.program, this.vertexShader);
    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(this.fragmentShader, fs);
    this.gl.compileShader(this.fragmentShader);
    this.gl.attachShader(this.program, this.fragmentShader);

    //link to program
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.log(this.gl.getShaderInfoLog(this.vertexShader));
      console.log(this.gl.getShaderInfoLog(this.fragmentShader));
    }
    // necessary?
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
    this.spritePos = [0, 0];

    //create new material to use its program shaders
    this.material = new Material(this.gl, vs, fs);
    this.gl.useProgram(this.material.program);
    //attirbute and uniform locations
    this.aPosition = gl.getAttribLocation(this.material.program, "aPosition");
    this.aTexcoord = gl.getAttribLocation(this.material.program, "aTexCoord");
    this.aOffset = gl.getUniformLocation(this.material.program, "aOffset");
    this.uImage = gl.getUniformLocation(this.material.program, "uImage");
    this.aTexcoordOffset = gl.getUniformLocation(this.material.program, "aTexCoordOffset");
    this.uScale = gl.getUniformLocation(this.material.program, "uScale");
    this.gl.uniform2f(this.uScale, 1, 1); //default to 1
    //create buffers
    this.positionBuffer = gl.createBuffer();
    this.textureCoordBuffer = this.gl.createBuffer();
    this.offsetData = new Float32Array(2); //2 floats each vertex

    //default texCoords (whole picture) x ranges from 0-1 same with y starts top left 0,0
    this.textureCoordData = new Float32Array([0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0]);
    //TODO: might need this for later for async loading
    //this.tempimg = new Uint8Array([0, 255, 0, 1]);
    this.texture = this.gl.createTexture();
    //new html image element
    this.image = new Image();
    //async program with await inside
    //need to load the texure before we assign it
    this.loadTexture(img_url);

    //setup position buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    //changed once per draw so static_draw is fine for these. Right?
    this.gl.bufferData(this.gl.ARRAY_BUFFER, Sprite.createUnitSquare(), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.aPosition, 2, this.gl.FLOAT, false, 8, 0);
    this.gl.enableVertexAttribArray(this.aPosition);
    //set program to null, not needed but incase we forget to useProg we will get an error
    //instead of none and a head scratcher
    this.gl.useProgram(null);
  }
  //moves the position of the sprite by adding to an offset variable in the vertex shader
  move(x, y) {
    this.gl.useProgram(this.material.program);
    this.spritePos[0] += x;
    this.spritePos[1] += y;
    this.gl.uniform2f(this.aOffset, this.spritePos[0], this.spritePos[1]);
    this.gl.useProgram(null);
  }
  //moves the position of the sprite by settting the value of the offset variable in the vertex shader
  setPos(x, y) {
    this.gl.useProgram(this.material.program);
    this.spritePos[0] = x;
    this.spritePos[1] = y;
    this.gl.uniform2f(this.aOffset, this.spritePos[0], this.spritePos[1]);
    this.gl.useProgram(null);
  }
  static createUnitSquare() {
    //length == 12
    return new Float32Array([-1, 0, 0, 1, -1, 1, -1, 0, 0, 0, 0, 1]);
  }
//async load texture funtion provided a texture url
   async loadTexture(img_url) {
    const loadAtlas = () =>
      new Promise((resolve) => {
        this.image.src = img_url;
        this.image.addEventListener("load", () => resolve(this.image));
      });

    this.image = await loadAtlas();
    this.gl.useProgram(this.material.program);

    //Texture Buffer Setup
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.textureCoordData, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.aTexcoord, 2, this.gl.FLOAT, false, 8, 0);
    this.gl.enableVertexAttribArray(this.aTexcoord);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.image.width,
      this.image.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.image
    );
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    //texture filters, currently set to nearest neighbor for pixely goodness
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  }

  setTileSize(size) {
    let w = size / this.image.width;
    let h = size / this.image.height;
    let hPadding = 0;
    let vPadding = 0;
    let tilesX = this.image.height / size;
    let tilesY = this.image.width / size;
    //Generate a large buffer with texCoords for every vertex
    let numberOfTiles = tilesY * tilesX;
    let texCoordsAllVertex = new Float32Array(2 * 6 * numberOfTiles); //* numberOfTiles
    let index = 0;
    
    //setups the texCoords for every possible sprite postion for easy performant changing of currently
    //displayed tile (more memory but negligible) vec2 for every vertex * number of tiles
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        //let x = 0;
        //let y = 0;
        //console.log(x+' '+y);
        texCoordsAllVertex[0 + index * 12] = w * x;
        texCoordsAllVertex[1 + index * 12] = h * y + h;

        texCoordsAllVertex[2 + index * 12] = w * x + w;
        texCoordsAllVertex[3 + index * 12] = h * y;

        texCoordsAllVertex[4 + index * 12] = w * x;
        texCoordsAllVertex[5 + index * 12] = h * y;

        texCoordsAllVertex[6 + index * 12] = w * x;
        texCoordsAllVertex[7 + index * 12] = 1 * h;

        texCoordsAllVertex[8 + index * 12] = w * x + w;
        texCoordsAllVertex[9 + index * 12] = 1 * h;

        texCoordsAllVertex[10 + index * 12] = w * x + w;
        texCoordsAllVertex[11 + index * 12] = 0 * h;
        index++;
      }
    }

    this.gl.useProgram(this.material.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoordsAllVertex, this.gl.STATIC_DRAW);
    this.gl.useProgram(null);
  }
  //Set scale of sprite along x and y axis // todo need to make wait?
  setScale(x, y) {
    this.gl.useProgram(this.material.program);
    this.gl.uniform2f(this.uScale, x, y);
    this.gl.useProgram(null);
  }
  //set the tile to be rendered (used to set the buffer offset)
  tileToRender(tileNumber) {
    //48 is 8*6 each index is 8 bytes in length, 2 values for each index 4 bytes
    //6 vertex's so we get 2 * 4 * 6 == 48
    this.selectedTile = tileNumber * 48; 
  }
  //draw the sprite with its current values
  draw() {
    //bind shaders and buffers
    this.gl.useProgram(this.material.program);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    //use potentially modified offset
    this.gl.vertexAttribPointer(this.aTexcoord, 2, this.gl.FLOAT, false, 8, this.selectedTile);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    this.gl.useProgram(null);
  }
}

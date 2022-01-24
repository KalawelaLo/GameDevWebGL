import { GameEngine } from "./game.js";

function main() {
    const canvas = document.getElementById("webGlCanvas");
    const gl = canvas.getContext("webgl2");
    const body = document.querySelector("body");

    //if WebGL context didn't work
    if (gl == null) {
        alert("WebGl not Initialized");
        return -1;
    }

    //this set the COLOR_BUFFER_BIT,
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clears the screen to the color of COLOR_BUFFER_BIT
    gl.clear(gl.COLOR_BUFFER_BIT);

    const Game = new GameEngine(gl, canvas, body);


    //this is the game loop, It is tied to the rendering.
    //this allows for us to configure framerate with webGl.
    window.loop = function () {
        if(Game.gameDone) return 0;
        window.requestAnimationFrame( main );
      
        // Whatever your main loop needs to do
        Game.update();
        Game.draw();
      };
      
    loop(); // Start the cycle
}

//When webpage initally loads, it calls start
window.onload = main;

import { GameEngine } from "./game.js";

function main() {
   
    const Game = new GameEngine(document, window);

    //this is the game loop, It is tied to the rendering.
    //this allows for us to configure framerate with webGl.
    window.loop = function () {
        if(Game.gameDone) return 0;
        window.requestAnimationFrame( loop );
      
        // Whatever your main loop needs to do
        Game.update();
        Game.draw();
      };
      
    loop(); // Start the cycle
}

//When webpage initally loads, it calls start
window.onload = main;

import { GameEngine } from "./game.js";


function main() {
  const Game = new GameEngine(document, window);


  window.loop = function () {
    if (Game.gameDone) return 0;
    window.requestAnimationFrame(loop);

    // Whatever your main loop needs to do
    Game.update();

    Game.draw();
  };





  
  loop(); // Start the cycle
}

//When webpage initally loads, it calls start
window.onload = main;

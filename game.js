import { AudioManager } from "./gameAudio.js";
import { InputManager } from "./gameInput.js";
import { Sprite } from "./sprite.js";

export class GameEngine {
  constructor(doc, win) {
    console.log("Init Game");

    //we do it this way so we get gl intellisence
    //ez to revert at the end if we want to tho
    //const canvas = document.createElement("canvas");
    //document.querySelector("body").appendChild(canvas);

    //TODO temp auto size forced 16/9 solution
    //problem: doesnt ajust to window size ajustment, need listener?

    //const gl = canvas.getContext("webgl2");

    //I am trying to keep the constructor clean (:
    const canvas = doc.getElementById("webGlCanvas");
    const body = doc.querySelector("body");
    //canvas.width = 400;
    //canvas.height = 400;
    canvas.width = window.innerWidth - window.innerWidth / 20;
    canvas.height = (canvas.width * 9) / 16;
    const gl = canvas.getContext("webgl2");





    console.log("Init WebGl");
    //if WebGL context didn't work
    if (gl == null) {
      alert("WebGl not Initialized");
      return null;
    }

    //This is the main WebGl Context
    this.gl = gl;

    //These are for handling in game-stuffs
    this.gameDone = false;
    this.eventQueue = [];

    //This is used for Audio Support
    console.log("Init Audio");

    this.audioManager = new AudioManager(win, doc, this.eventQueue);

    //TODO: i broke the input manager :(
    this.inputManage = new InputManager(doc, this.eventQueue, this.audioManager);

    //this set the COLOR_BUFFER_BIT,
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clears the screen to the color of COLOR_BUFFER_BIT
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Load IO Support
    console.log("Init IO support");

    //Load Audio assets
    this.setupAudio();
   

    //loading shaders
    let texLoc = "assets/texture/pongStuff.png";
    let sadCat = "assets/texture/sadCat.jpg";
    let vs = document.getElementById("vs_Sprite").innerHTML;
    let fs = document.getElementById("fs_Sprite").innerHTML;
    //load sprites maybe array so we can add and remove on cammand

    //we will just send the image directly load here maybe
    
//creating sprites
    this.leftPaddle = new Sprite(this.gl, texLoc, vs, fs);
    this.rightPaddle = new Sprite(this.gl, texLoc, vs, fs);
    this.leftScore = new Sprite(this.gl, texLoc, vs, fs);
    this.rightScore = new Sprite(this.gl, texLoc, vs, fs);
    this.background = new Sprite(this.gl, sadCat, vs, fs);
    
    //setup position, size and other things 
    this.setupGaphics();
  }

  //Audio Setup
  setupAudio() {
    //just some filler stuff. This is where audio would be loaded initially.

    console.log("in setup");
    const track = this.audioManager.getTrack("./assets/audio/test.m4a");

    //muted this...it got old quick
    //this.audioManager.play(track);

    setTimeout((tr) => this.audioManager.pause(tr), 2000, track);

    //the idea is to decretize the loading
  }
  setupGaphics() {
    //load assets for the game graphics.
    //TERRIBLE SOLUTION ASK KALA D: // just modify to use 1px by 1px image till image loads..but we need width info
    // set sprite locations and sizes
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const TempFix = async () => {
      await delay(500);
      console.log("Waited 5s");

      this.rightPaddle.setPos(1,-1);

      this.leftPaddle.setTileSize(32);
      this.leftPaddle.tileToRender(0);
      this.rightPaddle.setTileSize(32);
      this.rightPaddle.tileToRender(1);

      this.leftScore.setTileSize(32);
      this.leftScore.tileToRender(2);
      this.leftScore.setPos(0,0.8);
      this.leftScore.setScale(0.2,0.2);

      this.rightScore.setTileSize(32);
      this.rightScore.tileToRender(3);
      this.rightScore.setPos(0.2,0.8);
      this.rightScore.setScale(0.2,0.2);

      this.background.setScale(2,2);
      this.background.setPos(1,-1);
    };
    TempFix();
    //enables blend(transparency)
    this.gl.enable(this.gl.BLEND);
  }

  //game stuffs
  update() {
    //handle input & events
    while (this.eventQueue.length > 0) {
      let e = this.eventQueue.pop();
      if (e.evt === "trackblocked") {
        this.audioManager.trackQueue(e.track);
      } else if (e.evt === "trackqueue") {
        this.audioManager.play(e.track);
      }
      //console.log(e);
    }
    //update objects within game

    //move paddles //Temp since they are framerate based >:(
    //We need a clock. Use time delta between frames
    this.leftPaddle.move(0.0000,-0.0001);
    this.rightPaddle.move(0.0000,0.0001);

  }

  draw() {
    //clears the screen to the color of COLOR_BUFFER_BIT
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); //BufferBit is black rn.
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    //draw updated objects. Order Matters
    this.background.draw();
    this.leftScore.draw();
    this.rightScore.draw();
    this.leftPaddle.draw();
    this.rightPaddle.draw();
    this.background

    //I belive these happen here        and these happen somewhere else

    //vertex specification

    //vertex shader --->> shadders

    //tessalation --->> shadders

    //geometry --->> shadders

    //vertex post processing

    //primitive assembly

    //rasteriation

    //fragment shader --->> shadders

    //per sample operations
  }

}

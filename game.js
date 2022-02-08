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
    this.setupGaphics();

    //loading shaders
    let texLoc = "assets/texture/pongStuff.png";
    let vs = document.getElementById("vs_Sprite").innerHTML;
    let fs = document.getElementById("fs_Sprite").innerHTML;
    //load sprites maybe array so we can add and remove on cammand

    //we will just send the image directly load here maybe
    this.leftPaddle = new Sprite(this.gl, texLoc, vs, fs);
    this.rightPaddle = new Sprite(this.gl, texLoc, vs, fs);
    this.rightPaddle.setPos(1,-1);
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

    this.leftPaddle.move(0.0000,-0.0001);
    this.rightPaddle.move(0.0000,0.0001);

  }

  draw() {
    //clears the screen to the color of COLOR_BUFFER_BIT
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); //BufferBit is black rn.

    //draw updated objects.
    this.leftPaddle.draw();
    this.rightPaddle.draw();
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

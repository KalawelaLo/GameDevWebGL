import { AudioManager } from "./gameAudio.js";

export class GameEngine {
    constructor(doc, win){
        console.log("Init Game");
        //I am trying to keep the constructor clean (:
        const canvas = doc.getElementById("webGlCanvas");
        const gl = canvas.getContext("webgl2");
        const body = doc.querySelector("body");
        
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

        //These are used for IO support
        this.canvas = canvas;
        this.body = body;

        //This is used for Audio Support
        console.log("Init Audio");
        
        this.audioManager = new AudioManager(win, doc, this.eventQueue);
        
        //this set the COLOR_BUFFER_BIT,
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        //clears the screen to the color of COLOR_BUFFER_BIT
        gl.clear(gl.COLOR_BUFFER_BIT);


        //Load IO Support
        console.log("Init IO support");
        this.setupIO();

        //Load Audio assets
        this.setupAudio();
    }

    //IO Support functions
    mousePos(ev) {
        //Get relative in canvas
        //let bounds = ev.srcElement.BoundingClientRect();
        if (this.audioManager.ctx.state === 'suspended') {
            this.audioManager.setActive();
        }
        return {
            x: ev.clientX,
            y: ev.clientY
    };}
    //Main setup for IO
    setupIO(){
        //keyboard ----> end up on event queue
        this.body.addEventListener("keydown", (ev) => {
            if (this.audioManager.ctx.state === 'suspended') {
                this.audioManager.setActive();
            }
            this.eventQueue.push({
                evt: "keydown",
                key: ev.key});
        }, false);
        this.body.addEventListener("keyup", (ev) => {
            this.eventQueue.push({
                evt: "keyup", 
                key: ev.key});
        }, false);

        //mouse function ----> end up on event queue
        this.canvas.addEventListener("mousemove", (ev) => {
            var mPos = this.mousePos(ev);
            this.eventQueue.push({
                evt: "mousemove",
                x: mPos.x,
                y: mPos.y
            });
        }, false);

        this.canvas.addEventListener("mousedown", (ev) => {
            let mPos = this.mousePos(ev);
            this.eventQueue.push({
                evt: "mousedown",
                x: mPos.x,
                y: mPos.y,
                mBtn: ev.which //1 left, 2 middle, 3 right
            });
        }, false);

        this.canvas.addEventListener("mouseup", (ev) => {
            let mPos = this.mousePos(ev);
            this.eventQueue.push({
                evt: "mouseup",
                x: mPos.x,
                y: mPos.y,
                mBtn: ev.which //1 left, 2 middle, 3 right
            });
        }, false);
    }
    //Audio Setup
    setupAudio(){
        console.log("in setup");
        const track = this.audioManager.getTrack("./assets/audio/test.m4a");
        this.audioManager.play(track);
        setTimeout((tr) => this.audioManager.pause(tr) , 2000, track);
    }
    //game stuffs
    update(){

        //handle input & events
        while (this.eventQueue.length > 0) {
            let e = this.eventQueue.pop();
            if (e.evt === 'trackblocked') {
                this.audioManager.trackQueue(e.track);
            } else if (e.evt === 'trackqueue') {
                this.audioManager.play(e.track);
                
            }
            console.log(e);
        }
        this.eventQueue;


        //update objects within game
        
    }
    draw(){

        //draw updated objects.

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
};
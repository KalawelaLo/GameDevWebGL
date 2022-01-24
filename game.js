export class GameEngine {
    constructor(gl_context, canvas, body){
        //I am trying to keep the constructor clean (:

        //This is the main WebGl Context
        this.gl = gl_context;

        //These are used for IO support
        this.canvas = canvas;
        this.body = body;

        //These are for handling in game-stuffs
        this.gameDone = false;
        this.eventQueue = [];

        this.setupIO();
    }

    //IO Support functions
    mousePos(ev) {
        //Get relative in canvas
        //let bounds = ev.srcElement.BoundingClientRect();
        let X = ev.clientX;
        let Y = ev.clientY;
        return {
            x: X,
            y: Y
    };}
    //Main setup for other stuffs
    setupIO(){
        //keyboard ----> end up on event queue
        this.body.addEventListener("keydown", (ev) => {
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
    update(){

        //handle input & events
        while (this.eventQueue.length > 0) {
            let e = this.eventQueue.pop();
            console.log(e);
        }


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
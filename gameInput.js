export class InputManager {
    constructor(doc, evtQ, auMan){
        this.canvas = doc.getElementById("webGlCanvas");
        this.body = doc.querySelector("body");
        this.audioManager = auMan;
        this.eventQueue = evtQ;
        this.setupIO();
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
}
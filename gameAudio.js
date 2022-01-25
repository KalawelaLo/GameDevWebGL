export class AudioManager {

    //Contructor
    constructor(win, doc, evtQ){
        this.win = win;
        this.doc = doc;
        this.ctx = null;
        this.eventQueue = evtQ;
        this.setup()
    }

    //make a general context
    setup() {
        const AudioContext = this.win.AudioContext || this.win.webkitAudioContext;
        this.ctx = new AudioContext();
    }

    //returns a track object, contains all track info
    getTrack(filePath){
        const audioElement = this.doc.createElement("audio");
        const body = this.doc.querySelector("body");
        audioElement.setAttribute('src', filePath);
        const trk = this.ctx.createMediaElementSource(audioElement);
        body.appendChild(audioElement);
        audioElement.load();

        const gn = this.ctx.createGain();
        const pn = new StereoPannerNode(this.ctx, { pan: 0 });
        trk.connect(gn).connect(pn).connect(this.ctx.destination);


        return {
            elem: audioElement, //expose the actual html element
            track: trk, //exposes track, in case of editing more itermediary features.
            gain: gn, //exposed the gain features
            pan: pn //exposes paneramic sound features
        };
    }

    //after there is user input, we can try to get sounds to "turn on"
    setActive() {
        this.ctx.resume();
        this.eventQueue.push({
            evt: "audioresume"
        });
    }

    //pauses a track
    pause(trk) {
        if(this.ctx.state === 'running'){
            trk.elem.pause();
            this.eventQueue.push({
                evt: "trackpause",
                track: trk
            })
        } else {
            this.eventQueue.push({
                evt: "trackblocked",
                track: trk,
                reason: this.ctx.state
            })
        }
    }

    //attempts to play the track
    play(trk) {
        //keeps tracks from blocking
        setTimeout((trk, eq) => {
            if (this.ctx.state === 'running'){
                trk.elem.play();
                eq.push({
                    evt: "trackplay",
                    track: trk
                });
            } else {
                eq.push({
                    evt: "trackblocked",
                    track: trk,
                    reason: this.ctx.state
                });
            }
        }, 1000/60, trk, this.eventQueue);
    }
      
    //queues a track to play immediately.
    trackQueue(trk){
        //keeps tracks from blocking
        setTimeout((trk, eq) => {
            eq.push({
                evt: "trackqueue",
                track: trk
            });
        }, 1000/60, trk, this.eventQueue);
    }
}
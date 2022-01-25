# GameDevWebGL

## Getting Started

After you checkout the project. You need run a server to localhost
to use it. This is because web browsers prevent JS pulling in more
JS files from the direct local machine. Browsers do it to keep from
making machines vunerable.

There are a lot of ways to host this to your local host.
---------------------------------------------
If you have NodeJS, you can easily host a webserver from any directory.
```
    $   npm install http-server -g
```
Then you just navigate to you directory and run it.
```
    $   cd /theDirctory
    $   http-server
```
When you are done just Ctrl-C
------------------------------------------
If you have python installed, you can run
```
    $   cd /theDirctory
    $   python -m http.server 8080
```
When you are done just Ctrl-C
-----------------------------------------

## Events

#### Keyboard
There are two types of keyboard events:

- keydown
- keyup

Both of these types just have the which event they are and the **key**
 associated.

#### Mouse
There are three types of mouse events:

- mousemove
- mousedown
- mouseup

All of these mouse events have positions **x** and **y** relative to
the top left of the WebGL Canvas.

Only other noteable feature is that **mousedown** and **mouseup** also
have what type of mouse click it was.

- 1 -> left
- 2 -> middle
- 3 -> right

#### Audio
These are the types of audio events so far
- trackpause
- trackplay
- trackblock
- trackqueue

All tracks events contain a track object under **track** , trackblock
also has the reason it is blocked.

## So Far...
I currently got IO working for the 2d GameEngine or Game.
I want to refactor some stuff and move IO into their own dedicated file.

I have decided because we want the system to be non-blocking
that we will need to make an **eventQueue** feel free to make
as many events as you like. Currently, we need to figure out
the rendering process.

I started to work on the audio. I have conceptualized **track**
objects. You can initialize audio then afterward use it as a
factory to create tracks. They are still a _work in progress_.
The track object have a few components:
- elem: a link to the element on the DOM, you can insight play/pause directly on this
- track: Information about the track, can be used to create complicated sounds
- gain: Affects the gain, read about [gainNodes](https://developer.mozilla.org/en-US/docs/Web/API/GainNode/gain)
- pan: affects the left to right output, used for depth and space, read about [pannerNodes](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)

## Useful Links

- Alot of useful inforation on [Web GL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- For audio information of [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
# GameDevWebGl

## Getting Started

After you checkout the project. You need run a server to localhost
to use it. This is because web browsers prevent JS pulling in more
JS files from the direct local machine. Browsers do it to keep from
making machines vunerable.

There are a lot of ways to host this to your local host.
---------------------------------------------
If you have NodeJS, you can easily host a webserver from any directory.
'''
    $   npm install http-server -g
'''
Then you just navigate to you directory and run it.
'''
    $   cd /theDirctory
    $   http-server

'''
When you are done just Ctrl-C
------------------------------------------
If you have python installed, you can run
'''
    $   cd /theDirctory
    $   python -m http.server 8080
'''
-----------------------------------------

## So Far...
I currently got IO working for the 2d GameEngine or Game.

I have decided because we want the system to be non-blocking
that we will need to make an **eventQueue** feel free to make
as many events as you like. Currently, we need to figure out
the rendering process.

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

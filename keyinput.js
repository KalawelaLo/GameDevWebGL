var keyState = new Array(256); //size of ascii
for (let index = 0; index < keyState.length; index++) {
    keyState[index] = false;
  }
window.addEventListener(
    "keydown",
    function (e) {
    //this.check('s',true);
    keyState[ascii(e.key)] = true;
    }
  );
  window.addEventListener(
    "keyup",
    function (e) {
        keyState[ascii(e.key)] = false;
    },
    true
  );


export class KeyInput {
  constructor() {
    //TODO support utf

  }
  keyPressed(key) {
    return keyState[ascii(key)];
  }
  //key char, bool
  setKey(key, keyDown) {
    keyState[0] = keyDown;
  }
}

//helper function
function ascii(a) {
  return a.charCodeAt(0);
}

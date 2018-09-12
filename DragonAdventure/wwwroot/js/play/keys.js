"use strict"

function keyRunFrame() {
    keyUpdateDown();
}

var _keyUpdateNeeded = false;
function keyUpdateDown() {
    if (_keyUpdateNeeded == false)
        return;
    _keyUpdateNeeded = false;

    var newKeysDown = {
        up:        _keyCodesDown[38] || _keyCodesDown[104],
        down:      _keyCodesDown[40] || _keyCodesDown[98],
        left:      _keyCodesDown[37] || _keyCodesDown[100],
        right:     _keyCodesDown[39] || _keyCodesDown[102],
        action:    _keyCodesDown[90],
        cancel:    _keyCodesDown[88],
        special1:  _keyCodesDown[49],
        special2:  _keyCodesDown[50],
        special3:  _keyCodesDown[51],
        special4:  _keyCodesDown[52],
        special5:  _keyCodesDown[53],
        special6:  _keyCodesDown[54],
        special7:  _keyCodesDown[55],
        special8:  _keyCodesDown[56],
        special9:  _keyCodesDown[57],
        special10: _keyCodesDown[48],
    };
    if (newKeysDown.up && newKeysDown.down)
        { newKeysDown.up   = false; newKeysDown.down  = false; }
    if (newKeysDown.left && newKeysDown.right)
        { newKeysDown.left = false; newKeysDown.right = false; }

    for (var key in newKeysDown) {
        var down = newKeysDown[key];
        _keysDown[key] = down;

        var pressed = _keysPressed[key];
        if (pressed == null || down == false)
            pressed = 0;
        if (down == true && pressed == 0)
            pressed = 1;
        _keysPressed[key] = pressed;
    }
}

function keyPollOnePressed() {
    for (var key in _keysPressed)
        if (_keysPressed[key] == 1) {
            _keysPressed[key] = 2;
            return key;
        }
    return null;
}

function keyEventFunc(value) {
    return function(e) {
        if (e.which < 256)
            _keyCodesDown[e.which] = value;
        _keyUpdateNeeded = true;
        if (e.which >= 33 && e.which <= 40)
            e.preventDefault();
    }
}

function keysInit() {
    window.addEventListener('keydown', keyEventFunc(true));
    window.addEventListener('keyup',   keyEventFunc(false));
    window.addEventListener('blur', function() {
        for (var key in _keyCodesDown)
            _keyCodesDown[key] = false;
        keyUpdateDown();
    });
}

function keyPressed(key) {
    _game.keyPressed(key);
}

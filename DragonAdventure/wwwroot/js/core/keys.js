"use strict"

function keysUpdate() {
    var newKeysDown = {
        up:       _keyCodesDown[38] || _keyCodesDown[104],
        down:     _keyCodesDown[40] || _keyCodesDown[98],
        left:     _keyCodesDown[37] || _keyCodesDown[100],
        right:    _keyCodesDown[39] || _keyCodesDown[102],
        action:   _keyCodesDown[90],
        cancel:   _keyCodesDown[88],
        special1: _keyCodesDown[81],
        special2: _keyCodesDown[87],
        special3: _keyCodesDown[69],
        special4: _keyCodesDown[82],
    };
    if (newKeysDown.up && newKeysDown.down)
        { newKeysDown.up   = false; newKeysDown.down  = false; }
    if (newKeysDown.left && newKeysDown.right)
        { newKeysDown.left = false; newKeysDown.right = false; }

    for (var key in newKeysDown) {
        if (_keysDown[key] != newKeysDown[key]) {
            _keysDown[key] = newKeysDown[key];
            if (_keysDown[key])
                keyPressed(key);
        }
    }
}

function keyEventFunc(value) {
    return function(e) {
        if (e.which < 256)
            _keyCodesDown[e.which] = value;
        keysUpdate();
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
        keysUpdate();
    });
}

function keyPressed(key) {
    _game.keyPressed(key);
}

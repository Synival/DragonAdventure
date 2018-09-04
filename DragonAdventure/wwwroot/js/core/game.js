"use strict"

function Game() {
    this.interval = null;
    this.state    = null;
    this.map      = null;
    this.menus    = [];

    this.frame = function() {
        _player.frame();
        _camera.frame();
        _render.frame();
    };

    this.setMap = function(map, x, y) {
        if (map == null) {
            x = 0;
            y = 0;
        }
        else {
            if (x == null) x = parseInt(map.width  / 2);
            if (y == null) y = parseInt(map.height / 2);
        }

        this.map = map;
        _player.moveToTile(x, y);
        _camera.moveTo(_player.x, _player.y, true);
    };

    this.keyPressed = function(key) {
        if (key == 'special1')
            _player.spritesheet = _spritesheets.next(_player.spritesheet);
        else if (key == 'special2')
            this.setMap(_maps.next(this.map));
        else if (key == 'special3') {
            var modes = {
                'instant':  null,
                'constant': null,
                'smooth':   null,
            };
            _camera.moveMethod = nextKeyInDict(modes, _camera.moveMethod);
            console.log('Camera: ' + _camera.moveMethod);
        }
        else if (key == 'special4') {
            var modes = {
                'dq':     null,
                'smooth': null,
            };
            _player.moveMethod = nextKeyInDict(modes, _player.moveMethod);
            console.log('Player: ' + _player.moveMethod);
        }
    };

    this.start = function() {
        if (this.state != null)
            return;

        // Some test data
        this.state = 'map';
        _maps.initTestMaps();
        _player.spritesheet = _spritesheets.get('priest');
        this.setMap(_maps.get('dq2'));

        // Begin our game state
        _render.frame();
        this.interval = setInterval(this.frame, 1000.00 / 60.00);
    };
}

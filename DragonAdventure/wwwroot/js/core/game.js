"use strict"

function Game() {
    var self = this;
    self.interval = null;
    self.state    = null;
    self.map      = null;
    self.menus    = [];

    self.frame = function() {
        _player.frame();
        _camera.frame();
        _render.frame();
    };

    self.setMap = function(map, x, y) {
        if (map == null) {
            x = 0;
            y = 0;
        }
        else {
            if (x == null) x = parseInt(map.width  / 2);
            if (y == null) y = parseInt(map.height / 2);
        }

        self.map = map;
        _player.moveToTile(x, y);
        _camera.moveTo(_player.x, _player.y, true);
    };

    self.keyPressed = function(key) {
        if (key == 'special1')
            _player.spritesheet = _spritesheets.next(_player.spritesheet);
        else if (key == 'special2')
            self.setMap(_maps.next(self.map));
        else if (key == 'special3') {
            var modes = {
                'instant':  null,
                'constant': null,
                'smooth':   null,
            };
            _camera.moveMethod = nextKeyInDict(modes, _camera.moveMethod);
        }
        else if (key == 'special4') {
            var modes = {
                'dq':     null,
                'smooth': null,
            };
            _player.moveMethod = nextKeyInDict(modes, _player.moveMethod);
        }
    };

    self.start = function() {
        if (self.state != null)
            return;

        // Test stuff!!
        self.state = 'map';
        _player.spritesheet = _spritesheets.get('priest');


        var loadCount = 3;
        function whenLoaded()
            { self.setMap(_maps.get('dq2')); }
        function loadedFunc(resource, model) {
            if (--loadCount == 0)
                whenLoaded();
        }

        _resources.set(new Resource('map', 'test', loadedFunc));
        _resources.set(new Resource('map', 'dq1',  loadedFunc));
        _resources.set(new Resource('map', 'dq2',  loadedFunc));

        _render.frame();
        self.interval = setInterval(self.frame, 1000.00 / 60.00);
    };
}

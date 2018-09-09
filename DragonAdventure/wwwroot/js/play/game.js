"use strict"

function Game(id) {
    var self = this;
    self.interval  = null;
    self.map       = null;
    self.menus     = [];
    self.id        = id;
    self.createdOn = null;
    self.patchStateFrame = null;
    self.state = {
        timestamp:     new Date(),
        id:            null,
        gameId:        id,
        secondsPlayed: null,
        direction:     null,
        mapId:         null,
        mapName:       null,
        mapX:          null,
        mapY:          null,
        mapXPrecise:   null,
        mapYPrecise:   null,
        stepCount:     0,
        frameCount:    0,
        battleCount:   0,
    };

    self.runFrame = function() {
        self.state.frameCount++;
        if (self.patchStateFrame != null &&
            self.state.frameCount >= self.patchStateFrame)
        {
            self.updateState();
            self.patchState();
        }
        _player.runFrame();
        _camera.runFrame();
        _render.runFrame();
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

    self.populateState = function(stateIn) {
        var stateOut = self.state;
        for (var key in stateOut) {
            if (stateOut[key] instanceof Date)
                stateOut[key] = new Date(stateIn[key]);
            else
                stateOut[key] = stateIn[key];
        }
    };

    self.updateState = function() {
        var state = self.state;
        state.timestamp     = new Date();
        state.secondsPlayed = parseInt(state.frameCount / 60);
        state.direction     = _player.direction;
        state.mapId         = (self.map)     ? self.map.id   : null;
        state.mapName       = (self.mapName) ? self.map.name : null;
        state.mapX          = _player.mapX;
        state.mapY          = _player.mapY;
        state.mapXPrecise   = _player.x / _tileSize;
        state.mapYPrecise   = _player.y / _tileSize;
    };

    self.patchState = function() {
        self.patchStateFrame = null;
        console.log("Patching state...");
        if (self.state.id != null) {
            api('/Game/UpdateState', 'PATCH', self.state, function() {
                console.log("State patched.");
            });
        }
    };

    self.queuePatchState = function() {
        if (self.patchStateFrame != null)
            return false;
        self.patchStateFrame = self.state.frameCount + (60 * 5);
        return true;
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
        else if (key == 'special10') {
            var modes = {
                'none':   null,
                'coords': null,
                'map':    null,
            };
            _debugMode = nextKeyInDict(modes, _debugMode);
        }
    };

    self.start = function() {
        // Test stuff!!
        _player.spritesheet = _spritesheets.get('priest');

        function whenLoaded() {
            var state = self.state;
            _player.direction = state.direction;
            self.setMap(_maps.get(state.mapName),
                state.mapXPrecise, state.mapYPrecise);
        }
        function loadedFunc(resource, model) {
            if (_resources.getLoadingCount() == 0)
                whenLoaded();
        }

        apiGet('/Game/GetStateById/' + self.id, function(result) {
            self.populateState(result);
            apiGet('/Map/GetList?gameId=' + self.id, function(result) {
                for (var i = 0; i < result.length; i++)
                    _resources.load('map', result[i].name, loadedFunc);
            });
        });

        _render.runFrame();
        self.interval = setInterval(self.runFrame, 1000.00 / 60.00);
    };
}

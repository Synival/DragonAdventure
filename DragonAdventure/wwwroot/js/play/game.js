"use strict"

function Game(id) {
    var self = this;
    self.interval  = null;
    self.map       = null;
    self.menus     = [];
    self.id        = id;
    self.createdOn = null;
    self.patchStateFrame = null;
    self.scene     = null;
    self.actors    = [];

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
        encounters:    0,
    };

    self.runFrame = function() {
        self.state.frameCount++;

        keyRunFrame();
        if (self.patchStateFrame != null &&
            self.state.frameCount >= self.patchStateFrame)
        {
            self.updateState();
            self.patchState();
        }
        if (self.menus.length == 0) {
            if (_player != null)
                _player.runFrame();
            if (_camera != null)
                _camera.runFrame();
        }
        else {
            self.menus[self.menus.length - 1].runFrame();
        }

        while (true) {
            var target = self.keyTarget();
            if (target.keyReady != null && !target.keyReady())
                break;
            var key = keyPollOnePressed();
            if (key == null)
                break;
            self.keyPressed(target, key);
        }

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
        if (_player != null) {
            _player.moveToTile(x, y);
            _camera.moveTo(_player.x, _player.y, true);
        }
        else {
            _camera.moveToTile(
                (map.width  / 2) - 0.5,
                (map.height / 2) - 0.5, true);
        }
    };

    self.populateState = function(stateIn) {
        var stateOut = self.state;
        for (var key in stateOut) {
            if (stateOut[key] instanceof Date)
                stateOut[key] = new Date(stateIn[key]);
            else
                stateOut[key] = stateIn[key];
        }

        // FAKE ACTOR
        self.newActor({ mapX: 32, mapY: 16, spritesheet: 'soldier' });

        // TODO: real actor data!
        _player = self.newActor({
            spritesheet: 'priest',
            moveMethod:  'smooth'
        });
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

    self.newMenu = function(x, y, type, params) {
        var menu = new Menu(x, y, type, params);
        self.menus.push(menu);
        return menu;
    };

    self.newActor = function(params) {
        var actor = new Actor(params);
        self.actors.push(actor);
        return actor;
    };

    self.keyTarget = function() {
        if (self.menus.length > 0)
            return self.menus[self.menus.length - 1];
        return self;
    };

    self.keyAction = function() {
        switch (self.scene) {
            case 'map':
                self.newMenu(8, 8, 'map');
                break;
        }
    };

    self.keyReady = function() {
        return _player == null || _player.canMoveNow();
    };

    self.keyPressed = function(target, key) {
        switch (key) {
            case 'action':
                if (target.keyAction != null)
                    target.keyAction.call(target);
                break;

            case 'cancel':
                if (target.keyCancel != null)
                    target.keyCancel.call(target);
                break;

            case 'up':
            case 'down':
            case 'left':
            case 'right':
                if (target.keyDirection != null)
                    target.keyDirection.call(target, key);
                break;
        }
    };

    self.playerMovedEvent = function() {
        var state = self.state;
        state.stepCount++;
        if (state.encounters <= 0 || state.encounters == null)
            state.encounters = parseInt(Math.random() * 24) + 8;
        state.encounters -= _player.getMoveTime();

        if (state.encounters <= 0) {
            console.log("Battle!");
            state.battleCount++;
        }
        self.queuePatchState();
    };

    self.start = function() {
        function whenLoaded() {
            var state = self.state;
            if (_player != null)
                _player.direction = state.direction;
            self.setMap(_maps.get(state.mapName),
                state.mapXPrecise, state.mapYPrecise);
            self.scene = 'map';
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

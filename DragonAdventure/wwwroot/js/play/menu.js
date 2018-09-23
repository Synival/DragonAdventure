"use strict"

function MenuText(x, y, text) {
    var self     = this;
    self.x       = x;
    self.y       = y;
    self.text    = text;
    self.control = null;
    self.screenPos = function()
        { return self.menu.screenPos(self.x, self.y); };
}

function MenuControl(x, y, action) {
    var self    = this;
    self.x      = x;
    self.y      = y;
    self.action = action;
    self.text = null;
    self.neighbors = {
        up:    null,
        down:  null,
        left:  null,
        right: null,
    };
    self.screenPos = function()
        { return self.menu.screenPos(self.x, self.y); };
}

function Menu(x, y, type, params) {
    var self = this;
    self.x           = x;
    self.y           = y;
    self.type        = type;
    self.params      = params;
    self.width       = 16;
    self.height      = 16;
    self.texts       = [];
    self.controls    = [];
    self.control     = null;
    self.border      = _menuTile.width;
    self.borderInner = Math.max(1, 8 - self.border);
    self.isBuilt     = false;

    self.screenPos = function(x, y) {
        return {
            x: self.x + self.border + self.borderInner + x,
            y: self.y + self.border + self.borderInner + y,
        };
    };

    self.newText = function(x, y, text) {
        var obj = new MenuText(x, y, text);
        obj.index = self.texts.length;
        obj.menu = self;
        self.texts.push(obj);
        return obj;
    };

    self.newControl = function(x, y, action) {
        var obj = new MenuControl(x, y, action);
        obj.index = self.controls.length;
        obj.menu = self;
        if (self.control == null)
            self.control = obj;
        self.controls.push(obj);
        return obj;
    };

    self.newTextControl = function(x, y, text, action) {
        var tobj = self.newText(x, y, text);
        var cobj = self.newControl(x - 7, y, action);
        tobj.control = cobj;
        cobj.text    = tobj;
        return {
            text:    tobj,
            control: cobj
        };
    };

    self.setInnerSize = function(width, height) {
        var extra   = (self.border + self.borderInner) * 2;
        self.width  = width + extra;
        self.height = height + extra;
    }

    self.build = function(type, params) {
        if (self.isBuilt)
            return false;
        switch (type) {
            case 'map':
                self.setInnerSize(110, 43);

                var notDone = function() {};
                self.newTextControl( 7,  0,  "Talk",    notDone);
                self.newTextControl(62,  0,  "Spell",   notDone);
                self.newTextControl( 7, 10,  "Status",  notDone);
                self.newTextControl(62, 10,  "Item",    notDone);
                self.newTextControl( 7, 20,  "Equip",   notDone);
                self.newTextControl(62, 20,  "Tactics", notDone);

                self.newTextControl( 7, 35, "Debug menu", function() {
                    var pos = this.screenPos();
                    _game.newMenu(pos.x, pos.y + 10, 'test');
                });
                break;

            case 'test':
                self.setInnerSize(160, 108);

                var spriteText = self.newText(77,  0, _player.spritesheet.name);
                var mapTest    = self.newText(77, 10, _game.map.name);
                var cameraText = self.newText(77, 20, _camera.moveMethod);
                var moveText   = self.newText(77, 30, _player.moveMethod);
                var infoText   = self.newText(77, 40, _debugMode);

                self.newTextControl(7,  0, "Sprite:", function() {
                    _player.spritesheet = _spritesheets.next(_player.spritesheet);
                    spriteText.text = _player.spritesheet.name;
                });
                self.newTextControl(7, 10, "Map:", function() {
                    _game.setMap(_maps.next(_game.map));
                    mapTest.text = _game.map.name;
                });
                self.newTextControl(7, 20, "Camera:", function() {
                    var modes = { 'instant': null, 'constant': null, 'smooth': null };
                    _camera.moveMethod = nextKeyInDict(modes, _camera.moveMethod);
                    cameraText.text = _camera.moveMethod;
                });
                self.newTextControl(7, 30, "Move:", function() {
                    var modes = { 'dq': null, 'smooth': null };
                    _player.moveMethod = nextKeyInDict(modes, _player.moveMethod);
                    moveText.text = _player.moveMethod;
                });
                self.newTextControl(7, 40, "Info:", function() {
                    var modes = { 'none': null, 'coords': null, 'map': null };
                    _debugMode = nextKeyInDict(modes, _debugMode);
                    infoText.text = _debugMode;
                });
                self.newTextControl(7, 50, "Save", function() {
                    _game.patchState();
                });

                var timeFunc = function()
                    { return prettyDuration(_game.state.frameCount / 60, 'seconds'); };

                var stepCount   = self.newText(77, 70, _game.state.stepCount);
                var battleCount = self.newText(77, 80, _game.state.battleCount);
                var frameCount  = self.newText(77, 90, _game.state.frameCount);
                var timeCount   = self.newText(77, 100, timeFunc());

                var frameFunc = self.runFrame;
                self.runFrame = function() {
                    if (frameFunc != null)
                        frameFunc();
                    frameCount.text = _game.state.frameCount;
                    timeCount.text = timeFunc();
                }

                self.newText(7, 70, "Steps:");
                self.newText(7, 80, "Battles:");
                self.newText(7, 90, "Frames:");
                self.newText(7, 100, "Time:");
                break;

            default:
                console.error("Unknown menu type '" + type + "'");
                return false;
        }

        self.buildNeighbors();
        return true;
    };

    self.buildNeighbors = function() {
        if (self.controls.length <= 1)
            return;

        for (var i = 0; i < self.controls.length; i++) {
            var c = self.controls[i];
            for (var dir in c.neighbors)
                c.neighbors[dir] = null;
        }

        var dirs = [
            { pos: 'down',  neg: 'up',   major: 'y', minor: 'x' },
            { pos: 'right', neg: 'left', major: 'x', minor: 'y' },
        ];

        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            var count = 0;
            var next = null, first = null;

            while (true) {
                var c = self.buildBestNeighbor(self.controls, null, dir,
                    count >= self.controls.length - 1);
                if (c == null) {
                    if (count != self.controls.length)
                        console.error(dir.neg + " <-> " + dir.pos +
                            ": Skipped " + (self.controls.length - count) +
                            " controls");
                    break;
                }
                if (first == null)
                    first = c[0];
                next = c[1];
                count++;
            }
        }
    };

    self.buildBestNeighbor = function(controls, check, dir, circle) {
        var controlsOuter = (check == null) ? controls : [check];
        var bestScore = null, bestC = null;

        for (var i = 0; i < controlsOuter.length; i++) {
            var c = [controlsOuter[i], null];
            if (c[0].neighbors[dir.pos] != null)
                continue;

            for (var j = 0; j < controls.length; j++) {
                c[1] = controls[j];
                if (c[1] == c[0] ||
                    c[1].neighbors[dir.neg] !== null)
                    continue;
                if (!circle) {
                    var circ = c[1];
                    var found = false;
                    while (!found && (circ = circ.neighbors[dir.pos]) != null)
                        if (circ == c[0])
                            found = true;
                    if (found)
                        continue;
                }

                var score = self.neighborScore(c, dir);
                if (bestScore == null ||
                    (score >= 0 && bestScore < 0) ||
                    (score < bestScore && bestScore < 0) ||
                    (score < bestScore && score >= 0))
                {
                    bestScore = score;
                    bestC     = [c[0], c[1]];
                }
            }
        }
        if (bestC == null)
            return null;

        var c = bestC;
        c[0].neighbors[dir.pos] = c[1];
        c[1].neighbors[dir.neg] = c[0];
        return c;
    };

    self.neighborScore = function(c, dir) {
        var major = c[1][dir.major] - c[0][dir.major];
        var minor = c[1][dir.minor] - c[0][dir.minor];
        return (major + minor * 1000);
    };

    self.runFrame = function() {};

    self.action = function()
        { _game.menus.pop(self); }
    self.cancel = function()
        { _game.menus.pop(self); }

    self.keyAction = function() {
        if (self.control != null && self.control.action != null)
            return self.control.action.call(self.control);
        else if (self.action != null)
            return self.action.call(self);
    }

    self.keyCancel = function() {
        if (self.cancel != null)
            return self.cancel();
    }

    self.keyDirection = function(key) {
        if (self.control == null || self.controls.length <= 1)
            return;
        self.control = self.control.neighbors[key];
    }

    if (type != null)
        self.build(type, params);
}

"use strict"

function Player() {
    var self = this;
    self.x           = 0;
    self.y           = 0;
    self.mapX        = 0;
    self.mapY        = 0;
    self.targetX     = 0;
    self.targetY     = 0;
    self.targetMapX  = 0;
    self.targetMapY  = 0;
    self.moveTimer   = 0;
    self.encounters  = 0;
    self.moveMethod  = 'smooth';
    self.direction   = 0;
    self.moveFrames  = 0;
    self.justMoved   = false;
    self.spritesheet = null;

    self.getMoveTime = function(map, x, y) {
        if (map == null) map = _game.map;
        if (map == null) return 1.00;
        if (x   == null) x   = self.mapX;
        if (y   == null) y   = self.mapY;
        var tile = map.getTile(x, y);
        return 1.00 / ((tile.walkSpeed > 0.25) ? tile.walkSpeed : 0.25);
    }

    self.getMoveSpeed = function()
        { return _keysDown.cancel ? 1.5 : 1.0; }

    self.movedEvent = function() {
        var state = _game.state;
        state.stepCount++;
        if (self.encounters <= 0) {
            self.encounters = parseInt(Math.random() * 24) + 8;
        }
        self.encounters -= self.getMoveTime();
        if (self.encounters <= 0) {
            console.log("Battle!");
            state.battleCount++;
        }
        _game.queuePatchState();
    };

    self.updateMovement = function() {
        if (!self.canMoveNow())
            return false;
        var kd  = _keysDown;
        if (!(kd.left || kd.right || kd.up || kd.down))
            return false;
        self.move((kd.left ? -1 : 0) + (kd.right ? 1 : 0),
                  (kd.up   ? -1 : 0) + (kd.down  ? 1 : 0));
        return true;
    };

    self.wrapPosition = function() {
        var map = _game.map;
        if (map == null || !map.wrap)
            return;

        var mwt = map.width  * _tileSize;
        var mht = map.height * _tileSize;
        var x   = self.x;
        var y   = self.y;
        var tx  = self.targetX;
        var ty  = self.targetY;

        while (x <  0)   { tx += mwt; x += mwt; }
        while (x >= mwt) { tx -= mwt; x -= mwt; }
        while (y <  0)   { ty += mht; y += mht; }
        while (y >= mht) { ty -= mht; y -= mht; }
        if (self.x == x && self.y == y)
            return;

        self.x       = x;
        self.y       = y;
        self.targetX = tx;
        self.targetY = ty;
    };

    self.updatePosition = function() {
        var time  = self.getMoveTime();
        var speed = self.getMoveSpeed();

        var oldX = self.x, oldY = self.y;
             if (self.x < self.targetX) self.x = Math.min(self.targetX, self.x + speed);
        else if (self.x > self.targetX) self.x = Math.max(self.targetX, self.x - speed);
             if (self.y < self.targetY) self.y = Math.min(self.targetY, self.y + speed);
        else if (self.y > self.targetY) self.y = Math.max(self.targetY, self.y - speed);

        if (oldX != self.x || oldY != self.y) {
            time = 1;
            self.justMoved = true;
        }
        self.wrapPosition();

        if (self.justMoved) {
            var ox = self.mapX;
            var oy = self.mapY;
            if (self.x == self.targetX) self.mapX = self.targetMapX;
            if (self.y == self.targetY) self.mapY = self.targetMapY;
            if (ox != self.mapX || oy != self.mapY)
                self.movedEvent();

            self.justMoved = false;
            self.moveFrames += Math.pow(speed, 2) / time;
        }
        else {
            if (self.moveTimer == 0)
                self.moveFrames = 0;
            else if (self.moveTimer > 0)
                self.moveTimer = Math.max(0, self.moveTimer - speed);
        }
    };

    self.runFrame = function() {
        self.updateMovement();
        self.updatePosition();
    };

    self.canMove = function() {
        return true;
    };

    self.canMoveNow = function() {
        if (!self.canMove())
            return false;
        if (!(self.x == self.targetX && self.y == self.targetY))
            return false;
        if (self.moveTimer > 0)
            return false;
        return true;
    };

    self.canMoveToTile = function(tile)
        { return tile.walkSpeed > 0.00; }

    self.moveToTile = function(x, y) {
        self.moveTo(x * _tileSize, y * _tileSize);
    }

    self.moveTo = function(x, y) {
        x = Math.round(x * 8.00) / 8.00;
        y = Math.round(y * 8.00) / 8.00;

        var ts  = _tileSize;
        var map = _game.map;
        if (map == null) {
            self.x    = x;
            self.y    = y;
            self.mapX = Math.round(self.x / ts);
            self.mapY = Math.round(self.y / ts);
        }
        else {
            self.x    = mod(x, map.width  * ts);
            self.y    = mod(y, map.height * ts);
            self.mapX = mod(Math.round(self.x / ts), map.width);
            self.mapY = mod(Math.round(self.y / ts), map.height);
        }
        self.targetX    = self.x;
        self.targetY    = self.y;
        self.targetMapX = self.mapX;
        self.targetMapY = self.mapY;
    };

    self.move = function(x, y) {
        var map     = _game.map;
        if (map == null)
            return;

        var nx      = self.targetX;
        var ny      = self.targetY;
        var time    = self.getMoveTime();
        var speed   = self.getMoveSpeed();
        var ts      = _tileSize;
        var canMove = true;

        if (self.moveMethod == 'dq' && x != 0)
            y = 0;

             if (x == 0 && y >  0) self.direction = 0;
        else if (x <  0 && y >  0) self.direction = 1;
        else if (x <  0 && y == 0) self.direction = 2;
        else if (x <  0 && y <  0) self.direction = 3;
        else if (x == 0 && y <  0) self.direction = 4;
        else if (x >  0 && y <  0) self.direction = 5;
        else if (x >  0 && y == 0) self.direction = 6;
        else if (x >  0 && y >  0) self.direction = 7;

        if (self.moveMethod == 'dq') {
            nx = (self.targetMapX + x) * ts;
            ny = (self.targetMapY + y) * ts;

            var tx = Math.round(nx / ts);
            var ty = Math.round(ny / ts);
            if (!self.canMoveToTile(map.getTile(tx, ty)))
                return false;
        }
        else if (self.moveMethod == 'smooth') {
            if (x != 0 && y != 0)
                speed /= Math.hypot(x, y);
            nx = Math.round((self.targetX + (x * speed / time)) * 8) / 8;
            ny = Math.round((self.targetY + (y * speed / time)) * 8) / 8;

            var nudged = nudgeCoords(self.targetX, self.targetY, nx, ny);
            nx = nudged.x;
            ny = nudged.y;

            var mx = self.targetMapX;
            var my = self.targetMapY;
            var tx = Math.round(nx / ts);
            var ty = Math.round(ny / ts);
            var dx = (mx != tx);
            var dy = (my != ty);

            if (dx || dy) {
                var canMoveX = !dx ||    self.canMoveToTile(map.getTile(tx, my));
                var canMoveY = !dy ||    self.canMoveToTile(map.getTile(mx, ty));
                var canMoveD = !dx||!dy||self.canMoveToTile(map.getTile(tx, ty));
                if (!canMoveD && canMoveX && canMoveY) {
                    canMoveX = false;
                    canMoveY = false;
                }
                if ((!dx || !canMoveX) && (!dy || !canMoveY))
                    canMove = false;

                // Don't allow true diagonal movement between tiles.
                if (dx && dy && canMoveX && canMoveY)
                    canMoveY = false;

                var ts2 = parseInt(ts / 2);
                if (dx && !canMoveX) nx = (self.targetMapX*ts) + (ts2*x) - (x>0 ? 0.125 : 0);
                if (dy && !canMoveY) ny = (self.targetMapY*ts) + (ts2*y) - (y>0 ? 0.125 : 0);
            }
        }

        // Assume we've checked if moving is okay. If we haven't,
        // change conditions to allow moving anyway.
        self.moveTo(self.targetX, self.targetY);

        var mw  = map.width;
        var mh  = map.height;
        var mwt = mw * ts;
        var mht = mh * ts;

        if (!map.wrap) {
                 if (nx <  0)   nx = 0;
            else if (nx >= mwt) nx = mwt - 1;
                 if (ny <  0)   ny = 0;
            else if (ny >= mht) ny = mht - 1;
        }

        self.targetX    = nx;
        self.targetY    = ny;
        self.targetMapX = mod(Math.round(nx / ts), mw);
        self.targetMapY = mod(Math.round(ny / ts), mh);

        if (self.moveMethod == 'dq') {
            self.moveTimer = ts * self.getMoveTime(
                map, self.targetMapX, self.targetMapY) - ts;
        }
        else if (self.moveMethod == 'smooth') {
            self.x = self.targetX;
            self.y = self.targetY;
        }

        self.justMoved = true;
        return canMove;
    };

    self.getImage = function() {
        var ss = self.spritesheet;
        if (ss == null)
            return null;
        return {
            element: ss.element,
            width:   _tileSize,
            height:  _tileSize,
            x:       self.direction * _tileSize,
            y:       (Math.ceil(self.moveFrames / 15) % 2) * _tileSize,
            offX:    0,
            offY:    0
        };
    };
}

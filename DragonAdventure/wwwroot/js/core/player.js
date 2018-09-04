"use strict"

function Player() {
    this.x           = 0;
    this.y           = 0;
    this.mapX        = 0;
    this.mapY        = 0;
    this.targetX     = 0;
    this.targetY     = 0;
    this.targetMapX  = 0;
    this.targetMapY  = 0;
    this.moveTimer   = 0;
    this.encounters  = 0;
    this.moveMethod  = 'smooth';
    this.direction   = 0;
    this.moveFrames  = 0;
    this.justMoved   = false;
    this.spritesheet = null;

    this.getMoveTime = function(map, x, y) {
        if (map == null) map = _game.map;
        if (x   == null) x   = this.mapX;
        if (y   == null) y   = this.mapY;
        var tile = map.getTile(x, y);
        return 1.00 / ((tile.walkSpeed > 0.25) ? tile.walkSpeed : 0.25);
    }

    this.getMoveSpeed = function()
        { return _keysDown.cancel ? 1.5 : 1.0; }

    this.movedEvent = function() {
        if (this.encounters <= 0)
            this.encounters = parseInt(Math.random() * 24) + 8;
        this.encounters -= this.getMoveTime();
        if (this.encounters <= 0)
            console.log("Battle!");
    };

    this.updateMovement = function() {
        if (!this.canMoveNow())
            return false;
        var kd  = _keysDown;
        if (!(kd.left || kd.right || kd.up || kd.down))
            return false;
        this.move((kd.left ? -1 : 0) + (kd.right ? 1 : 0),
                  (kd.up   ? -1 : 0) + (kd.down  ? 1 : 0));
        return true;
    };

    this.wrapPosition = function() {
        var map = _game.map;
        if (!map.wrap)
            return;

        var mwt = map.width  * _tileSize;
        var mht = map.height * _tileSize;
        var x   = this.x;
        var y   = this.y;
        var tx  = this.targetX;
        var ty  = this.targetY;

        while (x <  0)   { tx += mwt; x += mwt; }
        while (x >= mwt) { tx -= mwt; x -= mwt; }
        while (y <  0)   { ty += mht; y += mht; }
        while (y >= mht) { ty -= mht; y -= mht; }
        if (this.x == x && this.y == y)
            return;

        this.x       = x;
        this.y       = y;
        this.targetX = tx;
        this.targetY = ty;
    };

    this.updatePosition = function() {
        var time  = this.getMoveTime();
        var speed = this.getMoveSpeed();

        var oldX = this.x, oldY = this.y;
             if (this.x < this.targetX) this.x = Math.min(this.targetX, this.x + speed);
        else if (this.x > this.targetX) this.x = Math.max(this.targetX, this.x - speed);
             if (this.y < this.targetY) this.y = Math.min(this.targetY, this.y + speed);
        else if (this.y > this.targetY) this.y = Math.max(this.targetY, this.y - speed);

        if (oldX != this.x || oldY != this.y) {
            time = 1;
            this.justMoved = true;
        }
        this.wrapPosition();

        if (this.justMoved) {
            var ox = this.mapX;
            var oy = this.mapY;
            if (this.x == this.targetX) this.mapX = this.targetMapX;
            if (this.y == this.targetY) this.mapY = this.targetMapY;
            if (ox != this.mapX || oy != this.mapY)
                this.movedEvent();

            this.justMoved = false;
            this.moveFrames += Math.pow(speed, 2) / time;
        }
        else {
            if (this.moveTimer == 0)
                this.moveFrames = 0;
            else if (this.moveTimer > 0)
                this.moveTimer = Math.max(0, this.moveTimer - speed);
        }
    };

    this.frame = function() {
        this.updateMovement();
        this.updatePosition();
    };

    this.canMove = function() {
        return true;
    };

    this.canMoveNow = function() {
        if (!this.canMove())
            return false;
        if (!(this.x == this.targetX && this.y == this.targetY))
            return false;
        if (this.moveTimer > 0)
            return false;
        return true;
    };

    this.canMoveToTile = function(tile)
        { return tile.walkSpeed > 0.00; }

    this.moveToTile = function(x, y) {
        this.moveTo(x * _tileSize, y * _tileSize);
    }

    this.moveTo = function(x, y) {
        var ts  = _tileSize;
        var map = _game.map;
        this.x          = mod(x, map.width  * ts);
        this.y          = mod(y, map.height * ts);
        this.mapX       = mod(Math.round(this.x / ts), map.width);
        this.mapY       = mod(Math.round(this.y / ts), map.height);
        this.targetX    = this.x;
        this.targetY    = this.y;
        this.targetMapX = this.mapX;
        this.targetMapY = this.mapY;
    };

    this.move = function(x, y) {
        var map     = _game.map;
        var nx      = this.targetX;
        var ny      = this.targetY;
        var time    = this.getMoveTime();
        var speed   = this.getMoveSpeed();
        var ts      = _tileSize;
        var canMove = true;

        if (this.moveMethod == 'dq' && x != 0)
            y = 0;

             if (x == 0 && y >  0) this.direction = 0;
        else if (x <  0 && y >  0) this.direction = 1;
        else if (x <  0 && y == 0) this.direction = 2;
        else if (x <  0 && y <  0) this.direction = 3;
        else if (x == 0 && y <  0) this.direction = 4;
        else if (x >  0 && y <  0) this.direction = 5;
        else if (x >  0 && y == 0) this.direction = 6;
        else if (x >  0 && y >  0) this.direction = 7;

        if (this.moveMethod == 'dq') {
            nx = (this.targetMapX + x) * ts;
            ny = (this.targetMapY + y) * ts;

            var tx = Math.round(nx / ts);
            var ty = Math.round(ny / ts);
            if (!this.canMoveToTile(map.getTile(tx, ty)))
                return false;
        }
        else if (this.moveMethod == 'smooth') {
            if (x != 0 && y != 0)
                speed /= Math.hypot(x, y);
            nx = Math.round((this.targetX + (x * speed / time)) * 8) / 8;
            ny = Math.round((this.targetY + (y * speed / time)) * 8) / 8;

            var nudged = nudgeCoords(this.targetX, this.targetY, nx, ny);
            nx = nudged.x;
            ny = nudged.y;

            var mx = this.targetMapX;
            var my = this.targetMapY;
            var tx = Math.round(nx / ts);
            var ty = Math.round(ny / ts);
            var dx = (mx != tx);
            var dy = (my != ty);

            if (dx || dy) {
                var canMoveX = !dx ||    this.canMoveToTile(map.getTile(tx, my));
                var canMoveY = !dy ||    this.canMoveToTile(map.getTile(mx, ty));
                var canMoveD = !dx||!dy||this.canMoveToTile(map.getTile(tx, ty));
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
                if (dx && !canMoveX) nx = (this.targetMapX*ts) + (ts2*x) - (x>0 ? 0.125 : 0);
                if (dy && !canMoveY) ny = (this.targetMapY*ts) + (ts2*y) - (y>0 ? 0.125 : 0);
            }
        }

        // Assume we've checked if moving is okay. If we haven't,
        // change conditions to allow moving anyway.
        this.moveTo(this.targetX, this.targetY);

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

        this.targetX    = nx;
        this.targetY    = ny;
        this.targetMapX = mod(Math.round(nx / ts), mw);
        this.targetMapY = mod(Math.round(ny / ts), mh);

        if (this.moveMethod == 'dq') {
            this.moveTimer = ts * this.getMoveTime(
                map, this.targetMapX, this.targetMapY) - ts;
        }
        else if (this.moveMethod == 'smooth') {
            this.x = this.targetX;
            this.y = this.targetY;
        }

        this.justMoved = true;
        return canMove;
    };

    this.getImage = function() {
        var ss = this.spritesheet;
        if (ss == null)
            return null;
        return {
            element: ss.element,
            width:   _tileSize,
            height:  _tileSize,
            x:       this.direction * _tileSize,
            y:       (Math.ceil(this.moveFrames / 15) % 2) * _tileSize,
            offX:    0,
            offY:    0
        };
    };
}

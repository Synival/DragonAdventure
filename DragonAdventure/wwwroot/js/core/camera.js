"use strict"

var Camera = function() {
    this.x            = 0;
    this.y            = 0;
    this.targetX      = 0;
    this.targetY      = 0;
    this.lastTargetX  = 0;
    this.lastTargetY  = 0;
    this.deltaTargetX = 0;
    this.deltaTargetY = 0;
    this.moveMethod = 'smooth';

    this.moveTo = function(x, y, finish) {
        this.targetX = x;
        this.targetY = y;
        if (finish)
            this.finish();
    };

    this.getTarget = function() {
        return {
            x: this.targetX,
            y: this.targetY,
        };
    };

    this.getTopLeftInt = function() {
        return {
            x: Math.round(this.x - _canvasWidth  / 2),
            y: Math.round(this.y - _canvasHeight / 2),
        };
    };

    this.updateTarget = function() {
        if (this.targetX == _player.x && this.targetY == _player.y)
            return false;
        this.targetX = _player.x;
        this.targetY = _player.y;
        return true;
    };

    this.finish = function() {
        var target = this.getTarget();
        this.x = target.x;
        this.y = target.y;
    };

    this.isDone = function() {
        var target = this.getTarget();
        return target.x == this.x && target.y == this.y;
    };

    this.wrapToTarget = function() {
        var map = _game.map;
        var dimensions = [
            { coord: 'x', target: 'targetX', size: map.width  * _tileSize },
            { coord: 'y', target: 'targetY', size: map.height * _tileSize },
        ];
        for (var i = 0; i < dimensions.length; i++) {
            var d          = dimensions[i];
            var wrapped    = closestWrap(this[d.coord], this[d.target], d.size);
            this[d.coord]  = wrapped.coord;
            this[d.target] = wrapped.target;
        }
    };

    this.frame = function() {
        this.updateTarget();
        if (_game.map.wrap)
            this.wrapToTarget();
        var target = this.getTarget();

        var dtx = this.targetX - this.lastTargetX;
        var dty = this.targetY - this.lastTargetY;
        var dtxi = Math.round(this.targetX) - Math.round(this.lastTargetX);
        var dtyi = Math.round(this.targetY) - Math.round(this.lastTargetY);
        var steadyX = dtx == this.deltaTargetX && dtx != 0;
        var steadyY = dty == this.deltaTargetY && dty != 0;

        this.deltaTargetX = dtx;
        this.deltaTargetY = dty;
        this.lastTargetX  = this.targetX;
        this.lastTargetY  = this.targetY;

        var tx = target.x, ty = target.y;
        if (tx == this.x && ty == this.y)
            return false;
        if (this.moveMethod == 'instant') {
            this.x = tx;
            this.y = ty;
            return true;
        }

        var sx = 0, sy = 0;
        if (this.moveMethod == 'constant')
            { sx = 1; sy = 1; }
        else if (this.moveMethod == 'smooth') {
            var distX = Math.abs(this.targetX - this.x) / _tileSize;
            var distY = Math.abs(this.targetY - this.y) / _tileSize;
            sx = Math.round((distX/2 + 0.5) * 8) / 8;
            sy = Math.round((distY/2 + 0.5) * 8) / 8;
        }

        var oldX = this.x, oldY = this.y;
             if (this.x > tx) this.x = Math.max(this.x - sx, tx);
        else if (this.x < tx) this.x = Math.min(this.x + sx, tx);
             if (this.y > ty) this.y = Math.max(this.y - sy, ty);
        else if (this.y < ty) this.y = Math.min(this.y + sy, ty);

        if (this.moveMethod == 'smooth') {
            if (steadyX) {
                var oxi   = Math.round(oldX);
                var limit = Math.abs(dtxi) + 1;
                while (Math.abs(Math.round(this.x - oxi)) == limit)
                    this.x -= (this.x > oxi) ? 0.125 : -0.125;
            }
            if (steadyY) {
                var oyi   = Math.round(oldY);
                var limit = Math.abs(dtyi) + 1;
                while (Math.abs(Math.round(this.y - oyi)) == limit)
                    this.y -= (this.y > oyi) ? 0.125 : -0.125;
            }
        }

/*
        var nudged = nudgeCoords(oldX, oldY, this.x, this.y);
        this.x = nudged.x;
        this.y = nudged.y;
*/

        return true;
    };
}

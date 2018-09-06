"use strict"

var Camera = function() {
    var self = this;
    self.x            = 0;
    self.y            = 0;
    self.targetX      = 0;
    self.targetY      = 0;
    self.lastTargetX  = 0;
    self.lastTargetY  = 0;
    self.deltaTargetX = 0;
    self.deltaTargetY = 0;
    self.moveMethod = 'smooth';

    self.moveTo = function(x, y, finish) {
        self.targetX = x;
        self.targetY = y;
        if (finish)
            self.finish();
    };

    self.getTarget = function() {
        return {
            x: self.targetX,
            y: self.targetY,
        };
    };

    self.getTopLeftInt = function() {
        return {
            x: Math.round(self.x - _canvasWidth  / 2),
            y: Math.round(self.y - _canvasHeight / 2),
        };
    };

    self.updateTarget = function() {
        if (self.targetX == _player.x && self.targetY == _player.y)
            return false;
        self.targetX = _player.x;
        self.targetY = _player.y;
        return true;
    };

    self.finish = function() {
        var target = self.getTarget();
        self.x = target.x;
        self.y = target.y;
    };

    self.isDone = function() {
        var target = self.getTarget();
        return target.x == self.x && target.y == self.y;
    };

    self.wrapToTarget = function() {
        var map = _game.map;
        if (map == null)
            return;
        var dimensions = [
            { coord: 'x', target: 'targetX', size: map.width  * _tileSize },
            { coord: 'y', target: 'targetY', size: map.height * _tileSize },
        ];
        for (var i = 0; i < dimensions.length; i++) {
            var d          = dimensions[i];
            var wrapped    = closestWrap(self[d.coord], self[d.target], d.size);
            self[d.coord]  = wrapped.coord;
            self[d.target] = wrapped.target;
        }
    };

    self.runFrame = function() {
        self.updateTarget();
        if (_game.map && _game.map.wrap)
            self.wrapToTarget();
        var target = self.getTarget();

        var dtx = self.targetX - self.lastTargetX;
        var dty = self.targetY - self.lastTargetY;
        var dtxi = Math.round(self.targetX) - Math.round(self.lastTargetX);
        var dtyi = Math.round(self.targetY) - Math.round(self.lastTargetY);
        var steadyX = dtx == self.deltaTargetX && dtx != 0;
        var steadyY = dty == self.deltaTargetY && dty != 0;

        self.deltaTargetX = dtx;
        self.deltaTargetY = dty;
        self.lastTargetX  = self.targetX;
        self.lastTargetY  = self.targetY;

        var tx = target.x, ty = target.y;
        if (tx == self.x && ty == self.y)
            return false;
        if (self.moveMethod == 'instant') {
            self.x = tx;
            self.y = ty;
            return true;
        }

        var sx = 0, sy = 0;
        if (self.moveMethod == 'constant')
            { sx = 1; sy = 1; }
        else if (self.moveMethod == 'smooth') {
            var distX = Math.abs(self.targetX - self.x) / _tileSize;
            var distY = Math.abs(self.targetY - self.y) / _tileSize;
            sx = Math.round((distX/2 + 0.5) * 8) / 8;
            sy = Math.round((distY/2 + 0.5) * 8) / 8;
        }

        var oldX = self.x, oldY = self.y;
             if (self.x > tx) self.x = Math.max(self.x - sx, tx);
        else if (self.x < tx) self.x = Math.min(self.x + sx, tx);
             if (self.y > ty) self.y = Math.max(self.y - sy, ty);
        else if (self.y < ty) self.y = Math.min(self.y + sy, ty);

        if (self.moveMethod == 'smooth') {
            if (steadyX) {
                var oxi   = Math.round(oldX);
                var limit = Math.abs(dtxi) + 1;
                while (Math.abs(Math.round(self.x - oxi)) == limit)
                    self.x -= (self.x > oxi) ? 0.125 : -0.125;
            }
            if (steadyY) {
                var oyi   = Math.round(oldY);
                var limit = Math.abs(dtyi) + 1;
                while (Math.abs(Math.round(self.y - oyi)) == limit)
                    self.y -= (self.y > oyi) ? 0.125 : -0.125;
            }
        }

/*
        var nudged = nudgeCoords(oldX, oldY, self.x, self.y);
        self.x = nudged.x;
        self.y = nudged.y;
*/

        return true;
    };
}

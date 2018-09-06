"use strict"

function Render() {
    var self = this;
    self.lastMap = null;
    self.sectors = [];

    self.frame = function() {
        self.updateAllSectors();
        self.updateCanvas();
    };

    self.getContext = function()
        { return _$canvas[0].getContext('2d'); };

    self.updateCanvas = function() {
        var destCtx = self.getContext();
        destCtx.clearRect(0, 0, _canvasElementWidth, _canvasElementHeight);

        var map = _game.map;
        if (map != null)
            self.drawMap(destCtx, map);
        self.drawDebug(_debugMode);

        var count = _resources.loadingCount();
        if (count > 0)
            self.drawText(1, _canvasHeight - 11, "Loading " + count + " resources...");
    };

    self.drawDebug = function(mode) {
        var pos = 1;
        var f = function(t1, t2, t3) {
            if (t1) self.drawText(1, pos, t1);
            if (t2) self.drawText(100 - String(parseInt(t2)).length * 7,  pos, t2);
            if (t3) self.drawText(175 - String(parseInt(t3)).length * 7,  pos, t3);
            pos += 10;
        }

        if (mode == 'coords') {
            f("Player:",  _player.x,          _player.y);
            f("tPlayer:", _player.targetX,    _player.targetY);
            f("Map:",     _player.mapX,       _player.mapY);
            f("tMap:",    _player.targetMapX, _player.targetMapY);
            f("Camera:",  _camera.x,          _camera.x);
            f("tCamera:", _camera.targetX,    _camera.targetY);
        }

        if (mode == 'map') {
            f("Map:",        (_game.map == null) ? '(null)'
                : (_game.map.name + ' (#' + _game.map.id + ')'));
            f("Dimensions:", (_game.map == null) ? ''
                : (_game.map.width + 'x' + _game.map.height));
            f("Walk mode:",  _player.moveMethod);
            f("Cam. mode: ", _camera.moveMethod);
        }
    };

    self.drawText = function(x, y, text) {
        x += _canvasOffsetX;
        y += _canvasOffsetY;
        text = String(text);

        var destCtx = self.getContext();
        var startX = x;
        var element = _font.element;
        for (var i = 0; i < text.length; i++) {
            var code = text.charCodeAt(i);
            if (code == 10) {
                x = startX;
                y += 10;
                continue;
            }

            var ch = _font.chars[code];
            if (ch == null)
                continue;
            destCtx.drawImage(element,
                ch.x,           ch.y,           ch.width, ch.height,
                x + ch.offsetX, y + ch.offsetY, ch.width, ch.height);
            x += ch.advanceX;
        }
    }

    self.drawMap = function(map) {
        var destCtx = self.getContext();
        var ts  = _tileSize;
        var ts2 = parseInt(ts / 2);
        var mw  = map.width;
        var mh  = map.height;
        var mwt = mw * ts;
        var mht = mh * ts;

        var topLeft = _camera.getTopLeftInt();
        var offsetX = Math.round(mod(topLeft.x + ts2, _sectorWidth));
        var offsetY = Math.round(mod(topLeft.y + ts2, _sectorHeight));
        var cox = _canvasOffsetX;
        var coy = _canvasOffsetY;

        var sectorCoords = self.getSectorCoords();
        var ulX = sectorCoords.x;
        var ulY = sectorCoords.y;
        for (var i = 0; i < 4; i++) {
            var sector = self.sectors[i];
            if (sector == null)
                continue;
            var sectorCanvas = _$sectorCanvas[sector.canvasIndex][0];
            var sx = parseInt(i % 2) * _sectorWidth;
            var sy = parseInt(i / 2) * _sectorHeight;
            destCtx.drawImage(sectorCanvas,
                Math.round(sx - offsetX + cox),
                Math.round(sy - offsetY + coy));
        }

    /*  (this draws a little box around our player's current tile)
        var pmx = mod(_player.mapX * ts - topLeft.x, mwt);
        var pmy = mod(_player.mapY * ts - topLeft.y, mht);

        destCtx.strokeStyle = '#fff';
        destCtx.beginPath();
        destCtx.rect(pmx + cox - ts2 - 0.5, pmy + coy - ts2 - 0.5, ts + 1, ts + 1);
        destCtx.stroke();
        destCtx.closePath();
    */

        var ps  = ts;
        var ps2 = parseInt(ps / 2);
        var px  = Math.round(_player.x) - topLeft.x;
        var py  = Math.round(_player.y) - topLeft.y;

        var img = _player.getImage();
        if (img != null) {
            px += (cox - ps2);
            py += (coy - ps2);
            destCtx.drawImage(img.element,
                img.x,         img.y,         img.width, img.height,
                img.offX + px, img.offY + py, img.width, img.height);
        }
        else {
            ps  = ts * 0.75;
            ps2 = parseInt(ps / 2);
            px += (cox - ps2);
            py += (coy - ps2);
            destCtx.fillStyle = '#fff';
            destCtx.fillRect(px, py, ps, ps);
        }

        if (_canvasElementWidth > _canvasWidth ||
            _canvasElementHeight > _canvasHeight)
        {
            destCtx.strokeStyle = '#fff';
            destCtx.beginPath();
            destCtx.rect(
                (_canvasElementWidth  - _canvasWidth)  / 2 - 1,
                (_canvasElementHeight - _canvasHeight) / 2 - 1,
                _canvasWidth + 2, _canvasHeight + 2);
            destCtx.stroke();
            destCtx.closePath();
        }
    };

    self.resetSectors = function() {
        self.sectors = [];
    };

    self.updateAllSectors = function() {
        var newSectors = [];
        var canvasUsed = [];

        var sectorCoords = self.getSectorCoords();
        var ulX = sectorCoords.x;
        var ulY = sectorCoords.y;

        if (_game.map != self.lastMap) {
            self.resetSectors();
            self.lastMap = _game.map;
        }

        for (var i = 0; i < 4; i++) {
            var sx = ulX + parseInt(i % 2);
            var sy = ulY + parseInt(i / 2);
            var sector = self.getSector(
                ulX + parseInt(i % 2),
                ulY + parseInt(i / 2));
            if (sector !== null) {
                canvasUsed[sector.canvasIndex] = true;
                newSectors[i] = sector;
            }
        }

        var canvasUnused = [];
        var canvasUnusedIndex = 0;
        for (var i = 0; i < 4; i++)
            if (canvasUsed[i] !== true)
                canvasUnused.push(i);
        for (var i = 0; i < 4; i++) {
            if (newSectors[i] != null)
                continue;
            var sx = ulX + parseInt(i % 2);
            var sy = ulY + parseInt(i / 2);
            newSectors[i] =
                { canvasIndex: canvasUnused[canvasUnusedIndex++],
                  x: sx, y: sy };
            self.updateSector(newSectors[i]);
        }
        self.sectors = newSectors;
    };

    self.updateSector = function(sector) {
        var ulX     = sector.x * _sectorNumTilesX;
        var ulY     = sector.y * _sectorNumTilesY;
        var map     = _game.map;
        var canvas  = _$sectorCanvas[sector.canvasIndex][0];
        var context = canvas.getContext('2d');

        if (map == null)
            return false;
        for (var x = 0; x < _sectorNumTilesX; x++) {
            for (var y = 0; y < _sectorNumTilesY; y++) {
                var mx     = x + ulX;
                var my     = y + ulY;
                var tile   = map.getTile(mx, my);
                var images = tile.getImages(null, mx, my);
                var px     = x * _tileSize;
                var py     = y * _tileSize;

                if (images.length > 0) {
                    for (var i = 0; i < images.length; i++) {
                        var img = images[i];
                        context.drawImage(img.element,
                            img.x,         img.y,         img.width, img.height,
                            img.offX + px, img.offY + py, img.width, img.height);
                    }
                }
                else {
                    context.fillStyle = tile.color;
                    context.fillRect(px, py, _tileSize, _tileSize);
                }
            }
        }
        return true;
    };

    self.getSectorCoords = function() {
        var ts2 = Math.floor(_tileSize / 2);
        var topLeft = _camera.getTopLeftInt();
        return {
            x: Math.floor((topLeft.x + ts2) / _sectorWidth),
            y: Math.floor((topLeft.y + ts2) / _sectorHeight),
        };
    };

    self.getSector = function(x, y) {
        for (var i = 0; i < 4; i++) {
            var sector = self.sectors[i];
            if (sector != null && sector.x === x && sector.y === y)
                return sector;
        }
        return null;
    };
}

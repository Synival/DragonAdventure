"use strict"

function Render() {
    var self = this;
    self.lastMap = null;
    self.sectors = [];

    self.runFrame = function() {
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
            self.drawMap(map);
        for (var i = 0; i < _game.menus.length; i++)
            self.drawMenu(_game.menus[i]);

        self.drawDebug(_debugMode);

        var count = _resources.getLoadingCount();
        if (count > 0)
            self.drawText(1, _canvasHeight - 11, "Loading " + count + " resources...");
    };

    self.drawRect = function(x, y, width, height, color) {
        var destCtx = self.getContext();
        var cox = _canvasOffsetX;
        var coy = _canvasOffsetY;
        destCtx.fillStyle = color;
        destCtx.fillRect(x + cox, y + coy, width, height);
    };

    self.drawImages = function(destCtx, images, x, y, width, height) {
        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            var w = (width  == null) ? img.width
                : Math.min(width  - img.offX,  img.width);
            var h = (height == null) ? img.height
                : Math.min(height - img.offY, img.height);
            if (w <= 0 || h <= 0)
                continue;
            destCtx.drawImage(img.element,
                img.x,        img.y,        img.width, img.height,
                img.offX + x, img.offY + y, w, h);
        }
    };

    self.drawMenu = function(menu) {
        var destCtx = self.getContext();
        var tile    = _menuTile;

        var b = menu.border;
        var B = menu.borderInner;
        var x = menu.x;
        var y = menu.y;
        var w = menu.width;
        var h = menu.height;

        // draw background
        var b2 = Math.ceil(menu.border / 2);
        self.drawRect(x+b2, y+b2, w-(b2*2), h-(b2*2), '#000');

        // draw left/right sides
        var t1 = tile.getBorderImages(8);
        var t2 = tile.getBorderImages(4);
        for (var i = b; i < w-b; i += b) {
            var s = Math.min(w-b-i, b);
            self.drawImages(destCtx, t1, x+i, y,     s, null);
            self.drawImages(destCtx, t1, x+i, y+h-b, s, null);
        }
        for (var i = b; i < h-b; i += b) {
            var s = Math.min(h-b-i, b);
            self.drawImages(destCtx, t2, x,     y+i, null, s);
            self.drawImages(destCtx, t2, x+w-b, y+i, null, s);
        }

        // draw corners
        self.drawImages(destCtx, tile.getBorderImages(7), x,     y);
        self.drawImages(destCtx, tile.getBorderImages(9), x+w-b, y);
        self.drawImages(destCtx, tile.getBorderImages(1), x,     y+h-b);
        self.drawImages(destCtx, tile.getBorderImages(3), x+w-b, y+h-b);

        // draw text
        for (var i = 0; i < menu.texts.length; i++) {
            var t = menu.texts[i];
            self.drawText(menu.x + t.x + b+B, menu.y + t.y + b+B, t.text);
        }

        // draw control indicator
        if (menu.control != null) {
            var c = menu.control;
            self.drawText(menu.x + c.x + b+B, menu.y + c.y + b+B, ">");
        }
    };

    self.drawDebug = function(mode) {
        if (mode == 'none')
            return;

        var pos = 1;
        var f = function(t1, t2, t3) {
            if (t1) self.drawText(1, pos, t1);
            if (t2) self.drawText(100 - String(parseInt(t2)).length * 7,  pos, t2);
            if (t3) self.drawText(175 - String(parseInt(t3)).length * 7,  pos, t3);
            pos += 10;
        }

        if (mode == 'coords') {
            self.drawRect(0, 0, _canvasWidth, 60, "rgba(0,0,0,0.5)");
            f("Player:",  _player.x,          _player.y);
            f("tPlayer:", _player.targetX,    _player.targetY);
            f("Map:",     _player.mapX,       _player.mapY);
            f("tMap:",    _player.targetMapX, _player.targetMapY);
            f("Camera:",  _camera.x,          _camera.x);
            f("tCamera:", _camera.targetX,    _camera.targetY);
        }

        if (mode == 'map') {
            self.drawRect(0, 0, _canvasWidth, 40, "rgba(0,0,0,0.5)");
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

                if (images.length > 0)
                    self.drawImages(context, images, px, py);
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

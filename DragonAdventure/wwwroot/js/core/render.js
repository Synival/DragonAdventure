"use strict"

function Render() {
    this.lastMap = null;
    this.sectors = [];

    this.frame = function() {
        this.updateAllSectors();
        this.updateCanvas();
    };

    this.updateCanvas = function() {
        var destCtx = _$canvas[0].getContext('2d');
        destCtx.clearRect(0, 0, _canvasElementWidth, _canvasElementHeight);

        var map = _game.map;
        if (map != null)
            this.drawMap(destCtx, map);
    };

    this.drawMap = function(destCtx, map) {
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

        var sectorCoords = this.getSectorCoords();
        var ulX = sectorCoords.x;
        var ulY = sectorCoords.y;
        for (var i = 0; i < 4; i++) {
            var sector = this.sectors[i];
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

    this.resetSectors = function() {
        this.sectors = [];
    };

    this.updateAllSectors = function() {
        var newSectors = [];
        var canvasUsed = [];

        var sectorCoords = this.getSectorCoords();
        var ulX = sectorCoords.x;
        var ulY = sectorCoords.y;

        if (_game.map != this.lastMap) {
            this.resetSectors();
            this.lastMap = _game.map;
        }

        for (var i = 0; i < 4; i++) {
            var sx = ulX + parseInt(i % 2);
            var sy = ulY + parseInt(i / 2);
            var sector = this.getSector(
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
            this.updateSector(newSectors[i]);
        }
        this.sectors = newSectors;
    };

    this.updateSector = function(sector) {
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

    this.getSectorCoords = function() {
        var ts2 = Math.floor(_tileSize / 2);
        var topLeft = _camera.getTopLeftInt();
        return {
            x: Math.floor((topLeft.x + ts2) / _sectorWidth),
            y: Math.floor((topLeft.y + ts2) / _sectorHeight),
        };
    };

    this.getSector = function(x, y) {
        for (var i = 0; i < 4; i++) {
            var sector = this.sectors[i];
            if (sector != null && sector.x === x && sector.y === y)
                return sector;
        }
        return null;
    };
}

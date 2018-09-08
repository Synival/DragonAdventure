"use strict"

function Tile(name, src, color, walkSpeed, attachTo) {
    var self = this;
    self.name      = name;
    self.src       = src;
    self.color     = color;
    self.walkSpeed = walkSpeed;
    self.element   = getImageElement('tiles', src);
    self.attachTo  = (attachTo == null) ? [] : attachTo;

    self.getImages = function(map, x, y) {
        var element = self.element;
        var images = [];
        if (element == null)
            return images;

        var width  = element.naturalWidth;
        var height = element.naturalHeight;

        var push = function(x, y, w, h, offX, offY) {
            images.push({
                element: element,
                x:       x * height,
                y:       y * height,
                width:   height * w,
                height:  height * h,
                offX:    offX * height,
                offY:    offY * height,
            });
        }

        if (width != height * 5)
            push(0, 0, 1, 1, 0, 0);
        else {
            if (map == null)
                map = _game.map;
            var f = function(offX, offY) {
                var tile = map.getTile(x + offX, y + offY);
                if (tile == self)
                    return true;
                for (var i = 0; i < self.attachTo.length; i++)
                    if (self.attachTo[i] == tile.name)
                        return true;
                return false;
            }
            var t = [
                f(-1,-1), f( 0,-1), f( 1,-1),
                f(-1, 0), true,     f( 1, 0),
                f(-1, 1), f( 0, 1), f( 1, 1),
            ];

            // whole tiles
            if(!t[1] &&!t[3] &&!t[5] &&!t[7])
                push(0, 0, 1, 1, 0, 0);
            if(!t[1] && t[3] && t[5] &&!t[7])
                push(1, 0, 1, 1, 0, 0);
            if( t[1] &&!t[3] &&!t[5] && t[7])
                push(2, 0, 1, 1, 0, 0);
            if(!t[0] && t[1] &&!t[2] && t[3] && t[5] &&!t[6] && t[7] &&!t[8])
                push(3, 0, 1, 1, 0, 0);
            if( t[0] && t[1] && t[2] && t[3] && t[5] && t[6] && t[7] && t[8])
                push(4, 0, 1, 1, 0, 0);

            // tiles with 4x4 sub-tiles
            if (images.length == 0) {
                var pushQuadrant = function(horiz, diag, vert, offX, offY) {
                    var img;
                         if (!t[horiz] &&            !t[vert]) img = 0;
                    else if ( t[horiz] &&            !t[vert]) img = 1;
                    else if (!t[horiz] &&             t[vert]) img = 2;
                    else if ( t[horiz] && !t[diag] && t[vert]) img = 3;
                    else if ( t[horiz] &&  t[diag] && t[vert]) img = 4;
                    push(img + offX, offY, 0.5, 0.5, offX, offY);
                };
                pushQuadrant(3, 0, 1, 0.00, 0.00);
                pushQuadrant(5, 2, 1, 0.50, 0.00);
                pushQuadrant(5, 8, 7, 0.50, 0.50);
                pushQuadrant(3, 6, 7, 0.00, 0.50);
            }
        }
        return images;
    };
}

var _emptyTile = null;
function TileSet() {
    var self = this;
    if (_emptyTile == null)
        _emptyTile = new Tile('empty', null, "#000", 0.00);

    self.tiles = {};
    self.set = function(ref, tile)
        { self.tiles[ref] = tile; }
    self.get = function(ref)
        { return (ref in self.tiles) ? self.tiles[ref] : _emptyTile; };
}

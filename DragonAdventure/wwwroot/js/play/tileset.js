"use strict"

function Tile(name, src, color, walkSpeed, attachTo) {
    var self = this;
    self.name      = name;
    self.src       = src;
    self.color     = color;
    self.walkSpeed = walkSpeed;
    self.element   = getImageElement('tiles', src);
    self.attachTo  = (attachTo == null) ? [] : attachTo;
    self.width     = _tileSize;
    self.height    = _tileSize;
    self.imageMap  = [];

    self.buildImages = function() {
        var element = self.element;
        if (element == null)
            return;

        var width   = element.naturalWidth;
        var height  = element.naturalHeight;
        self.width  = width;
        self.height = height;

        var images = [];
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

        if (width == height * 5) {
            self.width = height;
            for (var i = 0.0; i < 5.0; i += 1.0) {
                push(i, 0, 1, 1, 0, 0);
                for (var y = 0.0; y < 1.0; y += 0.5)
                    for (var x = 0.0; x < 1.0; x += 0.5)
                        push(x + i, y, 0.5, 0.5, x, y);
            }
        }
        else
            push(0, 0, 1, 1, 0, 0);

        self.imageMap = images;
    };
    self.buildImages();

    self.getImages = function(map, x, y) {
        var imageMap = self.imageMap;
        if (imageMap.length < 25)
            return imageMap;

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

        return self.getImagesFromNeighbors(t);
    }

    self.getImagesFromNeighbors = function(t) {
        var imageMap = self.imageMap;
        if (imageMap.length < 25)
            return imageMap;

        // whole tiles
        var images = [];
        var p = function(num)
            { images.push(imageMap[num]); }
        if(        !t[1]         &&!t[3] &&!t[5]         &&!t[7]        ) p(0);
        if(        !t[1]         && t[3] && t[5]         &&!t[7]        ) p(5);
        if(         t[1]         &&!t[3] &&!t[5]         && t[7]        ) p(10);
        if(!t[0] && t[1] &&!t[2] && t[3] && t[5] &&!t[6] && t[7] &&!t[8]) p(15);
        if( t[0] && t[1] && t[2] && t[3] && t[5] && t[6] && t[7] && t[8]) p(20);

        // tiles with 4x4 sub-tiles
        if (images.length == 0) {
            var pushQuadrant = function(horiz, diag, vert, quadrant) {
                var img;
                     if (!t[horiz] &&            !t[vert]) img = 0;
                else if ( t[horiz] &&            !t[vert]) img = 1;
                else if (!t[horiz] &&             t[vert]) img = 2;
                else if ( t[horiz] && !t[diag] && t[vert]) img = 3;
                else if ( t[horiz] &&  t[diag] && t[vert]) img = 4;
                p(img * 5 + quadrant);
            };
            pushQuadrant(3, 0, 1, 1);
            pushQuadrant(5, 2, 1, 2);
            pushQuadrant(3, 6, 7, 3);
            pushQuadrant(5, 8, 7, 4);
        }
        return images;
    };

    self.getBorderImages = function(direction) {
        var f = self.getImagesFromNeighbors;
        switch (direction) {
            case 2: return f([0,0,0, 1,1,1, 0,0,0]);
            case 1: return f([0,1,0, 0,1,1, 0,0,0]);
            case 4: return f([0,1,0, 0,1,0, 0,1,0]);
            case 7: return f([0,0,0, 0,1,1, 0,1,0]);
            case 8: return f([0,0,0, 1,1,1, 0,0,0]);
            case 9: return f([0,0,0, 1,1,0, 0,1,0]);
            case 6: return f([0,1,0, 0,1,0, 0,1,0]);
            case 3: return f([0,1,0, 1,1,0, 0,0,0]);
            case 5: return f([0,0,0, 0,0,0, 0,0,0]);
        }
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

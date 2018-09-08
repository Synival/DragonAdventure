"use strict"

function Map(id, name, wrap, ascii, tiles) {
    var self = this;
    self.id     = id;
    self.name   = name;
    self.wrap   = wrap;
    self.width  = 0;
    self.height = ascii.length;
    self.ascii  = [];

    if (tiles) {
        self.width = (tiles.length == 0) ? 0 : tiles[0].length;
        self.tiles = tiles;
    }
    else {
        self.tiles = [];
        for (var i = 0; i < self.height; i++) {
            self.ascii[i] = ascii[i];
            if (self.ascii[i].length > self.width)
                self.width = self.ascii[i].length;
        }
        for (var y = 0; y < self.height; y++) {
            var line = [];
            var a = self.ascii[y];
            for (var x = 0; x < a.length; x++)
                line.push(a.charAt(x));
            for (var x = a.length; x < self.width; x++)
                line.push(0);
            self.tiles.push(line);
        }
    }

    self.getTile = function(x, y) {
        x = self.wrap ? mod(x, self.width)  : clamp(x, 0, self.width  - 1);
        y = self.wrap ? mod(y, self.height) : clamp(y, 0, self.height - 1);
        return _tileset.get(self.tiles[y][x]);
    };
}

var _emptyMap = null;
function MapSet() {
    var self = this;
    if (_emptyMap == null)
        _emptyMap = new Map(0, 'empty', false, [
            '*****',
            '*#.#*',
            '*...*',
            '*#.#*',
            '*****'
        ]);
    self.maps = {};

    self.set = function(map)
        { self.maps[map.name] = map; }
    self.get = function(name)
        { return (name in self.maps) ? self.maps[name] : _emptyMap; }

    self.nextName = function(name)
        { return nextKeyInDict(self.maps, name); };
    self.next = function(prev)
        { return self.get(self.nextName(prev.name)); }
}

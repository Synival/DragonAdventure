"use strict"

function Spritesheet(name, src) {
    var self = this;
    self.name    = name;
    self.src     = src;
    self.element = getImageElement('spritesheets', src);
}

var _emptySpritesheet = null;
function SpritesheetSet() {
    var self = this;
    if (_emptySpritesheet == null)
        _emptySpritesheet = new Spritesheet('Empty', null);
    self.spritesheets = {};

    self.set = function(spritesheet)
        { self.spritesheets[spritesheet.name] = spritesheet; }
    self.get = function(name)
        { return (name in self.spritesheets) ? self.spritesheets[name] : _emptySpritesheet; }

    self.nextName = function(name)
        { return nextKeyInDict(self.spritesheets, name); };
    self.next = function(prev) {
        var next = self.nextName(prev == null ? null : prev.name);
        return self.get(next);
    };
}

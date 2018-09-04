"use strict"

function Spritesheet(name, src) {
    this.name    = name;
    this.src     = src;
    this.element = getImageElement('spritesheets', src);
}

var _emptySpritesheet = null;
function SpritesheetSet() {
    if (_emptySpritesheet == null)
        _emptySpritesheet = new Spritesheet('Empty', null);
    this.spritesheets = {};

    this.set = function(spritesheet)
        { this.spritesheets[spritesheet.name] = spritesheet; }
    this.get = function(name)
        { return (name in this.spritesheets) ? this.spritesheets[name] : _emptySpritesheet; }

    this.nextName = function(name)
        { return nextKeyInDict(this.spritesheets, name); };
    this.next = function(prev)
        { return this.get(this.nextName(prev.name)); }
}

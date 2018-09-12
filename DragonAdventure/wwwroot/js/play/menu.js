"use strict"

function MenuText(x, y, text) {
    var self = this;
    self.x    = x;
    self.y    = y;
    self.text = text;
}

function Menu(x, y, type, params) {
    var self = this;
    self.x           = x;
    self.y           = y;
    self.type        = type;
    self.params      = params;
    self.width       = 16;
    self.height      = 16;
    self.texts       = [];
    self.controls    = [];
    self.control     = null;
    self.border      = 4;
    self.borderInner = 2;

    switch (type) {
        case 'test':
            self.width = 100;
            self.height = 60 + (self.border + self.borderInner) * 2 - 1;
            self.texts = [
                new MenuText(0,   0, 'Foo'),
                new MenuText(0,  10, 'Bar'),
                new MenuText(0,  20, 'Baz'),
                new MenuText(0,  30, 'Quux'),
                new MenuText(0,  40, 'Herp'),
                new MenuText(0,  50, 'Derp'),
                new MenuText(50,  0, 'One\nTwo\nThree\nFour\nFive\nSix'),
            ];
            break;
    };

    self.runFrame = function() {};

    self.defaultAction = function()
        { _game.menus.pop(self); }
    self.defaultCancel = function()
        { _game.menus.pop(self); }

    self.keyAction = function() {
        if (self.control == null) {
            if (self.defaultAction != null)
                return self.defaultAction();
            return;
        }
        else if (self.control.action != null)
            self.control.action();
    }

    self.keyCancel = function() {
        if (self.control == null) {
            if (self.defaultCancel != null)
                return self.defaultCancel();
            return;
        }
        else if (self.control.cancel != null)
            self.control.cancel();
    }
}

"use strict"

function MenuText(x, y, text) {
    var self = this;
    self.x    = x * 8;
    self.y    = y * 12;
    self.text = text;
}

function Menu(x, y, type, params) {
    var self = this;
    self.x        = x;
    self.y        = y;
    self.type     = type;
    self.params   = params;
    self.width    = 16;
    self.height   = 16;
    self.texts    = [];
    self.controls = [];

    switch (type) {
        case 'test':
            self.width = 80;
            self.height = 160;
            self.texts = [
                new MenuText(0, 0, 'Hello!'),
                new MenuText(0, 2, 'This is a test.'),
                new MenuText(0, 3, 'Will it work?'),
                new MenuText(0, 5, 'Who knows, LOL'),
            ];
            break;
    };
}

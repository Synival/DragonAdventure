"use strict"

function MenuText(x, y, text) {
    this.x    = x * 8;
    this.y    = y * 12;
    this.text = text;
}

function Menu(x, y, type, params) {
    this.x        = x;
    this.y        = y;
    this.type     = type;
    this.params   = params;
    this.width    = 16;
    this.height   = 16;
    this.texts    = [];
    this.controls = [];

    switch (type) {
        case 'test':
            this.width = 80;
            this.height = 160;
            this.texts = [
                new MenuText(0, 0, 'Hello!'),
                new MenuText(0, 2, 'This is a test.'),
                new MenuText(0, 3, 'Will it work?'),
                new MenuText(0, 5, 'Who knows, LOL'),
            ];
            break;
    };
}

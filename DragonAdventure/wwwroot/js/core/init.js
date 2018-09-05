"use strict"

window.addEventListener('load', function() {
    // Build our canvases
    _$game   = $('#game');
    _$canvas = $(
        "<canvas id='game-canvas' " +
            "width="  + _canvasElementWidth  + " " +
            "height=" + _canvasElementHeight + " " +
        "</canvas>").appendTo(_$game);
    removeCanvasSmoothing(_$canvas[0]);

    _$hidden = $("<div id='game-hidden'></div>").appendTo(_$game);
    for (var i = 0; i < 4; i++) {
        _$sectorCanvas[i] = $(
            "<canvas " +
                "width="  + _sectorWidth  + " " +
                "height=" + _sectorHeight + " " +
            "</canvas>").appendTo(_$hidden);
        removeCanvasSmoothing(_$sectorCanvas[i][0]);
    }

    // Create our basic tileset
    _tileset = new TileSet();
    _tileset.set('~', new Tile('water',        'water_full.png',    "#048", 0.00,
        ['bridge', 'river']));
    _tileset.set('r', new Tile('river',        'water.png',         "#048", 0.00));
    _tileset.set('.', new Tile('grass',        'grass.png',         "#4c0", 1.00));
    _tileset.set("'", new Tile('rough',        'rough.png',         "#6a1", 0.75));
    _tileset.set('n', new Tile('hill',         'hill.png',          "#882", 2/3));
    _tileset.set('#', new Tile('forest',       'forest.png',        "#040", 2/3));
    _tileset.set('^', new Tile('mountain',     'mountain.png',      "#440", 0.00));
    _tileset.set('%', new Tile('swamp',        'swamp.png',         "#306", 0.50));
    _tileset.set('_', new Tile('desert',       'desert.png',        "#ff8", 0.50));
    _tileset.set('=', new Tile('bridge',       'bridge.png',        "#ccc", 1.00));
    _tileset.set('@', new Tile('castle',       'castle.png',        "#888", 1.00));
    _tileset.set(':', new Tile('shallows',     'shallows.png',      "#8cf", 0.00));
    _tileset.set(',', new Tile('snow',         'snow.png',          "#bfd", 1.00));
    _tileset.set('"', new Tile('snowRough',     'snow_rough.png',   "#6a1", 0.75));
    _tileset.set('F', new Tile('snowForest',   'snow_forest.png',   "#040", 2/3));
    _tileset.set('N', new Tile('snowHill',     'snow_hill.png',     "#882", 2/3));
    _tileset.set('M', new Tile('snowMountain', 'snow_mountain.png', "#440", 0.00));
    _tileset.set('!', new Tile('devPath',      'counter.png',       "#200", 1.00));
    _tileset.set('*', new Tile('wall',         'wall.png',          "#666", 0.00));
    _tileset.set(' ', new Tile('void',         null,                "#000", 0.00));
    _tileset.set(';', new Tile('cave',         null,                "#420", 0.00));

    // Load some sprite sheets
    _spritesheets = new SpritesheetSet();
    //_spritesheets.set(new Spritesheet('archer',      'archer.png'));
    //_spritesheets.set(new Spritesheet('birdsoldier', 'birdsoldier.png'));
    //_spritesheets.set(new Spritesheet('knight',      'knight.png'));
    //_spritesheets.set(new Spritesheet('monk',        'monk.png'));
    _spritesheets.set(new Spritesheet('priest',      'priest.png'));
    _spritesheets.set(new Spritesheet('soldier',     'soldier.png'));
    //_spritesheets.set(new Spritesheet('warrior',     'warrior.png'));
    //_spritesheets.set(new Spritesheet('wizard',      'wizard.png'));

    // Initialize our game state
    fontInit();
    keysInit();
    _camera    = new Camera();
    _player    = new Player();
    _render    = new Render();
    _game      = new Game();
    _maps      = new MapSet();
    _resources = new ResourceSet();

    // Go!
    _game.start();
});

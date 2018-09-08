"use strict"

var _$game         = null;
var _$canvas       = null;
var _$hidden       = null;
var _$sectorCanvas = [];

var _canvasWidth         = 256;
var _canvasHeight        = 240;
var _canvasElementExtra  = 0; // 1 = 100% more (extra) canvas
var _canvasElementWidth  = _canvasWidth  * (1 + _canvasElementExtra);
var _canvasElementHeight = _canvasHeight * (1 + _canvasElementExtra);
var _canvasOffsetX       = (_canvasElementWidth  - _canvasWidth)  / 2;
var _canvasOffsetY       = (_canvasElementHeight - _canvasHeight) / 2;

var _tileSize        = 16;
var _sectorWidth     = (Math.ceil(_canvasWidth  / _tileSize)) * _tileSize;
var _sectorHeight    = (Math.ceil(_canvasHeight / _tileSize)) * _tileSize;
var _sectorNumTilesX = _sectorWidth  / _tileSize;
var _sectorNumTilesY = _sectorHeight / _tileSize;

var _keyCodesDown = [];
for (var i = 0; i < 256; i++)
    _keyCodesDown[i] = false;
var _keysDown = {};

var _debugMode = 'none';

var _camera       = null;
var _player       = null;
var _tileset      = null;
var _spritesheets = null;
var _maps         = null;
var _render       = null;
var _resources    = null;
var _font         = null;
var _game         = null;

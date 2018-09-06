"use strict"

function mod(x, n)
    { return ((x % n) + n) % n; }

function clamp(x, min, max)
    { return Math.min(Math.max(x, min), max); }

function closestWrap(coord, target, size) {
    coord  = mod(coord, size);
    target = mod(target, size);

    var min = coord - size;
    var mid = coord;
    var max = coord + size;

    var distMin = Math.abs(target - min);
    var distMid = Math.abs(target - mid);
    var distMax = Math.abs(target - max);

         if (distMin <= distMid && distMin <= distMax) coord = min;
    else if (distMid <= distMax)                       coord = mid;
    else                                               coord = max;

    return { coord: coord, target: target };
}

function removeCanvasSmoothing(canvas) {
    var context = canvas.getContext('2d');
    context.imageSmoothingEnabled       = false;
    context.mozImageSmoothingEnabled    = false;
    context.oImageSmoothingEnabled      = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled     = false;
}

var _$getImageElements = {};
function getImageElement(family, src) {
    if (family == null || src == null)
        return null;

    if (!(family in _$getImageElements))
        _$getImageElements[family] = $('#' + family + ' img');

    var images = _$getImageElements[family];
    for (var i = 0; i < images.length; i++) {
        var img = images[i];
        if (img.getAttribute('src').endsWith('/' + src))
            return img;
    }
    return null;
}

function nudgeCoords(x1, y1, x2, y2) {
    if (x1 == x2 || y1 == y2)
        return { x: x2, y: y2 };

    var mx = (x2 > x1) ? 1 : -1;
    var my = (y2 > y1) ? 1 : -1;
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    var cx = Math.abs(Math.round(x2) - x1);
    var cy = Math.abs(Math.round(y2) - y1);

    while (cx != cy) {
        if (cx < cy) {
            x2 += 0.25 * mx;
            cx = Math.abs(Math.round(x2) - x1);
        }
        else {
            y2 += 0.25 * my;
            cy = Math.abs(Math.round(y2) - y1);
        }
    }
    return { x: x2, y: y2 };
}

function nextKeyInDict(dict, prev) {
    var first = null;
    var found = false;
    for (var key in dict) {
        if (first == null)
            first = key;
        if (found)
            return key;
        else if (key == prev)
            found = true;
    }
    return first;
}

function jqueryError(jqxhr, textStatus, message, url) {
    console.error("Request error (" + url + "):");
    if (jqxhr != null && jqxhr.status != null)
        console.error("   Response code: " + jqxhr.status);
    if (textStatus != null)
        console.error("   Error message: " + textStatus);
    if (message != null)
        console.error("   Message: " + message);
}

function jqueryErrorFunc(url, func) {
    return function(jqxhr, textStatus, message) {
        var rval = jqueryError(jqxhr, textStatus, message, url);
        if (func)
            func.call(this, jqxhr, textStatus, message, url);
        return rval;
    };
}

function jquerySuccessFunc(url, func) {
    return function(result) {
        if (result == null)
            return jqueryError(null, null, "Empty result", url);
        else if (typeof(result.Error) === 'string')
            return jqueryError(null, null, result.Error);
        else if (result.Error === true)
            return jqueryError(null, null, "Error reported", url);
        else if (result.Error != null)
            return jqueryError(null, null, result.Error, url);
        if (func)
            func.call(this, result);
    };
}

function capitalizeString(str) {
    if (typeof(str) !== 'string' || str.length !== 0)
        return str;
    return type.charAt(0).toUpperCase() + type.slice(1);
}

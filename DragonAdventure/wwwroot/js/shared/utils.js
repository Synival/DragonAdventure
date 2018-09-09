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
    var errors = "Request error (" + url + "):";
    if (jqxhr != null && jqxhr.status != null)
        errors += "\n   Response code: " + jqxhr.status;
    if (textStatus != null)
        errors += "\n   Error message: " + textStatus;
    if (message != null)
        errors += "\n   Message: " + message;
    console.error(errors);
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
        else if (typeof(result.error) === 'string')
            return jqueryError(null, null, result.error);
        else if (result.error === true)
            return jqueryError(null, null, "Error reported", url);
        else if (result.error != null)
            return jqueryError(null, null, result.error, url);
        if (func)
            func.call(this, result);
    };
}

function capitalizeString(str) {
    if (typeof(str) !== 'string' || str.length < 1)
        return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function fromCamelCase(obj) {
    console.log(typeof(obj));
    console.log("DERP!");
    if (typeof(obj) !== 'object')
        return obj;
    var newObj = {};
    for (var key in obj) {
        var value = obj[key];
        var capKey = capitalizeString(key);
        newObj[capKey] = fromCamelCase(value);
        console.log('+++ ' + capKey + ' = ' + newObj[capKey]);
    }
    return newObj;
}

function api(url, method, data, successFunc, failFunc, completeFunc) {
    var success = null;
    if (method.toLowerCase() == 'get')
        data = null;
    if (data != null && typeof(data) !== 'string')
        data = JSON.stringify(data);

    $.ajax({
        url:         url,
        method:      method,
        data:        data,
        contentType: 'application/json; charset=utf-8',
        success: jquerySuccessFunc(url, function(result) {
            success = true;
            if (successFunc)
                successFunc(result);
        }),
        error: jqueryErrorFunc(url, function() {
            success = false;
            if (failFunc)
                failFunc(result);
        }),
        complete: function() {
            if (completeFunc)
                completeFunc(success);
        }
    });
}

function apiGet(url, successFunc, failFunc, completeFunc)
    { return api(url, 'GET', null, successFunc, failFunc, completeFunc); }

function prettyDate(date, format) {
    if (date == null)
        return "(no date)";
    if (typeof(date) === 'string')
        date = new Date(date);
    if (format == null)
        format = 'M/D/YYYY h:mm:ss a';
    return moment(date).format(format);
}

function prettyDuration(amount, unit, format) {
    var duration = moment.utc(
        moment.duration(amount, unit).as('milliseconds'));
    if (format == null)
        format = 'H:mm:ss';
    return duration.format(format);
}

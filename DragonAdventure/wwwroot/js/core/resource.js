"use strict"

function Resource(type, key, callback) {
    var self = this;
    var keyType = (typeof(key) === 'string') ? 'name' : 'id';
    var method  = (keyType == 'name') ? 'GetByName' : 'GetById';
    var id      = (keyType == 'name') ? null : parseFloat(key);
    var name    = (keyType == 'name') ? key  : null;

    var controller = capitalizeString(type);
    self.type    = type;
    self.id      = id;
    self.name    = name;
    self.src     = '/' + controller + '/' + method +
        '?' + keyType + '=' + encodeURIComponent(key);
    self.loading = false;
    self.loaded  = false;
    self.failed  = false;
    self.data    = null;
    self.model   = null;

    if (type != null && key != null && type != 'none') {
        self.loading = true;
        api(self.src, function(result) {
            self.data = result;
            self.id   = result.id;
            self.name = result.name;

            switch(type) {
                case 'map':
                    self.model = new Map(result.id, result.name, result.wrap,
                        result.ascii);
                    _maps.set(self.model);
                    break;
                default:
                    console.error("No handler to load type '" + type + "'");
                    break;
            }
            self.loaded = true;
        }, function() {
            self.failed = true;
        }, function() {
            self.loading = false;
            if (callback)
                callback.call(self, self, self.model, self.data);
        });
    }
    else {
        self.src = null;
    }
};

var _emptyResource = null;
function ResourceSet() {
    var self = this;
    if (_emptyResource == null)
        _emptyResource = new Resource('none', 'empty', null);
    self.resources = {};

    self.set = function(resource)
        { self.resources[resource.type + '_' + resource.name] = resource; }
    self.get = function(type, name) {
        var full = (type + '_' + name);
        return (full in self.resources)
            ? self.resources[full] : _emptyResource;
    };

    self.nextName = function(name)
        { return nextKeyInDict(self.resources, name); };
    self.next = function(prev)
        { return self.resources[self.nextName(prev.name)]; };
    self.loadingCount = function() {
        var count = 0;
        for (var key in self.resources)
            if (self.resources[key].loading)
                count++;
        return count;
    };
}

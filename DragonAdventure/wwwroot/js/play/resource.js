"use strict"

function _keyTypeFunc(key)
    { return (typeof(key) === 'string') ? 'name' : 'id'; }

function Resource(type, key, callback) {
    var self = this;
    var keyType = _keyTypeFunc(key);
    var method  = (keyType == 'name') ? 'GetByName' : 'GetById';
    var id      = (keyType == 'name') ? null : parseInt(key);
    var name    = (keyType == 'name') ? key  : null;

    var controller = capitalizeString(type);
    self.type    = type;
    self.key     = key;
    self.keyType = keyType;
    self.id      = id;
    self.name    = name;
    self.loading = false;
    self.loaded  = false;
    self.failed  = false;
    self.data    = null;
    self.model   = null;

    self.isLoadable = function() {
        return self.type != null &&
               self.key  != null &&
               self.type != 'none';
    }
    if (!self.isLoadable())
        self.src = null;
    else {
        self.src = '/' + controller + '/' + method + '/' + encodeURIComponent(key);
        if (_game.id != null)
            self.src += '?gameId=' + _game.id;
    }

    self.load = function() {
        if (!self.isLoadable() || self.loading || self.loaded || self.failed)
            return;

        self.loading = true;
        apiGet(self.src, function(result) {
            self.data = result;
            self.id   = result.id;
            self.name = result.name;

            switch(type) {
                case 'map':
                    self.model = new Map(result.id, result.name, result.wrap,
                        result.ascii, result.tiles);
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
        return true;
    }
};

var _emptyResource = null;
function ResourceSet() {
    var self = this;
    if (_emptyResource == null)
        _emptyResource = new Resource('none', 'empty', null);
    self.resources = [];

    self.load = function(type, key, callback) {
        var keyType = _keyTypeFunc(key);
        if (keyType === 'name' && self.getByName(type, key))
            return null;
        if (keyType === 'id' && self.getById(type, key))
            return null;

        var resource = new Resource(type, key, callback);
        resource.load();
        self.resources.push(resource);
        return resource;
    };

    self.getById = function(type, id) {
        id = parseInt(id);
        for (var i = 0; i < self.resources.length; i++) {
            var r = self.resources[i];
            if (r.type == type && r.id == id)
                return r;
        }
        return null;
    };

    self.getByName = function(type, name) {
        for (var i = 0; i < self.resources.length; i++) {
            var r = self.resources[i];
            if (r.type == type && r.name == name)
                return r;
        }
        return null;
    };

    self.getLoadingCount = function() {
        var count = 0;
        for (var i = 0; i < self.resources.length; i++)
            if (self.resources[i].loading)
                count++;
        return count;
    };
}

"use strict"

function Resource(type, name, callback) {
    var self = this;
    var controller = capitalizeString(type);
    self.type    = type;
    self.name    = name;
    self.src     = '/' + controller + '/Get?name=' + encodeURIComponent(name);
    self.loading = false;
    self.loaded  = false;
    self.failed  = false;
    self.data    = null;
    self.model   = null;

    if (type != null && name != null && type != 'none') {
        self.loading = true;
        $.getJSON(self.src, jquerySuccessFunc(self.src, function(result) {
            self.data = result;
            switch(type) {
                case 'map':
                    self.model = new Map(result.name, result.wrap, result.ascii);
                    _maps.set(self.model);
                    break;
                default:
                    console.error("No handler to load type '" + type + "'");
                    break;
            }
            self.loaded = true;
        }))
        .fail(jqueryErrorFunc(self.src, function() {
            self.failed = true;
        }))
        .complete(function() {
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

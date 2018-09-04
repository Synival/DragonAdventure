"use strict"

function Resource(type, name, callback) {
    var controller = capitalizeString(type);
    this.type    = type;
    this.name    = name;
    this.src     = '/' + controller + '/Get/' + name;
    this.loading = false;
    this.loaded  = false;
    this.failed  = false;
    this.data    = null;
    this.model   = null;

    if (type != null && name != null && type != 'none') {
        this.loading = true;
        $.getJSON(this.src, jquerySuccessFunc(this.src, function(result) {
            console.log("Loaded '" + type + "' from: '" + src + "': " +
                result.Name);
            this.loaded = true;
        }))
        .fail(jqueryErrorFunc(this.src, function() {
            this.failed = true;
        }))
        .complete(function() {
            this.loading = false;
            if (callback)
                callback.call(this, this.model, this.data);
        });
    }
    else {
    }
};

var _emptyResource = null;
function ResourceSet() {
    if (_emptyResource == null)
        _emptyResource = new Resource('none', 'empty', null);
    this.resources = {};

    this.set = function(resource)
        { this.resources[resource.name] = resource; }
    this.get = function(name) {
        return (name in this.resources)
            ? this.resources[name] : _emptyResource;
    };

    this.nextName = function(name)
        { return nextKeyInDict(this.resources, name); };
    this.next = function(prev)
        { return this.get(this.nextName(prev.name)); }
}

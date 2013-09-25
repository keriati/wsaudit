define(['backbone'], function (Backbone) {
    'use strict';

    function Query(data) {
        this._attributes = {
            id: null,

            name:     '',
            method:   '',
            url:      '',
            datatype: '',
            rawdata:  '',

            headers: [],
            data:    [],

            processdata: true
        };

        if(_.isObject(data)) {
            this.set(data);
        }
    }

    Query.prototype = {
        get: function (key) {
            return this._attributes[key];
        },

        set: function(data, value) {
            if(_.isObject(data)) {
                _.extend(this._attributes, data);
            } else {
                if(this._attributes.hasOwnProperty(data)) {
                    this._attributes[data] = value;
                }
            }

            return this;
        },

        toJSON: function () {
            return _.extend({}, this._attributes);
        }
    };

    return Query;
});
/*global define*/
define([
    'jquery',
    'underscore'
],
function ($, _) {
    'use strict';

    function Query(data) {
        this._attributes = {
            id: null,

            name:        '',
            method:      '',
            url:         '',
            datatype:    '',
            contenttype: 'default',

            rawdata:     '',

            filedata: [],
            headers:  [],
            data:     [],

            processdata: true
        };

        if(_.isObject(data)) {
            this.set(data);
        }
    }

    Query.prototype = {
        get: function (key) {
            if(typeof key === 'undefined'){
                throw {
                    name: 'MissingArgument',
                    message: 'MissingArgument'
                };
            }

            if(this._attributes.hasOwnProperty(key)){
                return this._attributes[key];
            } else {
                throw {
                    name: 'InvalidField',
                    message: 'Invalid fields found: ' + key
                };
            }
        },

        set: function(data, value) {
            if(_.isUndefined(value) && !_.isObject(data)) {
                throw {
                    name: 'MissingArgument',
                    message: 'MissingArgument'
                };
            }

            if(_.isObject(data)) {
                var invalidFields = _.keys(_.omit(data, _.keys(this._attributes)));

                if( invalidFields.length > 0) {
                    throw {
                        name: 'InvalidField',
                        message: 'Invalid fields found: ' + JSON.stringify(invalidFields)
                    };
                }
                _.extend(this._attributes, _.pick(data, _.keys(this._attributes)));
            } else {
                if(this._attributes.hasOwnProperty(data)) {
                    this._attributes[data] = value;
                } else {
                    throw ({
                        name: 'InvalidField',
                        message: 'Invalid fields found: ' + data
                    });
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

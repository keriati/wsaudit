define(['backbone'], function(Backbone) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            name:     '',
            method:   '',
            url:      '',
            datatype: '',
            rawdata:  '',

            headers: [],
            data:    [],

            processdata: true
        }
    });
});
define(['jquery', 'underscore'], function ($, _) {
    'use strict';

    function Runner(Query) {
        this.query = Query;
        this.request = {};
    }

    Runner.prototype = {
        AJAX_TIMEOUT: 20000,

        run: function (options) {
            var that = this;

            this.req = {
                method:   this.query.get('method'),
                url:      this.query.get('url'),
                dataType: this.query.get('datatype'),
                headers:  {}
            };

            if(this.query.get('processdata')) {
                this.req.data = {};

                _.each(this.query.get('data'), function(data) {
                    this.req.data[data.key] = data.value;
                }, this);

                this.req.processData = true;

            } else {
                this.req.data = this.query.get('rawdata');
                this.req.processData = false;
                this.req.contentType = 'application/json';
            }

            if(this.req.method === 'head' || this.req.method === 'get') {
                this.req.cache = false;
            }

            _.each(this.query.get('headers'), function(header) {
                this.req.headers[header.key] = header.value;
            }, this);

            _.extend(this.req, options);

            return $.ajax(this.req);
        }
    };

    return Runner;
});
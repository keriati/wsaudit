/*global define*/
define([
    'jquery',
    'underscore'
],
function ($, _) {
    'use strict';

    function Request(Query) {
        this.query = Query;
        this.req = {};
    }

    Request.prototype = {
        AJAX_TIMEOUT: 20000,

        run : function() {
            return $.ajax(this.req);
        },

        prepare: function (options) {

            this.req = {
                method:   this.query.get('method'),
                url:      this.query.get('url'),
                dataType: this.query.get('datatype'),
                headers:  {},
                timeout:  this.AJAX_TIMEOUT
            };

            if(this.query.get('contenttype') !== 'default') {
                this.req.contentType = this.query.get('contenttype');
            }

            if(this.query.get('processdata')) {
                this.req.data = {};

                _.each(this.query.get('data'), function(data) {
                    this.req.data[data.key] = data.value;
                }, this);

                this.req.processData = true;

            } else {
                this.req.data = this.query.get('data');
                this.req.processData = false;
            }

            if(this.req.method === 'head' || this.req.method === 'get') {
                this.req.cache = false;
            }

            _.each(this.query.get('headers'), function(header) {
                this.req.headers[header.key] = header.value;
            }, this);

            _.extend(this.req, options);

            return this;
        }
    };

    return Request;
});

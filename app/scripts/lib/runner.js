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
                headers:  this.query.get('headers'),
                dataType: this.query.get('datatype')
            };

            if(this.query.get('processdata')) {
                this.req.data = this.query.get('data');
                this.req.processData = true;
            } else {
                this.req.data = this.query.get('rawdata');
                this.req.processData = false;
                this.req.contentType = 'application/json';
            }

            if(this.req.method === 'head' || this.req.method === 'get') {
                this.req.cache = false;
            }

            _.extend(this.req, options);

            if(this.req.dataType === 'jsonp') {
                if(typeof this.req.error === "function") {
                    $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
                        that.req.error(jqXHR, ajaxSettings, {error: "Check console for more information!"});
                    });
                }
            }

            return $.ajax(this.req);
        }
    };

    return Runner;
});
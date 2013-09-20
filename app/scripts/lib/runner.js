define(['jquery', 'underscore'], function ($, _) {
    'use strict';

    function Runner(Query) {
        this.query = Query;
        this.request = {};
    }

    Runner.prototype = {
        AJAX_TIMEOUT: 20000,

        run: function () {
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

            return $.ajax(this.req);
        }
    };

    return Runner;
});
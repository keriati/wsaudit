define([
    'backbone',

    'text!tpl/settings.html',

    'draggable'
], function(Backbone, tpl) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(tpl),

        events: {
            'click .ctrl-get_download': 'generateDownload',
            'click .ctrl-close':        'close',
            'click .ctrl-read':         'read'
        },

        initialize: function() {
//            this.storage = this.parent.app.storage;

            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
        },

        render: function() {
            this.$el.html(this.template());

            return this;
        },

        generateDownload: function() {
            if(window.URL) {
                var myQueries = this.storage.getAll(),
                    rawQueries = [];

                _.each(myQueries, function(Query) {
                    var q = Query.toJSON();
                    delete q.id;
                    rawQueries.push(q);
                });

                var data = JSON.stringify(rawQueries, null, "  ");
                var blob = new Blob([data], {type: "application/json"});
                var url  = URL.createObjectURL(blob);

                this.$el.find('#download').html($('<a href="' + url + '" download="wsa-settings.json">Download</a>'));
            }
        },

        read: function() {

            var that = this;

            var myFile = this.$el.find('.config-loader')[0].files[0],
                myFileReader = new FileReader();

            myFileReader.onload = function(ProgressEvent) {
                var newQueries = JSON.parse(ProgressEvent.target.result);

                _.each(newQueries, function(rawQuery) {
                    delete rawQuery.id;

                    var myQuery = new Query(rawQuery);

                    that.storage.save(myQuery);
                });

                that.options.panel.render();
            };

            myFileReader.readAsText(myFile);
        },

        close: function() {
            this.$el.remove();
        }
    });
});

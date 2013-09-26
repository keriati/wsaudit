/*global define, URL*/
define([
    'jquery',
    'underscore',

    'text!tpl/settings.html',

    'lib/query',
    'lib/storage',

    'draggable'
],
function($, _, tpl, Query, QueryStorage) {
    'use strict';

    function SettingsPanel(options) {
        this.$el = $('<div class="drag"></div>');

        this.options = _.extend({}, options);

        this.events();
        this.initialize();
    }

    SettingsPanel.prototype = {
        template: _.template(tpl),

        initialize: function() {
            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
            this.storage = new QueryStorage();
        },

        events: function() {
            var that = this;

            this.$el.on('click', '.ctrl-get_download', function(){
                that.generateDownload();
            });

            this.$el.on('click', '.ctrl-close', function(){
                that.close();
            });

            this.$el.on('click', '.ctrl-read_config', function(){
                that.readConfig();
            });
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
            } else {
                window.alert('URL.createObjectURL is not supported in your browser :(');
            }
        },

        readConfig: function() {
//            debugger;
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
    };

    return SettingsPanel;
});

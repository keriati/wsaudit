define(['jquery', 'underscore', 'lib/query', 'lib/storage'], function($, _, Query, Storage) {
    'use strict';

    function QueryPanel(query, options) {
        this.$el = $('<div></div>');
        this.$ = this.$el.find;

        this.options = _.extend({}, options);

        this.events();
        this.initialize(query);
    }

    QueryPanel.prototype = {
        template: _.template($.trim($('#tpl-querypanel').html())),

        initialize: function(query) {
            if(query instanceof Query) {
                this.query = query;
            } else {
                this.query = new Query();
            }
        },

        render: function() {
            var methods = ['get', 'post','put','delete','patch','options','head'];
            this.$el.html(this.template({methods: methods, q: this.query.toJSON()}));

            return this;
        },

        events: function() {
            var that = this;
            this.$el.on('click', '#ctrl-save_query', function(){
                that.saveQuery();
            });
        },

        saveQuery: function() {
            var myQuery = new Query({
                name: this.$el.find('.savename').val(),
                method: this.$el.find('.method').val(),
                url: this.$el.find('.url').val(),
                datatype: this.$el.find('.datatype').val(),
                rawdata: this.$el.find('.rawdta').val()
            });

            var myStorage = new Storage();


            myStorage.save(myQuery);

            this.options.panel.render();
        },

        close: function() {
            this.$el.remove();
        }
    };

    return QueryPanel;
});
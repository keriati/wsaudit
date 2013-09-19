/*global define */
define(['jquery', 'underscore', 'lib/storage', 'views/query'], function ($, _, Storage, QueryPanel) {
    'use strict';

    function Panel(data) {
        this.$el = $('<div></div>');

        _.extend(this, data);

        this.events();
        this.initialize();
    }

    Panel.prototype = {
        template : _.template($.trim($('#tpl-panel').html())),

        initialize: function() {
            this.storage = new Storage();
            this.queries = this.storage.getAll();
        },

        render: function() {
            var rawqueries = [];

            _.each(this.queries, function(query) {
                rawqueries.push(query.toJSON());
            });

            this.$el.html(this.template({queries: rawqueries}));

            return this;
        },

        events: function() {
            var that = this;
            this.$el.on('click', '#ctrl-add_query', function() {
                that.newQuery();
            });
        },

        newQuery: function() {
            var q = new QueryPanel();

            q.render().$el.appendTo('body');
        }
    };

    return Panel;
});
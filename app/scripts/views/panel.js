/*global define*/
define([
    'jquery',
    'underscore',

    'text!tpl/panel.html',

    'lib/storage',

    'views/query',
    'views/settings',

    'draggable'
],
function ($, _, tpl, QueryStorage, QueryPanel, SettingsPanel) {
    'use strict';

    function Panel(data) {
        this.$el = $('<div class="drag"></div>');

        _.extend(this, data);

        this.events();
        this.initialize();
    }

    Panel.prototype = {
        template : _.template(tpl),

        initialize: function() {
            this.storage = new QueryStorage();

            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
        },

        render: function() {
            this.queries = this.storage.getAll();

            var rawqueries = [];

            _.each(this.queries, function(query) {
                rawqueries.push(query.toJSON());
            });

            this.$el.html(this.template({queries: rawqueries}));

            return this;
        },

        events: function() {
            var that = this;
            this.$el.on('click', '.ctrl-add_query', function() {
                that.newQuery();
            });

            this.$el.on('click', '.ctrl-remove_query', function(e) {
                that.removeQuery(parseInt($(e.target).parent().parent().attr('data-qid'), 10));
            });

            this.$el.on('click', '.ctrl-open_query', function(e) {
                that.openQuery(parseInt($(e.target).parent().parent().attr('data-qid'), 10));
            });

            this.$el.on('click', '.ctrl-open_settings', function() {
                that.openSettings();
            });
        },

        newQuery: function() {
            var qp = new QueryPanel(null, {panel: this});

            qp.render().$el.appendTo('#content');
        },

        removeQuery: function(id) {
            if(window.confirm('Do you really want to remove this Query?')) {
                this.storage.remove(id);
                this.$el.find('.ql-item-' + id).remove();
            }
        },

        openQuery: function(id) {
            var q = this.storage.get(id);
            var qp = new QueryPanel(q, {panel: this});

            qp.render().$el.appendTo('body');
        },

        openSettings: function() {
            var settings = new SettingsPanel({panel: this});

            settings.render().$el.appendTo('body');
        }
    };

    return Panel;
});

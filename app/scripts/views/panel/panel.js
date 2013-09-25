define([
    'backbone',

    'text!tpl/panel.html',

    'views/query/query',

    'models/query',

    'draggable'
],
function (Backbone, tpl, QueryView, QueryModel) {
    'use strict';

    return Backbone.View.extend({
        template : _.template(tpl),

        events: {
            'click .ctrl-add_query':     'create',
            'click .ctrl-open_settings': 'settings'
        },

        initialize: function() {
            this.app = this.options.app;

            this.listenTo(this.collection, 'change', this.render());

            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
        },

        render: function() {
            this.$el.html(this.template({queries: this.collection.toJSON()}));

            return this;
        },


        create: function() {
            var qp = new QueryView({model: new QueryModel({app: this.options.app})});

            qp.render().$el.appendTo('#content');
        },

        settings: function() {

        }
    });
});
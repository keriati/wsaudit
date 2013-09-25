define([
    'backbone',

    'text!tpl/panel/panel.html',

    'views/panel/query',
    'views/query/query',

    'models/query',

    'draggable'
],
function (Backbone, tpl, PanelQueryView, QueryView, QueryModel) {
    'use strict';

    return Backbone.View.extend({
        template : _.template(tpl),

        events: {
            'click .ctrl-add_query':     'create',
            'click .ctrl-open_settings': 'settings'
        },

        initialize: function() {
            this.app = this.options.app;

            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'remove', this.render);

            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
        },

        render: function() {
            this.$el.html(this.template());

            this.collection.each(function(queryModel) {
                var myQueryView = new PanelQueryView({model: queryModel, app: this.app});

                myQueryView.render().$el.appendTo(this.$('.ql'));
            }, this);

            return this;
        },


        create: function() {
            var qp = new QueryView({model: new QueryModel(), app: this.app});

            qp.render().$el.appendTo('#content');
        },

        settings: function() {

        }
    });
});

/*global define*/
define([
    'backbone',

    'text!tpl/panel/query.html',

    'views/query/query'
],
function(Backbone, tpl, QueryView) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(tpl),

        events: {
            'click .ctrl-remove':  'remove',
            'click .ctrl-open':    'open'
        },

        initialize: function() {
            this.app = this.options.app;
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template({q: this.model.toJSON()}));

            return this;
        },

        remove: function() {
            if(window.confirm('Do you really want to remove this item?')){
                this.model.destroy();
            }
        },

        open: function() {
            var myQueryView = new QueryView({model: this.model, app: this.app});

            myQueryView.render().$el.appendTo('body');
        }
    });
});

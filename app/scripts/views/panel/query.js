define(['backbone', 'text!tpl/panel/query.html', 'views/query/query'], function(Backbone, tpl, QueryView) {
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
            this.$el.html(this.template);

            return this;
        },

        remove: function() {
            this.model.remove();
        },

        open: function(e) {
            var myQueryView = new QueryView({model: this.model});

            myQueryView.render().$el.appendTo('body');
        }
    });
});
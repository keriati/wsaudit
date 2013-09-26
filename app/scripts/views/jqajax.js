/*global define*/
define(['jquery', 'underscore', 'text!tpl/jqajax.html'], function($, _, tpl) {
    'use strict';

    function JQAJAXView(options) {
        this.$el = $('<div class="drag"></div>');

        this.options = _.extend({}, options);

        this.events();
        this.initialize();
    }

    JQAJAXView.prototype = {
        template: _.template(tpl),

        events: function() {
            var that = this;

            this.$el.on('click', '.ctrl-close', function() {
                that.close();
            });
        },

        initialize: function() {
            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
        },

        render: function() {
            this.$el.html(this.template({name: this.options.name, q: this.options.q}));

            return this;
        },

        close: function() {
            this.$el.remove();
        }
    };

    return JQAJAXView;
});

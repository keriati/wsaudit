/*global define*/
define(['views/panel'], function (Panel) {
    'use strict';

    function WSAudit() {
        this.initialize();
    }

    WSAudit.prototype = {
        initialize: function() {
            this.panel = new Panel();

            this.panel.render().$el.appendTo('#content');
        }
    };

    return WSAudit;
});

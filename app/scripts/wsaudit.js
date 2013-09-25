define([
    'views/panel/panel',
    'views/settings',

    'collections/queries'
], function (PanelView, SettingsView, QueriesCollection) {
    'use strict';

    function WSAudit() {
        this.initialize();
    }

    WSAudit.prototype = {
        STORAGE_KEY: 'wsauditdata',

        initialize: function() {
            this.collection = new QueriesCollection({storageID: this.STORAGE_KEY});

            this.collection.fetch();

            this.panel = new PanelView({collection: this.collection, app: this});

            this.settings = new SettingsView({collection: this.collection, app: this});

            this.panel.render().$el.appendTo('#content');
        }
    };

    return WSAudit;
});
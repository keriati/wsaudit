define(['backbone', 'models/query', 'localStorage'], function(Backbone, QueryModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: QueryModel,

        initialize: function(options) {
            this.localStorage = new Backbone.LocalStorage(options.storageID);
        }
    });
});
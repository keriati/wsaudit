require.config({
    shim: {
        backbone: {
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        },
        underscore: {
            exports: '_'
        },
        draggable: ['jquery']
    },

    paths: {
        text:         '../bower_components/requirejs-text/text',
        tpl:          '../templates',
        jquery:       '../bower_components/jquery/jquery',
        underscore:   '../bower_components/underscore/underscore',
        backbone:     '../bower_components/backbone/backbone',
        localStorage: '../bower_components/Backbone.localStorage/backbone.localStorage',
        draggable:    '../vendor/jquery-ui-1.10.3.custom'
    }
});

require(['wsaudit'], function (WSAudit) {
    'use strict';

    var myWSAudit = new WSAudit();
});

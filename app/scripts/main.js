/*global require*/
require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        draggable: {
           deps: ['jquery']
        }
    },

    paths: {
        text:       '../bower_components/requirejs-text/text',
        tpl:        '../templates',
        jquery:     '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        draggable:  '../vendor/jquery-ui-1.10.3.custom'
    }
});

require(['jquery', 'app'], function ($, WSAudit) {
    'use strict';

    try {
    var myWSAudit = new WSAudit();
    } catch(e) {
        console.log('Error!');
        console.log(e);
    }

    $('.ctrl-add_query').trigger('click');
});

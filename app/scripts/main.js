require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        draggable: ['jquery']
    },

    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        draggable: '../../vendor/jquery-ui-1.10.3.custom'
    }
});

require(['app'], function (WSAudit) {
    'use strict';

    var myWSAudit = new WSAudit();

    $('.ctrl-add_query').trigger('click');

});

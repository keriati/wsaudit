require.config({
    shim: {
        underscore: {
            exports: '_'
        }
    },

    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore'
    }
});

require(['app'], function (WSAudit) {
    'use strict';

    var myWSAudit = new WSAudit();

});

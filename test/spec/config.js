require.config({
    deps: ['runner'],

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
        draggable:  '../vendor/jquery-ui-1.10.3.custom',
        spec:       '../spec',
        runner:     '../spec/runner'
    },

    baseUrl: 'scripts'
});
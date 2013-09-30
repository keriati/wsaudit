/*global require */
require([
    // all spec here
    'spec/lib/query.spec',
    'spec/lib/storage.spec',
    'spec/lib/printer.spec'
],
function() {
    mocha.run();
});

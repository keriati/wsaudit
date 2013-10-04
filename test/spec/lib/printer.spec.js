/*global define, describe, it, expect, before*/
define(['lib/query', 'lib/request', 'lib/printer'], function(Query, Request, Printer) {
    'use strict';

    var myQuery = new Query();

    describe('Printer', function () {

        describe('#makejqajax()', function() {

            before(function() {
                myQuery = new Query({
                    url: 'http://test',
                    method: 'post',
                    datatype: 'json',
                    data: [
                        {
                            key: 'foo',
                            value: 'bar'
                        }
                    ],
                    headers: [
                        {
                            key: 'foo',
                            value: 'bar'
                        }
                    ]
                });
            });

            it('should generate jquery ajax calls from requests', function() {

                var expected =
                    '$.ajax({' + '\n' +
                    '  method: \'post\',' + '\n' +
                    '  url: \'http://test\',' + '\n' +
                    '  dataType: \'json\',' + '\n' +
                    '  processData: true,' + '\n' +
                    '  timeout: 20000,' + '\n' +
                    '  headers: {' + '\n' +
                    '    foo: \'bar\'' + '\n' +
                    '  },' + '\n' +
                    '  data: {' + '\n' +
                    '    foo: \'bar\'' + '\n' +
                    '  },' + '\n' +
                    '  success: function(data, textStatus, jqXHR) {' + '\n' +
                    '    //Success Code here' + '\n' +
                    '  },' + '\n' +
                    '  error: function(jqXHR, textStatus, errorThrown) {' + '\n' +
                    '    //Error handling here' + '\n' +
                    '  }' + '\n' +
                    '});';

                var myPrintter = new Printer();

                var result = myPrintter.makejqajax(myQuery);

                console.log(result)

                expect(result).to.equal(expected);
            });
        });
    });

});

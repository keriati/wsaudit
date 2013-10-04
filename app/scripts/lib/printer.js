/*global define*/
define(['lib/request'], function(Request) {
    'use strict';

    function Printer() {

    }

    Printer.prototype = {
        makejqajax: function(query) {

            var myRequest = new Request(query);

            myRequest.prepare();

            var qString = JSON.stringify(myRequest.req, this.handleFormData, '  ');

            qString = qString.replace(/"([a-zA-Z_]*)":/gm, '$1:');

            qString = qString.replace(/: "(.*)"([,|\n]?)/gm, ': \'$1\'$2');

            qString = qString.replace(/^{/, '$.ajax({');

            qString = qString.replace(
                /\n}$/,

                ',\n' +
                    '  success: function(data, textStatus, jqXHR) {\n' +
                    '    //Success Code here\n' +
                    '  },\n' +
                    '  error: function(jqXHR, textStatus, errorThrown) {\n' +
                    '    //Error handling here\n' +
                    '  }\n' +
                    '});'
            );

            return qString;
        },
        handleFormData: function(key, value) {
            if(value instanceof FormData){
                return value.toString();
            }

            return value;
        }
    };

    return Printer;

});
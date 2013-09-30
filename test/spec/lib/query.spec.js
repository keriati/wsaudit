/*global define, describe, it, expect*/
define(['lib/query'], function(Query) {
    'use strict';

    describe('Query', function () {
        describe('#set()', function() {
            it('should set attibutes with 2 parameters', function() {
                var myQuery = new Query();

                myQuery.set('name', 'test');

                expect(myQuery._attributes.name).to.equal('test');
            });
            it('should set attibutes from objects', function() {
                var myQuery = new Query();

                myQuery.set({'name': 'test'});

                expect(myQuery._attributes.name).to.equal('test');
            });
            it('should throw exception if no argument is given', function() {
                var myQuery = new Query();

                function fn() {
                    myQuery.set();
                }

                expect( fn ).to.throw(/MissingArgument/);
            });
            it('should throw exception if invalid argument is given', function() {
                var myQuery = new Query();

                function fn() {
                    myQuery.set({invalid: 'test'});
                }

                expect( fn ).to.throw(/Invalid fields/);
            });
        });
    });

});

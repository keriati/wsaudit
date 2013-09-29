/*global define, describe, it, should*/
define(['lib/query'], function(Query) {
    'use strict';

    describe('Query', function () {
        describe('#set', function() {
            it('should set attibutes with 2 parameters', function() {
                var myQuery = new Query();

                myQuery.set('name', 'test');

                myQuery.get('name').should.equal('test');
            });
            it('should set attibutes from objects', function() {
                var myQuery = new Query();

                myQuery.set({'name': 'test'});

                myQuery.get('name').should.equal('test');
            });
            it('should only set valid attributes', function() {
                var myQuery = new Query();

                myQuery.set({'invalid': 'test'});

                expect(myQuery.get('invalid')).to.be.undefined;

                myQuery.set('invalid', 'test');

                expect(myQuery.get('invalid')).to.be.undefined;
            });
        });
    });

});

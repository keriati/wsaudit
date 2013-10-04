/*global define, describe, it, expect, before, afterEach*/
define(['lib/storage', 'lib/query'], function(QueryStorage, Query) {
    'use strict';

    function fillStorage() {
        var testQuery1 = new Query({name: 'Test Query 1'});
        var testQuery2 = new Query({name: 'Test Query 2'});
        var testQuery3 = new Query({name: 'Test Query 3'});

        var myStorage = new QueryStorage();

        myStorage.save(testQuery1);
        myStorage.save(testQuery2);
        myStorage.save(testQuery3);
    }

    before(function() {
        window.localStorage.clear();
    });

    describe('QueryStorage', function () {

        afterEach(function() {
            window.localStorage.clear();
        });

        describe('#save()', function() {

            it('Should save new items with new id.', function() {

                var testQuery = new Query({name: 'Test Query'});

                var myStorage = new QueryStorage();

                myStorage.save(testQuery);

                expect(testQuery.get('id')).to.be.a('number');

                expect(myStorage.get(testQuery.get('id'))).to.deep.equal(testQuery);
            });

            it('Should update changes of existing items.', function() {
                var testQuery = new Query({name: 'Test Query 1'});

                var myStorage = new QueryStorage();

                myStorage.save(testQuery);

                expect(myStorage.getAll()).to.have.length.of(1);

                expect(myStorage.getAll()[0].get('name')).to.equal('Test Query 1');

                testQuery.set({name: 'Test Query 2'});

                myStorage.save(testQuery);

                expect(myStorage.getAll()).to.have.length.of(1);

                expect(myStorage.getAll()[0].get('name')).to.equal('Test Query 2');
            });
        });

        describe('#getAll()', function() {

            before(fillStorage);

            it('Should return all saved items.', function() {
                var myStorage = new QueryStorage();

                var queries = myStorage.getAll();

                expect(queries).to.have.length.of(3);
                expect(queries[0].get('name')).to.equal('Test Query 1');
                expect(queries[1].get('name')).to.equal('Test Query 2');
                expect(queries[2].get('name')).to.equal('Test Query 3');
            });
        });

        describe('#get()', function() {
            it('Should return a query if valid id is given.', function() {
                var testQuery1 = new Query({name: 'Test Query 1'});

                var myStorage = new QueryStorage();

                myStorage.save(testQuery1);

                var testQuery2 = myStorage.get(testQuery1.get('id'));

                expect(testQuery2).to.deep.equal(testQuery1);
            });
        });

        describe('#remove()', function(){

            before(fillStorage);

            it('Should remove a valid item.', function() {
                var myStorage = new QueryStorage();

                myStorage.remove(1);

                expect(myStorage.getAll()).to.have.length.of(2);

                myStorage.remove(2);

                expect(myStorage.getAll()).to.have.length.of(1);
            });
        });
    });

});

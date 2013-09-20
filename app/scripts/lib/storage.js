define(['underscore', 'lib/query'], function (_, Query) {
    'use strict';

    function Storage() {

    }

    Storage.prototype = {
        LCKEY: 'wsauditdata',
        LCINT: 'wsauditint',

        getAll: function() {
            var rawqueries = this._getRaw(),
                queries = [];

            _.each(rawqueries, function(rawquery) {
                queries.push(new Query(rawquery));
            });

            return queries;
        },

        get: function(id) {
            var rawqueries = this._getRaw();

            var rawquery = _.find(rawqueries, function(data) {
                return data.id === id;
            });

            return new Query(rawquery);
        },

        save: function(Query) {
            if(Query.get('id') === null) {
                return this._create(Query);
            }

            return this._update(Query);
        },

        _create: function(Query) {
            Query.set('id', this._getNewIndex());

            this._createRaw(Query.toJSON());

            return Query;
        },

        _update: function(newQuery) {
            var id = newQuery.get('id');

            this.remove(id);

            this._createRaw(newQuery.toJSON());

            return newQuery;
        },

        remove: function(id) {
            var rawqueries = this._getRaw(),
                deleted;

            var filtered = _.filter(rawqueries, function(data) {
                if(data.id === id) {
                    deleted = data;
                    return false;
                }
                return true;
            });

            localStorage.setItem(this.LCKEY, JSON.stringify(filtered));

            return deleted;
        },

        _createRaw: function(rawquery) {
            var data = this._getRaw();

            data.push(rawquery);

            localStorage.setItem(this.LCKEY, JSON.stringify(data));
        },

        _getRaw: function() {
            var data = localStorage.getItem(this.LCKEY);

            if(data === null) {
                return [];
            }

            return JSON.parse(data);
        },

        _getIndex: function() {
            var index = localStorage.getItem(this.LCINT);

            if(index === null) {
                return 0;
            }

            return index;
        },

        _getNewIndex: function() {
            var index = this._getIndex();

            index++;

            localStorage.setItem(this.LCINT, index);

            return index;
        }
    };

    return Storage;
});
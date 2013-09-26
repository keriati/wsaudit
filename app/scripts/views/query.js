/*global define*/
define(['jquery', 'underscore', 'text!tpl/query.html', 'text!tpl/keyvalue.html', 'lib/query', 'lib/storage', 'lib/runner', 'draggable'], function($, _, tpl, kvtpl, Query, Storage, Runner) {
    'use strict';

    function QueryPanel(query, options) {
        this.$el = $('<div class="drag"></div>');

        this.options = _.extend({}, options);

        this.events();
        this.initialize(query);
    }

    QueryPanel.prototype = {
        template: _.template(tpl),

        templateKeyValuePair: _.template(kvtpl),

        initialize: function(query) {
            if(query instanceof Query) {
                this.query = query;
            } else {
                this.query = new Query();
            }

            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
        },

        events: function() {
            var that = this;

            this.$el.on('click', '.ctrl-start', function(){
                that.start();
            });

            this.$el.on('click', '.ctrl-save_query', function(){
                that.saveQuery();
            });

            this.$el.on('click', '.ctrl-saveas_query', function(){
                that.saveQuery(true);
            });

            this.$el.on('click', '.ctrl-remove_query', function(){
                that.removeQuery();
            });

            this.$el.on('click', '.ctrl-close', function(){
                that.close();
            });

            this.$el.on('click', '.ctrl-add_data', function(){
                that.addKeyValuePair("", "", 'data');
            });

            this.$el.on('click', '.ctrl-add_header', function(){
                that.addKeyValuePair("", "", 'header');
            });

            this.$el.on('click', '.ctrl-removepair', function() {
                $(this).parent().parent().remove();
            });

            this.$el.on('change', '.processdata', function() {
                if($(this).val() === 'true') {
                    that.$el.find('.data-cont').show();
                    that.$el.find('.rawdata-cont').hide();
                } else {
                    that.$el.find('.data-cont').hide();
                    that.$el.find('.rawdata-cont').show();
                }
            });
        },

        render: function() {
            var methods = ['get', 'post','put','delete','patch','options','head'],
                datatypes = ['text', 'json', 'jsonp', 'html', 'script', 'xml'],
                data;

            data = {
                methods: methods,
                datatypes: datatypes,
                q: this.query.toJSON()
            };

            this.$el.html(this.template(data));

            return this;
        },

        start: function() {
            var outputHeaders = this.$el.find('.output-headers'),
                outputData = this.$el.find('.output-data'),
                that = this;

            outputHeaders.html('Loading...');
            outputData.html('Loading...');

            this.updateQuery();

            var myRunner = new Runner(this.query);

            myRunner
                .run({
                    success: function(data, textStatus, jqXHR) {
                        that.showResult(jqXHR, data, this);
                    },
                    error: function(jqXHR,textStatus, errorThrown) {
                        that.showResult(jqXHR, jqXHR.responseJSON, this);
                    }
                });
        },

        showResult: function(jqXHR, data, ajax) {
            var $houtput = this.$el.find('.output-headers'),
                $doutput = this.$el.find('.output-data'),
                statusball = (jqXHR.status === 200) ? '<span class="greenball"></span>' : '<span class="redball"></span>';

            $houtput.empty();
            $doutput.empty();

            $houtput.append('<strong>Request URL: </strong>' + ajax.url + '<br/>');
            $houtput.append('<strong>Request Method: </strong>' + ajax.type + '<br/>');
            $houtput.append('<strong>Status: </strong>' + statusball + ' ' + jqXHR.status + ' ' + jqXHR.statusText + '<br />');
            $houtput.append('<strong>Response Headers: </strong><br />');
            $houtput.append('<code><pre>' + jqXHR.getAllResponseHeaders() + '</code></pre>');

            if(_.isObject(data)) {
                $doutput.append(JSON.stringify(data, null, "  "));
            } else {
                $doutput.append(data);
            }
        },

        updateQuery: function() {
            var dataPairs = [],
                headerPairs = [];

            this.$el.find('.data-pair').each(function(){
                dataPairs.push({
                    key:   $(this).find('.data-key').val(),
                    value: $(this).find('.data-value').val()
                });
            });

            this.$el.find('.header-pair').each(function(){
                headerPairs.push({
                    key:   $(this).find('.header-key').val(),
                    value: $(this).find('.header-value').val()
                });
            });

            this.query.set({
                name:        this.$el.find('.savename').val(),
                method:      this.$el.find('.method').val(),
                url:         this.$el.find('.url').val(),
                datatype:    this.$el.find('.datatype').val(),
                rawdata:     this.$el.find('.rawdata').val(),
                data:        dataPairs,
                processdata: true,
                headers:     headerPairs
            });

            if(this.$el.find('.processdata').val() !== 'true') {
                this.query.set({processdata: false});
            }
        },

        saveQuery: function(saveAsNew) {

            this.updateQuery();

            if(saveAsNew === true) {
                var newName = window.prompt('Please enter new name:', this.query.get('name'));

                if(newName === null || newName === "") {
                    window.alert('Error: No name given.');
                    return;
                }

                this.query.set('id', null);
                this.query.set('name', newName);
            }

            var myStorage = new Storage();

            this.query = myStorage.save(this.query);

            this.options.panel.render();
            this.render();
        },

        addKeyValuePair: function(key, value, type) {
            var tpl = this.templateKeyValuePair({key: key, value: value, type: type});
            this.$el.find('.' + type + '-list').append(tpl);
        },

        close: function() {
            this.$el.remove();
        },

        removeQuery: function() {
            if(window.confirm('Do you really want to remove this Query?')) {
                var myStorage = new Storage();
                myStorage.remove(this.query.get('id'));
                this.options.panel.$el.find('.ql-item-' + this.query.get('id')).remove();
                this.close();
            }
        }
    };

    return QueryPanel;
});

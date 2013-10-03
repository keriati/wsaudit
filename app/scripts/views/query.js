/*global define*/
define([
    'jquery',
    'underscore',

    'text!tpl/query.html',
    'text!tpl/keyvalue.html',
    'text!tpl/file.html',

    'views/jqajax',

    'lib/query',
    'lib/storage',
    'lib/request',

    'draggable'
],
function($, _, tpl, kvtpl, filetpl, JQAJAXView, Query, QueryStorage, Request) {
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

        templateFile: _.template(filetpl),

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

            this.$el.on('click', '.ctrl-gen_ajax', function(){
                that.generateJQAJAX();
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

            this.$el.on('click', '.ctrl-add_string', function(){
                that.addKeyValuePair("", "", 'data');
            });

            this.$el.on('click', '.ctrl-add_file', function(){
                that.addFile();
            });

            this.$el.on('click', '.ctrl-add_header', function(){
                that.addKeyValuePair("", "", 'header');
            });

            this.$el.on('click', '.ctrl-removepair', function() {
                $(this).parent().parent().remove();
            });

            this.$el.on('change', '.contenttype', function() {
                if($(this).val() === 'other') {
                    that.$el.find('.other-contenttype').show();
                } else {
                    that.$el.find('.other-contenttype').hide();
                }
            });
        },

        render: function() {
            var methods = ['get', 'post','put','delete','patch','options','head'],
                datatypes = ['text', 'json', 'jsonp', 'html', 'script', 'xml'],
                data;

            data = {
                methods:   methods,
                dataTypes: datatypes,
                q:         this.query.toJSON()
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

            var myRequest = new Request(this.query);

            myRequest
                .prepare({
                    success: function(data, textStatus, jqXHR) {
                        that.showResult(jqXHR, data, this);
                    },
                    error: function(jqXHR) {
                        that.showResult(jqXHR, jqXHR.responseJSON, this);
                    }
                })
                .run();
        },

        showResult: function(jqXHR, data, ajax) {
            var $houtput   = this.$el.find('.output-headers'),
                $doutput   = this.$el.find('.output-data'),
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

            this.$el.find('.header-pair').each(function(){
                headerPairs.push({
                    key:   $(this).find('.header-key').val(),
                    value: $(this).find('.header-value').val()
                });
            });

            this.$el.find('.data-pair').each(function(){
                dataPairs.push({
                    key:   $(this).find('.data-key').val(),
                    value: $(this).find('.data-value').val()
                });
            });

            this.query.set({
                name:        this.$el.find('.savename').val(),
                method:      this.$el.find('.method').val(),
                url:         this.$el.find('.url').val(),
                datatype:    this.$el.find('.datatype').val(),
                rawdata:     this.$el.find('.rawdata').val(),
                headers:     headerPairs,
                data:        dataPairs
            });

            if(this.$el.find('.processdata').val() === 'true') {
                this.query.set({processdata: true});
            } else {
                this.query.set({processdata: false});
            }

            switch(this.$el.find('.contenttype').val()) {
                case 'false':
                    this.query.set({contenttype: false});
                    break;
                case 'json':
                    this.query.set({contenttype: 'application/json'});
                    break;
                case 'other':
                    this.query.set({contenttype: this.$el.find('.other-contenttype').val()});
                    break;
                default:
                    this.query.set({contenttype: 'default'});
                    break;
            }

            if(this.$el.find('.data-files').length > 0) {
                var myFormData = new FormData(),
                    fileData = [];

                this.$el.find('.data-pair').each(function(){
                    myFormData.append(
                        $(this).find('.data-key').val(),
                        $(this).find('.data-value').val()
                    );
                });

                this.$el.find('.data-files').each(function() {
                    myFormData.append(
                        $(this).find('.data-name').val(),
                        $(this).find('.data-file')[0].files[0]
                    );
                    fileData.push({
                        key:   $(this).find('.data-name').val(),
                        value: ($(this).find('.data-file')[0].files[0]) ? $(this).find('.data-file')[0].files[0].name : ''
                    });
                });

                this.query.set({rawdata: myFormData});
                this.query.set({filedata: fileData});
            } else {
                this.query.set({rawdata: ''});
                this.query.set({filedata: []});
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

            var myStorage = new QueryStorage();

            this.query = myStorage.save(this.query);

            this.options.panel.render();
            this.render();
        },

        addKeyValuePair: function(key, value, type) {
            var tpl = this.templateKeyValuePair({key: key, value: value, type: type});
            this.$el.find('.' + type + '-list').append(tpl);
        },

        addFile: function() {
            var tpl = this.templateFile();
            this.$el.find('.data-list').append(tpl);
        },

        generateJQAJAX: function() {
            var that = this;

            this.updateQuery();

            var myJQAjaxView = new JQAJAXView({query: this.query});

            myJQAjaxView.render().$el.appendTo('body');
        },

        close: function() {
            this.$el.remove();
        },

        removeQuery: function() {
            if(window.confirm('Do you really want to remove this Query?')) {
                var myStorage = new QueryStorage();
                myStorage.remove(this.query.get('id'));
                this.options.panel.$el.find('.ql-item-' + this.query.get('id')).remove();
                this.close();
            }
        }
    };

    return QueryPanel;
});

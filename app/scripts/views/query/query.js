/*global define*/
define([
    'backbone',

    'text!tpl/query/query.html',
    'text!tpl/query/keyvalue.html',

    'lib/runner',

    'draggable'
],
function(Backbone, tpl, tplkv, Runner) {
    'use strict';

    return Backbone.View.extend({
        template: _.template(tpl),

        tplKV: _.template(tplkv),

        events: {
            'click .ctrl-start':       'start',
            'click .ctrl-save':        'save',
            'click .ctrl-saveas':      'saveAs',
            'click .ctrl-remove':      'remove',
            'click .ctrl-close':       'close',
            'click .ctrl-add_data':    'addData',
            'click .ctrl-add_header':  'addHeader',
            'click .ctrl-remove_data': 'removeData',

            'change .processdata': function() {
                if ($(this).val() === 'true') {
                    this.$('.data-cont').show();
                    this.$('.rawdata-cont').hide();
                } else {
                    this.$('.data-cont').hide();
                    this.$('.rawdata-cont').show();
                }
            }
        },

        initialize: function() {
            this.app = this.options.app;

            this.$el.draggable({stack: '.drag', handle: '.drag-handle'});
        },

        render: function() {
            var methods = ['get', 'post','put','delete','patch','options','head'],
                datatypes = ['text', 'json', 'jsonp', 'html', 'script', 'xml'],
                data;

            data = {
                methods:   methods,
                datatypes: datatypes,
                q:         this.model.toJSON()
            };

            console.log('QueryTPL Data: ', data);

            this.$el.html(this.template(data));

            return this;
        },

        start: function() {
            var outputHeaders = this.$('.output-headers'),
                outputData = this.$('.output-data'),
                that = this;

            outputHeaders.html('Loading...');
            outputData.html('Loading...');

            this.update();

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
            var $houtput = this.$('.output-headers'),
                $doutput = this.$('.output-data'),
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

        update: function() {
            var dataPairs = [],
                headerPairs = [];

            this.$('.data-pair').each(function(){
                dataPairs.push({
                    key:   $(this).find('.data-key').val(),
                    value: $(this).find('.data-value').val()
                });
            });

            this.$('.header-pair').each(function(){
                headerPairs.push({
                    key:   $(this).find('.header-key').val(),
                    value: $(this).find('.header-value').val()
                });
            });

            this.model.set({
                name:        this.$('.savename').val(),
                method:      this.$('.method').val(),
                url:         this.$('.url').val(),
                datatype:    this.$('.datatype').val(),
                rawdata:     this.$('.rawdata').val(),
                data:        dataPairs,
                processdata: true,
                headers:     headerPairs
            });

            if(this.$('.processdata').val() !== 'true') {
                this.model.set({processdata: false});
            }
        },

        save: function(saveAsNew) {

            this.update();

            if(saveAsNew === true) {
                var newName = window.prompt('Please enter new name:', this.model.get('name'));

                if(newName === null || newName === "") {
                    window.alert('Error: No name given.');
                    return;
                }

                this.$('.savename').val(newName);
                this.model.set('id', null);
                this.model.set('name', newName);
            }

            console.log(this.model)

            this.app.collection.create(this.model);
        },

        saveAs: function() {
            this.save(true);
        },

        addKeyValuePair: function(key, value, type) {
            var tpl = this.tplKV({key: key, value: value, type: type});
            this.$('.' + type + '-list').append(tpl);
        },

        remove: function() {
            if(window.confirm('Do you really want to remove this Query?')) {

                this.storage.remove(this.query.get('id'));

                this.options.panel.$el.find('.ql-item-' + this.query.get('id')).remove();

                this.close();
            }
        },

        close: function() {
            this.$el.remove();
        }
    });
});

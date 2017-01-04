define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');

    function Polling(url, options) {
        var _this = this;
        var defaults = {
            ajax: {
                type: 'get', //'get'|'post'|'jsonp'
                data: null
            },
            time: 1000 //第二次轮询发送时间
        };
        _this.options = $.extend(true, {}, defaults, options);
        _this.options.ajax.url = url;
        _this._isLoading = false;
    }

    //继承自定义事件
    Util.inherits(Polling, EventEmitter);

    //开始轮询
    Polling.prototype.start = function() {
        var _this = this,
            options = _this.options,
            ajax = _this.options.ajax;
        _this._isLoading = false;
        // console.log(_this._interval);
        if (!_this._interval) {
            _this._interval = setInterval(function() {
                if (!_this._isLoading) {
                    _this._isLoading = true;
                    io[ajax.type](ajax.url, ajax.data, function(data) {
                        _this._isLoading = false;
                        _this.emit('success', data);
                    }, function(data) {
                        _this._isLoading = false;
                        _this.emit('error', data);
                    });
                }
            }, options.time);
        }
    }

    //停止轮询
    Polling.prototype.stop = function() {
        var _this = this,
            options = _this.options,
            ajax = _this.options.ajax;
        _this._isLoading = true;
        // _this._interval && clearInterval(_this._interval);
    }

    //动态设置ajax data
    Polling.prototype.setData = function(data) {
        var _this = this;
        _this.options.ajax.data = $.extend({}, _this.options.ajax.data, data);
    }

    module.exports = Polling;
});

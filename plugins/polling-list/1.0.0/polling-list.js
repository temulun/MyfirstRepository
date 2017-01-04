define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var IO = require('lib/core/1.0.0/io/request');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');
    var Polling = require('./polling');

    function PollingList(el, options) {
        var _this = this;
        _this.el = $(el);
        if (_this.el.length == 0) {
            throw new Error('the param [el] is required.');
        }
        _this.container = $('<div node-type="container"></div>');
        _this.el.html(_this.container);
        var defaults = {
            ajax: {
                url: null,
                type: 'get', //'get'|'post'|'json'
                data: null
            }
        }
        _this.options = $.extend(true, {}, defaults, options);
        _this._init();
        _this._initEvent();
    }

    //继承自定义事件
    Util.inherits(PollingList, EventEmitter);

    PollingList.prototype._init = function() {
        var _this = this;
        _this.polling = new Polling(_this.options.ajax.url, {
            ajax: _this.options.ajax
        });
    }

    PollingList.prototype._initEvent = function() {
        var _this = this;
        //数据获取成功
        _this.polling.on('error', function(data) {
            _this.emit('error', data, _this.container);
        });
        //数据获取失败
        _this.polling.on('success', function(data) {
            _this.emit('success', data, _this.container);
        });

        //鼠标滚动事件
        _this.el.on('scroll', function(e) {
            if (_this.el.scrollTop() + _this.el.height() >= _this.container.height()) {
                _this.emit('pullup');
            }
        });
    }

    //动态设置ajax data
    PollingList.prototype.setData = function(data) {
        var _this = this;
        _this.polling.setData(data);
    }

    //销毁
    PollingList.prototype.destroy = function() {
        var _this = this;
    }

    //直接替换容器内容
    PollingList.prototype.html = function(strHtml) {
        var _this = this;
        _this.container.html(strHtml);
    }

    //向容器顶部追加元素
    PollingList.prototype.prepend = function(strHtml) {
        var _this = this;
        _this.container.prepend(strHtml);
    }

    //向容器底部追加元素
    PollingList.prototype.append = function(strHtml) {
        var _this = this;
        _this.container.append(strHtml);
    }

    //开始拉新
    PollingList.prototype.start = function() {
        var _this = this;
        _this.polling.start();
    }

    //停止拉新
    PollingList.prototype.stop = function() {
        var _this = this;
        _this.polling.stop();
    }

    //清屏
    PollingList.prototype.clear = function() {
        var _this = this;
        _this.container.html('');
    }

    //跳转位置
    PollingList.prototype.scrollTo = function(top) {
        var _this = this;
        _this.el.stop().animate({
            scrollTop: top || 0
        });
    }

    module.exports = PollingList;
});

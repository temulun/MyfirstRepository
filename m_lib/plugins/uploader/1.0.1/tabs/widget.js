define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var build = require('lib/core/1.0.0/dom/build');
    var Util = require('lib/core/1.0.0/utils/util');

    /**
     * 钉子
     * @event show,hide,setting,del
     * @param {[dom | jquery selector]} container [父容器]
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Widget(options) {
        var _this = this;
        //默认参数    
        var defaults = {
            'type': 'null',
            'title': 'null'
        };
        _this._options = options = $.extend({}, defaults, options);
        _this.container = $(_this._makeContainer());
        _this.container.hide();
        _this.title = $(_this._makeTitle());
        //缓存关键内部元素
        _this._nodes = build.parse(_this.container, false);
    }

    //继承自定义事件
    Util.inherits(Widget, EventEmitter);

    /**
     * DOM grep api for select elements identified by attribute `node-type`,
     * e.g, `<div node-type="body"></div>`
     *
     * @return {jQuery} Returns a jquery DOM object.
     */
    Widget.prototype.$ = function(type, strictReturn) {
        var nodes = this._nodes || (this._nodes = {}),
            node = nodes[type];
        if (!node || (strictReturn && node.length === 0)) {
            node = this.el.find('[node-type="' + type + '"]');
            if (strictReturn && node.length > 0) {
                nodes[type] = node;
            }
        }
        return !strictReturn || node.length ? node : null;
    };

    Widget.prototype._init = function() {
        var _this = this;
        _this._onEvent();
    }

    Widget.prototype.activate = function() {
        var _this = this;
        if (!_this._initialized) {
            _this._init();
            _this._initialized = true;
        }
        _this.container.show();
        _this.title.addClass('activate');
        _this.emit('activate');
    }

    Widget.prototype.deactivate = function() {
        var _this = this;
        _this.container.hide();
        _this.title.removeClass('activate');
    }

    Widget.prototype._makeContainer = function() {
        var str = '';
        return str;
    }

    Widget.prototype._onEvent = function() {
        var _this = this;

    }

    Widget.prototype._offEvent = function() {
        var _this = this;
    }

    Widget.prototype.destroy = function() {
        var _this = this;
        _this._offEvent();
        _this.container.remove();
        _this.title.remove();
    }

    Widget.prototype._makeTitle = function() {
        var _this = this;
        return '<li data-tab-type="' + _this._options.type + '"><a href="javascript:;">' + _this._options.title + '</a></li>';
    }

    module.exports = Widget;
});

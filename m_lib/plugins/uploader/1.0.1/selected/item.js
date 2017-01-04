define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Box = require('lib/ui/box/1.0.1/box');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');

    //默认参数    
    var defaults = {};

    /**
     * 图片上传插件
     * 
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Item(url, options) {
        if (!url) {
            throw new Error('the param [url] is required.');
        }
        var _this = this;
        _this._options = options = $.extend({}, defaults, options);
        _this.url = url;
        _this.el = $(_this._make());
        //缓存关键内部元素
        _this._nodes = build.parse(_this.el, false);
        //注册事件
        _this._initEvent();
    }

    //继承自定义事件
    Util.inherits(Item, EventEmitter);

    /**
     * DOM grep api for select elements identified by attribute `node-type`,
     * e.g, `<div node-type="body"></div>`
     *
     * @return {jQuery} Returns a jquery DOM object.
     */
    Item.prototype.$ = function(type, strictReturn) {
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

    Item.prototype._initEvent = function(isBind) {
        if (isBind === undefined) {
            isBind = true;
        }
        var _this = this;
        _this.el.off('click');
        _this._nodes['del'].off('click');

        if (isBind) {
            _this.el.on('click', function() {
                _this.activate();
            });
            _this._nodes['del'].on('click', function() {
                _this.destroy();
                _this.emit('del');
            });
        }
    }

    Item.prototype.activate = function() {
        var _this = this;
        _this.el.addClass('activate');
        _this.emit('activate');
    }

    Item.prototype.deactivate = function() {
        var _this = this;
        _this.el.removeClass('activate');
        _this.emit('deactivate');
    }

    Item.prototype._make = function() {
        var _this = this,
            str = '';
        str += '<li>';
        str += '    <img src="' + _this.url + '">';
        str += '    <div class="selected-images-op">';
        str += '        <a href="javascript:;" node-type="del" title="删除">删除</a>';
        str += '    </div>';
        str += '    <div class="selected-images-mask"></div>';
        str += '</li>';
        return str;
    }

    Item.prototype.destroy = function() {
        var _this = this;
        _this._initEvent(false);
        _this.el.remove();
    }

    module.exports = Item;
});

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');

    //默认参数    
    var defaults = {

    };

    /**
     * 
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Item(options) {
        var _this = this;
        _this._options = options = $.extend({}, defaults, options);
        _this.el = $(_this._make());
        _this.file = _this._options;
        //缓存关键内部元素
        _this._nodes = build.parse(_this.el, false);
        _this._onEvent();
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

    Item.prototype._onEvent = function() {
        var _this = this;
        _this._nodes['click'].on('click', function() {
            _this.emit('del');
        });
    }

    Item.prototype._offEvent = function() {
        var _this = this;
        _this._nodes['click'].off('click');
    }

    Item.prototype.destroy = function() {
        var _this = this;
        _this._offEvent();
        _this.el.remove();
    }

    Item.prototype.progress = function(fileBytesLoaded, fileTotalBytes) {
        var _this = this,
            progress = fileBytesLoaded / fileTotalBytes * 100;
        _this._nodes['progress-line'].css({
            width: progress + '%'
        });
        return this;
    }

    Item.prototype._make = function() {
        var _this = this,
            str = '';
        str += '<li data-file-id="' + _this._options.id + '">';
        str += '    <div class="img-name">' + _this._options.name + '</div>';
        str += '    <div class="progress-box"><div class="progress-line" node-type="progress-line"></div></div>';
        str += '    <a class="img-cancel" href="javascript:;" node-type="click">x</a>';
        str += '</li>';
        return str;
    }

    module.exports = Item;
});

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Box = require('lib/ui/box/1.0.1/box');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');
    var Item = require('./item');

    //默认参数    
    var defaults = {
        limit: 0, //上传限制，当是0的时候就代表无限制多选
        selected: [] //选种的图片
    };

    /**
     * 图片上传插件
     * 
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Selected(options) {
        var _this = this;
        _this._options = options = $.extend({}, defaults, options);
        var selectedCount = _this._options.selected.length;
        if (_this._options.limit != 0 && selectedCount > _this._options.limit) {
            throw new Error('the selected count exceed the limit.');
        }
        _this.el = $(_this._make());
        //缓存关键内部元素
        _this._nodes = build.parse(_this.el, false);
        _this._items = [];
        _this._activeItem = null;
        for (var i = 0; i < selectedCount; i++) {
            var item = new Item(_this._options.selected[i]);
            _this.add(item);
        }
        //注册事件
        _this._onEvent();
    }

    //继承自定义事件
    Util.inherits(Selected, EventEmitter);

    /**
     * DOM grep api for select elements identified by attribute `node-type`,
     * e.g, `<div node-type="body"></div>`
     *
     * @return {jQuery} Returns a jquery DOM object.
     */
    Selected.prototype.$ = function(type, strictReturn) {
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

    Selected.prototype.updateSelectedTips = function() {
        var _this = this;
        _this._nodes['selected-count'].html(_this._items.length);
        if (_this._options.limit > 0) {
            _this._nodes['limit'].html('/' + _this._options.limit);
        }
    }

    Selected.prototype._onEvent = function() {
        var _this = this;
        _this._nodes['del'].on('click', function() {
            _this._activeItem.destroy();
            _this.remove(_this._activeItem);
        });
        _this._nodes['moveup'].on('click', function() {
            _this._order(_this._activeItem, 'moveup');
        });
        _this._nodes['movedown'].on('click', function() {
            _this._order(_this._activeItem, 'movedown');
        });
    }

    Selected.prototype._offEvent = function() {
        var _this = this;
        _this._nodes['del'].off('click');
        _this._nodes['moveup'].off('click');
        _this._nodes['movedown'].off('click');
    }

    /**
     * 排序
     * 
     * @param {[string]} orderby   [moveup：向上；movedown：向下]
     */
    Selected.prototype._order = function(item, orderby) {
        var _this = this,
            t,
            items = _this._items;
        if (!item) {
            return this;
        }
        for (var i = 0, len = items.length; i < len; i++) {
            if (item === items[i]) {
                t = items[i];
                if (orderby === 'moveup') {
                    if (i > 0) {
                        items[i] = items[i - 1];
                        items[i - 1] = t;
                        items[i - 1].el.insertBefore(items[i].el);
                        break;
                    }
                } else {
                    if (i < len - 1) {
                        items[i] = items[i + 1];
                        items[i + 1] = t;
                        items[i].el.insertBefore(items[i + 1].el);
                        break;
                    }
                }
            }
        }
        return this;
    }

    Selected.prototype.add = function(item) {
        if(item === undefined){
            throw new Error('the param [item] is require.');
        }
        var _this = this,
            items = _this._items;
        if (_this._options.limit != 0 && items.length >= _this._options.limit) {
            Box.error('超过最大数量（' + _this._options.limit + '）限制');
            return;
        }
        if (typeof item === 'string') {
            item = new Item(item);
        }
        if (!_this._isExistItem(item)) {
            _this._nodes['selected-images'].append(item.el);
            _this._items.push(item);
            _this._nodes['selected-images'].stop().animate({
                scrollTop: _this._items.length * 87
            }, 1000);
            item.on('del', function() {
                _this.remove(this);
            });
            item.on('activate', function() {
                for (var i = 0, len = _this._items.length; i < len; i++) {
                    if (this === _this._items[i]) {
                        _this._activeItem = this;
                    } else {
                        _this._items[i].deactivate();
                    }
                }
            });
            _this.updateSelectedTips();
        }
    }

    Selected.prototype._isExistItem = function(item) {
        var _this = this,
            items = _this._items;
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i] === item) {
                return true;
            }
        }
        return false;
    }

    Selected.prototype.remove = function(item) {
        var _this = this;
        for (var i = 0; i < _this._items.length; i++) {
            if (item === this._items[i]) {
                this._items.splice(i, 1);
                _this.updateSelectedTips();
                _this.emit('del');
                break;
            }
        }
        return this;
    }

    Selected.prototype.getUrls = function() {
        var _this = this,
            urls = [],
            items = _this._items;
        for (var i = 0, len = items.length; i < len; i++) {
            urls.push(items[i].url);
        }
        return urls;
    }

    Selected.prototype._make = function() {
        var _this = this,
            str = '';
        str += '<div>';
        str += '    <div class="selected-tips">';
        str += '        已选择图片(<span node-type="selected-count">0</span><span node-type="limit"></span>)';
        str += '    </div>';
        str += '    <div class="selected-op">';
        str += '        <a href="javascript:;" node-type="moveup">上移</a>';
        str += '        <a href="javascript:;" node-type="movedown">下移</a>';
        str += '        <a href="javascript:;" node-type="del">删除</a>';
        str += '    </div>';
        str += '    <ul class="selected-images" node-type="selected-images">';
        str += '    </ul>';
        str += '</div>';
        return str;
    }

    module.exports = Selected;
});

define(function(require, exports, module) {
    'use strict';

    // load base styles,
    require('css!./css/uploader.css');

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Box = require('lib/ui/box/1.0.1/box');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');

    var Tabs = {};
    Tabs.local = require('./tabs/local/local');
    Tabs.network = require('./tabs/network/network');
    Tabs.album = require('./tabs/album/album');
    var Selected = require('./selected/selected');


    /**
     * 图片上传插件
     * 
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Uploader(options) {
        var _this = this;
        //默认参数    
        var defaults = {
            tabs: [{
                type: 'local',
                options: {
                    uploadLimit: 0,
                    swf: '/uploadify.swf',
                    uploader: '/Upload/images/'
                }
            }, {
                type: 'network',
                options: {}
            }, {
                type: 'album',
                options: {}
            }],
            limit: 0, //上传限制，当是0的时候就代表无限制多选
            selected: [] //选种的图片
        };

        _this._options = options = $.extend({}, defaults, options);
        _this.el = $(_this._make());

        var box = Box.create({
            content: _this.el[0],
            className: 'ui-uploader-box',
            title: '图片选择'
        });
        _this.box = box;

        _this.box.once('shown', function() {
            _this.activateTab(_this.tabs[0]);
        });

        //缓存关键内部元素
        _this._nodes = build.parse(_this.el, false);
        _this.tabs = [];
        _this._initTabs();

        //添加选择区域
        var selected = new Selected({
            limit: _this._options.limit,
            selected: _this._options.selected
        });
        _this._nodes['selected'].append(selected.el);
        _this.selected = selected;

        //注册事件
        _this._onEvent();
    }

    //继承自定义事件
    Util.inherits(Uploader, EventEmitter);

    Uploader._id = 0;

    Uploader.prototype.activateTab = function(tab) {
        var _this = this,
            tabs = _this.tabs;
        for (var i = 0, len = tabs.length; i < len; i++) {
            if (tab === tabs[i]) {
                _this.tabs[i].activate();
            } else {
                _this.tabs[i].deactivate();
            }
        }
        return this;
    }

    Uploader.prototype._initTabs = function() {
        var _this = this,
            tab,
            tabs = _this._options.tabs;
        for (var i = 0, len = tabs.length; i < len; i++) {
            tab = new Tabs[tabs[i].type](tabs[i].options);
            _this.addTab(tab);
        }
    }

    Uploader.prototype.addTab = function(tab) {
        var _this = this,
            isExist = _this._isExistTab(tab);
        if (!isExist) {
            _this._nodes['tab-title'].append(tab.title);
            _this._nodes['tab-container'].append(tab.container);
            _this.tabs.push(tab);
        }
        return this;
    }

    Uploader.prototype._isExistTab = function(tab) {
        var _this = this,
            tabs = _this.tabs;
        for (var i = 0, len = tabs.length; i < len; i++) {
            if (tabs[i] === tab) {
                return true;
            }
        }
        return false;
    }

    /**
     * DOM grep api for select elements identified by attribute `node-type`,
     * e.g, `<div node-type="body"></div>`
     *
     * @return {jQuery} Returns a jquery DOM object.
     */
    Uploader.prototype.$ = function(type, strictReturn) {
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

    Uploader.prototype._onEvent = function() {
        var _this = this,
            tabs = _this.tabs;
        for (var i = 0, len = tabs.length; i < len; i++) {
            (function(i) {
                tabs[i].title.on('click', function() {
                    _this.activateTab(tabs[i]);
                });
                tabs[i].on('add', function(url) {
                    _this.selected.add(url);
                });
            })(i);
        }
        _this._nodes['btn-ok'].on('click', function() {
            _this.emit('ok', _this.selected.getUrls());
        });
        _this._nodes['btn-cancel'].on('click', function() {
            _this.hide();
        });
    }

    Uploader.prototype._offEvent = function() {
        var _this = this,
            tabs = _this.tabs;
        for (var i = 0, len = tabs.length; i < len; i++) {
            tabs[i].title.off('click');
        }
        _this._nodes['btn-ok'].off('click');
        _this._nodes['btn-cancel'].off('click');
    }

    Uploader.prototype.show = function() {
        var _this = this;
        _this.box.show();
        return this;
    }

    Uploader.prototype.hide = function() {
        var _this = this;
        _this.destroy();
        return this;
    }

    Uploader.prototype.destroy = function() {
        var _this = this;
        _this._offEvent();
        _this.box.hide();
        return this;
    }

    Uploader.prototype._make = function() {
        var str = '';
        str += '<div class="ui-uploader">';
        str += '    <div class="uploader-main clearfix">';
        str += '        <div class="uploader-tab">';
        str += '            <ul class="tab-title" node-type="tab-title">';
        str += '            </ul>';
        str += '            <div class="tab-container" node-type="tab-container">';
        str += '            </div>';
        str += '        </div>';
        str += '        <div class="selected-box" node-type="selected">';
        str += '        </div>';
        str += '    </div>';
        str += '    <div class="uploader-bottom">';
        str += '        <div class="tips" node-type="tips">copyright zhongzhihui.com</div>';
        str += '        <div class="btns">';
        str += '            <a class="btn btn-primary" node-type="btn-ok" href="javascript:;">确定</a>';
        str += '            <a class="btn btn-default" node-type="btn-cancel" href="javascript:;">取消</a>';
        str += '        </div>';
        str += '    </div>';
        str += '</div>';
        return str;
    }

    module.exports = Uploader;
});

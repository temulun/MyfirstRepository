define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Box = require('lib/ui/box/1.0.1/box');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');
    var Widget = require('../widget');

    /**
     * 图片上传插件
     * 
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Network(options) {
        var _this = this;
        //默认参数    
        var defaults = {
            type: 'network',
            title: '网络图片',
            pattern: /^((https?|ftp|rmtp|mms):)?\/\//
        };
        _this._options = options = $.extend({}, defaults, options);
        Widget.apply(_this, [_this._options]);
    }

    //继承自定义事件
    Util.inherits(Network, Widget);

    Network.prototype._init = function() {
        var _this = this;
        _this._onEvent();
    }

    Network.prototype._makeContainer = function() {
        var str = '';
        str += '<div class="network-container">';
        str += '    <div class="network-main">';
        str += '        <div class="network-tips">网络图片：</div>';
        str += '        <div class="network-input">';
        str += '            <input node-type="ipt-url" type="input" placeholder="请输入图片地址"> <a href="javascript:;" node-type="add">添加</a>';
        str += '        </div>';
        str += '    </div>';
        str += '</div>';
        return str;
    }

    Network.prototype._onEvent = function() {
        var _this = this;
        _this._nodes['add'].on('click', function() {
            var url = _this._nodes['ipt-url'].val();
            if (_this._options.pattern.test(url)) {
                _this.emit('add', url);
            } else {
                Box.error('网络图片的URL不符合要求，换一个试试！', _this._nodes['ipt-url'][0]);
            }
        });
    }

    Network.prototype._offEvent = function() {
        var _this = this;
        _this._nodes['add'].off('click');
    }

    module.exports = Network;
});

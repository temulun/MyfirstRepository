define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');
    var Widget = require('../widget');


    /**
     * 图片上传插件
     * 
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Album(options) {
        var _this = this;
        //默认参数    
        var defaults = {
            type: 'album',
            title: '相册选择'
        };
        _this._options = options = $.extend({}, defaults, options);
        Widget.apply(_this, [_this._options]);
    }

    //继承自定义事件
    Util.inherits(Album, Widget);


    Album.prototype._init = function() {
        return this;
    }

    Album.prototype.add = function(item) {}



    Album.prototype._onEvent = function() {
        var _this = this;
        // _this._nodes['add'].on('click');
    }

    Album.prototype._offEvent = function() {
        var _this = this;
        // _this._nodes['add'].off('click');
    }


    Album.prototype._makeContainer = function() {
        var _this = this,
            str = '';
        str += '<div class="album-container">';
        str += '    <div class="empty">暂未开放此功能,敬请期待！</div>';
        str += '    <ul node-type="img-list" class="img-list clearfix">';
        str += '    </ul>';
        str += '</div>';
        return str;
    }

    module.exports = Album;
});

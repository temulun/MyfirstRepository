define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    //自定义事件
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');

    /**
     * tab选项卡
     * @Author jiangchaoyi
     * @DateTime 2016-12-04T21:07:46+0800
     * @version 1.0.0
     * @param {selector} selector 选择器
     * @param {mix} options 见defautls说明
     * 
     * @event change 
     */
    function Tab(selector, options) {
        var _this = this;
        var defaults = {
            event: 'click' //jquery事件，click|mouseenter
        };

        _this.el = $(selector);
        _this.options = $.extend(true, {}, defaults, options);

        var builder = build.build(selector, false);
        _this.hd = builder.get('hd');
        _this.bd = builder.get('bd');
        _this.hdItems = builder.get('hdItem');
        _this.containers = builder.get('container');

        _this._initEvent();
        _this._init();
    }

    //继承自定义事件
    Util.inherits(Tab, EventEmitter);
    Tab.prototype._initEvent = function() {
        var _this = this;
        _this.hdItems.on(_this.options.event, function(e) {
            e.preventDefault();
            var $li = $(this);
            if (!$li.hasClass('current')) {
                _this.setCurrent($li.attr('data-target'));
            }
        });
    }

    Tab.prototype._init = function() {}

    //设置tab
    Tab.prototype.setCurrent = function(id) {
        var _this = this;
        if (id === undefined) {
            var $li = _this.hd.find('.current');
            if ($li.length == 0) {
                $li = this.hdItems.eq(0);
            }
            id = $li.attr('data-target');
        }
        _this.hdItems.removeClass('current');
        var curItem = _this.hd.find('[data-target=' + id + ']');
        curItem.addClass('current');
        _this.containers.removeClass('current');
        var curBody = _this.bd.find('[data-id=' + id + ']');
        curBody.addClass('current');
        _this.emit('change', {
            hd: curItem,
            body: curBody
        });
    }

    module.exports = Tab;
});

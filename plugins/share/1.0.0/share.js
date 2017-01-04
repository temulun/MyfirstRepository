define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    /**
     * 分享组件
     * @Author jiangchaoyi
     * @DateTime 2016-12-17T14:33:42+0800
     * @version 1.0.0
     * @param {jquery.selector} selector 
     * @param {mix} options 见default描述，参考：http://share.baidu.com/code/advance
     * 名称   ID
     */
    function Share(selector, options) {
        var _this = this;
        _this.el = $(selector);
        if (_this.el.length == 0) {
            throw new Error('the params [selector] is require.');
        }
        var defaults = {
            viewList: ['weixin', 'qzone', 'tsina'], //参考http://share.baidu.com/code/advance#toid
            class: 'ui-share', //自定义样式
            shareTxt: '分享', //分享按钮
            config: {
                common: {
                    bdStyle: 'none'
                        // bdText: '自定义分享内容',
                        // bdDesc: '自定义分享摘要',
                        // bdUrl: '自定义分享url地址',
                        // bdPic: '自定义分享图片'
                },
                slide: '',
                image: '',
                selectShare: ''
            }
        };
        _this.options = $.extend({}, defaults, options);
        _this._viewListTips = {
            'weixin': '分享到微信',
            'qzone': '分享到QQ空间',
            'tsina': '分享到新浪微博'
        };
        _this.el.html(_this._html());
        _this._init();
    }

    Share.prototype._init = function() {
        var _this = this;
        window._bd_share_config = _this.options.config;
        (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5);
    }

    Share.prototype._html = function() {
        var _this = this;
        var str = '<div class="bdsharebuttonbox ui-share"><span class="txt">' + _this.options.shareTxt + '</span>'; //data-tag="share_1"
        for (var i = 0, len = _this.options.viewList.length; i < len; i++) {
            str += '<a title="' + (_this._viewListTips[_this.options.viewList[i]] || '') + '" class="bds_' + _this.options.viewList[i] + ' iyoyo iyoyo-' + _this.options.viewList[i] + '" data-cmd="' + _this.options.viewList[i] + '" href="#"></a>';
        }
        str += '</div>';
        return str;
    }

    module.exports = Share;
});

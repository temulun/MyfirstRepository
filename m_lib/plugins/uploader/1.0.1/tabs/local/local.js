define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Box = require('lib/ui/box/1.0.1/box');
    var Util = require('lib/core/1.0.0/utils/util');
    var build = require('lib/core/1.0.0/dom/build');
    var Upload = require('lib/plugins/uploadify/3.2.2/uploadify');
    var Widget = require('../widget');
    var Item = require('./item');


    /**
     * 图片上传插件
     * 
     * @param {[json]} options   [参数，详细见默认参数defaults]
     */
    function Local(options) {
        var _this = this;
        //默认参数    
        var defaults = {
            type: 'local',
            title: '本地上传',
            fileTypeExts: '*.png;*.jpg;*.gif;*.bmp',
            fileTypeDesc: '图片文件，支持:.png,.jpg,.gif,.bmp',
            fileSizeLimit: '5120KB', // 单个图片大小限制,默认5M
            formData: { // 给 uploader 的参数
            },
            swf: 'http://s1.zhongzhihui.com/lib/plugins/uploader/1.0.1/uploadify.swf',
            uploader: '/api/upload.php',
            buttonText: '本地上传',
            buttonClass: '',
            height: 54,
            width: 'auto',
            debug: false,
            itemTemplate: null,
            showPreview: false,
            overrideEvents: ['onSelect'],
            onSelect: function(file) {
                _this.uploading(true);
                var item = new Item(file);
                _this.add(item);
            },
            onUploadProgress: function(file, fileBytesLoaded, fileTotalBytes) {
                _this.updateCount();
                var item = _this.getItem(file);
                if (item) {
                    item.progress(fileBytesLoaded, fileTotalBytes);
                }
            },
            onUploadSuccess: function(file, data, response) {
                var item = _this.getItem(file);
                if (item) {
                    _this.emit('add', data.data.url);
                    _this.remove(item);
                }
            },
            onQueueComplete: function() {
                _this.uploading(false);
            },
            onFallback: function() {
                Box.error('sorry,flash不兼容！');
            }
        };
        _this._options = options = $.extend({}, defaults, options);
        _this._items = [];
        Widget.apply(_this, [_this._options]);
    }


    //继承自定义事件
    Util.inherits(Local, Widget);


    Local.prototype._init = function() {
        var _this = this;
        // initialize upload
        _this.uploader = Upload.uploadify(_this._nodes['btn-upload'][0], _this._options);
        _this._initEvent();
        _this._onEvent();
    }

    Local.prototype._initEvent = function() {
        var _this = this;
        _this.uploader.on('initError', function(args) {
            Box.error('sorry,flash不兼容或没安装！');
        });
        //ARGS: [ file, errorCode, errorMsg, errorString ]
        _this.uploader.on('uploadError', function(args) {
            var msg = (args && args[1] && args[1].errorMsg) || null;
            msg && Box.error(msg);
        });
        _this.uploader.on('dialogClose', function(uploader) {
            var msg = (uploader && uploader.errorMsg) || null;
            if (/exceeds the size limit/.test(msg)) {
                msg = '单个上传图片不能超过' + _this._options.fileSizeLimit;
            }
            if (msg != 'Some files were not added to the queue:') {
                msg && Box.error(msg);
            }
        });
    }

    Local.prototype.add = function(item) {
        var _this = this,
            items = _this._items;
        if (!_this._isExistItem(item)) {
            _this._nodes['img-list'].append(item.el);
            _this._items.push(item);
            _this._nodes['img-list'].stop().animate({
                scrollTop: _this._items.length / 4 * 87
            }, 1000);
            item.on('del', function() {
                _this.remove(item);
            });
        }
    }

    Local.prototype._isExistItem = function(item) {
        var _this = this,
            items = _this._items;
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i] === item) {
                return true;
            }
        }
        return false;
    }

    Local.prototype.getItem = function(file) {
        var _this = this;
        for (var i = 0; i < _this._items.length; i++) {
            if (file.id === _this._items[i].file.id) {
                return _this._items[i];
            }
        }
        return null;
    }

    Local.prototype.remove = function(item) {
        var _this = this;
        for (var i = 0; i < _this._items.length; i++) {
            if (item === this._items[i]) {
                _this.uploader.cancel(item._options.id);
                item.destroy();
                this._items.splice(i, 1);
                break;
            }
        }
        return this;
    }

    Local.prototype.uploading = function(isUploading) {
        var _this = this;
        if (isUploading) {
            _this.container.addClass('local-container-uploading');
        } else {
            _this.container.removeClass('local-container-uploading');
        }
    }

    Local.prototype._onEvent = function() {
        var _this = this;
        _this._nodes['cancel'].on('click', function() {
            for (var i = 0; i < _this._items.length; i++) {
                _this.remove(_this._items[i]);
            }
            _this.uploading(false);
        });
    }

    Local.prototype._offEvent = function() {
        var _this = this;
        _this._nodes['cancel'].off('click');
    }

    Local.prototype.updateCount = function() {
        var _this = this;
        _this._nodes['count'].html(_this._items.length);
    }

    Local.prototype._makeContainer = function() {
        var _this = this,
            str = '';
        str += '<div class="local-container">';
        str += '    <div class="local-init" node-type="local-init">';
        str += '        <div class="local-tips" node-type="local-tips">按住Ctrl可多选图片</div>';
        str += '        <div class="btn btn-primary btn-lg ' + _this._options.buttonClass + '"><button node-type="btn-upload"><span class="glyphicon glyphicon-upload"></span>选择上传</button></div>';
        str += '    </div>';
        str += '    <div class="local-uploading" node-type="local-uploading">';
        str += '        <div class="local-op clearfix">';
        str += '            <a class="btn btn-primary btn-xs" node-type="cancel" href="javascript:;"><span class="glyphicon glyphicon-remove"></span>取消上传</a><div><b node-type="count">0</b>张图片等待上传</div>';
        str += '        </div>';
        str += '        <ul class="img-list clearfix" node-type="img-list">';
        str += '        </ul>';
        str += '    </div>';
        str += '</div>';
        return str;
    }

    module.exports = Local;
});

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Pagination = require('lib/ui/pagination/1.0.1/pagination');
    var IO = require('lib/core/1.0.0/io/request');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');

    /**
     * 分页控件
     * @Author jiangchaoyi
     * @DateTime 2016-12-04T15:17:42+0800
     * @version 1.0.0
     * 
     * @param {selector} el 选择器,分页容器
     * @param {mix} options 详细见defaults注释
     * 
     * @event ajaxStart ajax请求开始
     * @event ajaxSuccess ajax请求成功
     * @event ajaxError ajax请求失败
     * @event change 分页改变
     */
    function Pager(el, options) {
        var _this = this;
        if (el === undefined) {
            throw new Error('the param [el] is required.');
        }
        _this.el = el;
        var defaults = {
            url: null,
            data: null,
            ajaxType: 'get', //支持jsonp|get|post
            alias: {
                currentPage: 'pageNo',
                pageSize: 'pageSize'
            },
            options: {
                totalCount: 1,
                pageSize: 20,
                currentPage: 1, // start with 1
                hrefTextPrefix: '#p-',
                hrefTextSuffix: '',
                prevText: '上一页',
                nextText: '下一页',
                ellipseText: '&hellip;',
                className: '',
                labelMap: [],
                displayInfo: true, // Show the extra paging info with quick pagination, defaults to false.
                selectOnClick: true,
                async: false, // (Optional) a function that returns a deferred's promise object for async paging.
                onPage: function(pageNum, e) {
                    // Callback triggered when a page is clicked
                    // Page number is given as an optional parameter
                },
                onInit: function() {
                    // Callback triggered immediately after initialization
                }
            }
        };
        _this.options = $.extend(true, {}, defaults, options);
        _this._init();
    }

    //继承自定义事件
    Util.inherits(Pager, EventEmitter);

    Pager.prototype._init = function() {
        var _this = this;
        var options = _this.options;
        if (options.url) {
            // Implements a async paging api method.
            options.options.async = function(pageOptions) {
                var params = {};
                params[options.alias.currentPage] = pageOptions.currentPage;
                params[options.alias.pageSize] = pageOptions.pageSize;
                _this.emit('ajaxStart');
                var deferred = $.Deferred();
                // simulating async paging
                IO[options.ajaxType](options.url, $.extend({}, params, options.data), function(data) {
                    _this.emit('ajaxSuccess', data, function(totalCount) {
                        if (totalCount > 0) {
                            _this.pagination.setTotalCount(totalCount);
                            _this.pagination.show();
                        } else {
                            _this.pagination.setTotalCount(1);
                            _this.pagination.hide();
                        }
                    });
                    deferred.resolve(data);
                }, function(data) {
                    _this.pagination.hide();
                    _this.emit('ajaxError', data);
                    deferred.reject(data);
                });
                return deferred.promise();
            }
        }
        options.options.onPage = function(pageNum, e) {
            _this.emit('change', pageNum, e);
        }
        _this.el.hide();
        _this.pagination = new Pagination(_this.el, options.options);
        _this.pagination.selectPage(options.options.currentPage);
        _this.el.show();
    }

    Pager.prototype.destroy = function() {
        var _this = this;
        _this.pagination.destroy();
    }

    module.exports = Pager;
});

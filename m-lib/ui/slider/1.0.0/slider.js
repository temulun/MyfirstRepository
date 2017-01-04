/**
 * 图片懒加载组建，
 */
/**
 * @deprecated 滚屏图片懒加载
 * @author djune 2013-10-15
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var imageUtil = require('../../../gallery/utils/1.0.0/image');

    $.fn.slider = function(options) {
        var defautls = {
            attr: 'data-img', // 实际的地址
            duration: 5000, // 每个多久轮播一次
            addBtn: false,
            callback: function() { // 每次轮播完成后的回调
            }
        };
        var opts = $.extend({}, defautls, options || {});

        $(this).each(function() {
            var eslider = $(this);
            addslider(eslider);
        });

        function addslider(eslider) {
            var esliderItems = eslider.find('.slider-list li');
            if (esliderItems && esliderItems.length == 0) {
                return;
            }
            var eNums = eslider.find('.slider-num a');
            var isStop = false,
                oldIndex = 0,
                curIndex = 0,
                attr = opts.attr,
                itemCount = eNums.length;
            if (itemCount < 2) {
                eNums.hide();
            }

            // 点击按钮切换效果
            eNums.mouseenter(function() {
                curIndex = $(this).index();
                setCurrent();
            });
            if (opts.addBtn) {
                addBtn(eslider);
            }


            // 设置当前切换的效果
            function setCurrent() {
                eNums.eq(curIndex).addClass('hover').siblings("a").removeClass("hover");
                var curItem = esliderItems.eq(curIndex);
                var oldItem = esliderItems.eq(oldIndex);
                var dataImg = curItem.attr(attr);
                curItem.show();
                if (dataImg) {
                    imageUtil.load(dataImg, function() {
                        //设置图片
                        curItem.css({
                            'background-image': 'url(' + dataImg + ')'
                        });
                        //去除图片地址，防止反复加载
                        curItem.removeAttr(attr);
                    });
                }
                // 大图切换
                if (oldIndex != curIndex) {
                    oldItem.stop().animate({
                        opacity: 0,
                        'z-index': 1
                    }, 1000);
                }
                curItem.stop().animate({
                    opacity: 1,
                    'z-index': 9
                }, 1000);
                //交换位置
                oldIndex = curIndex;
            }

            // 自动轮播判断
            function autoslider() {
                if (opts.duration > 0) {
                    eslider.mouseenter(function() {
                        isStop = true;
                    });
                    eslider.mouseleave(function() {
                        isStop = false;
                    });
                    setInterval(function() {
                        if (!isStop) {
                            toggleNext(true);
                        }
                    }, opts.duration);
                }
            }

            function toggleNext(flag) {
                if (flag) {
                    curIndex++;
                    if (curIndex >= itemCount) {
                        curIndex = 0;
                    }
                } else {
                    curIndex--;
                    if (curIndex < 0) {
                        curIndex = itemCount - 1;
                    }
                }
                setCurrent();
            }

            function addBtn(eslider) {
                //添加按钮容器
                var $btns = $('<a class="arrow-l jImgLeft" href="javascript:;"><em></em><i class="icon iconfont"></i></a><a class="arrow-r jImgRight" href="javascript:;"><em></em><i class="icon iconfont"></i></a>').appendTo(eslider);
                var leftBtn = $btns.filter(".jImgLeft").hide();
                var rightBtn = $btns.filter(".jImgRight").hide();
                //绑定事件
                leftBtn.on("click", function() {
                    toggleNext(false);
                });
                rightBtn.on("click", function() {
                    toggleNext(true);
                });
                //绑定左右轮播按钮的显示和隐藏事件
                eslider.mouseenter(function() {
                    leftBtn.show();
                    rightBtn.show();
                });
                eslider.mouseleave(function() {
                    leftBtn.hide();
                    rightBtn.hide();
                });
            }


            function loadingStatus() {
                eslider.find(".slider-list").css({
                    background: 'none'
                });
            }

            setCurrent();
            loadingStatus();
            autoslider();
        }
    };
});

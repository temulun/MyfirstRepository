define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Uploader = require('./uploader');

    $.fn.Uploader = Uploader;
});

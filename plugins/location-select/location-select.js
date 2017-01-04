/**
 * @file location-select.js
 * @synopsis  四级地址选择
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2015-12-15
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Io = require('lib/core/1.0.0/io/request');
    var basePath = $("base").attr('href');
    console.log(basePath);
    alert(1);
    $.extend({
        // 省市区三级联动
        loadAreaSelect : function(elementName,options) {
            var defaults = {
                url : ($PAGE_DATA && $PAGE_DATA['']) || '',
                data : {}
            }
            var _options = $.extend(true,{},defaults,options);
            var element = $("#" + elementName);
            var province = element.find("select").eq(0);
            var provinceName = province.attr("name");
            var provinceMap = loadArea("/commons/queryRegion");
            province.empty();
            province.append("<option value='0'>请选择省</option>");

            if (provinceMap != null) {
                $.each(provinceMap, function(i, n) {
                    province.append("<option value='" + n.id + "'>" + n.name + "</option>");
                });
                var provinceValue = $("input[name='" + provinceName + "_hide']").val();
                if (typeof (provinceValue) != "undefined" && provinceValue != "" && provinceValue != null && provinceValue != "0") {
                    province.val(provinceValue);
                    var city = element.find("select").eq(1);
                    var cityName = city.attr("name");
                    city.empty();
                    city.append("<option value='0'>请选择市</option>");
                    var cityMap = loadArea(basePath + "/commons/queryRegion?parentId=" + provinceValue);
                    if (cityMap != 0) {
                        $.each(cityMap, function(i, n) {
                            city.append("<option value='" + n.id + "'>" + n.name + "</option>");
                        });
                        var cityValue = $("input[name='" + cityName + "_hide']").val();
                        if (cityValue != "" && typeof (cityValue) != "undefined" && cityValue != null && cityValue != "0") {
                            city.val(cityValue);
                            var county = element.find("select").eq(2);
                            var countyName = county.attr("name");
                            var countyValue = $("input[name='" + countyName + "_hide']").val();
                            var countyMap = loadArea(basePath + "/commons/queryRegion?parentId=" + cityValue);
                            county.empty();
                            county.append("<option value='0'>请选择县/区</option>");
                            if (countyMap != null) {
                                $.each(countyMap, function(i, n) {
                                    county.append("<option value='" + n.id + "'>" + n.name + "</option>");
                                });

                                if (countyValue != "" && typeof (countyValue) != "undefined" && countyValue != null && countyValue != "0") {
                                    county.val(countyValue);
                                }
                            }

                        }
                    }
                }
            }
            province.change(function() {
                element.find("select").each(function(i) {
                    switch (i) {
                        case 1:
                            $(this).empty();
                            $(this).append("<option value='0'>请选择市</option>");
                            break;
                        case 2:
                            $(this).empty();
                            $(this).append("<option value='0'>请选择区/县</option>");
                            break;
                    }
                });
                var province_change = $(this).val();
                var cityMap = loadArea(basePath + "/commons/queryRegion?parentId=" + province_change);
                if (cityMap != 0) {
                    $.each(cityMap, function(i, n) {
                        city.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            });

            var province_val = $("#" + province.attr("name") + "_hid").val();
            var city = element.find("select").eq(1);
            if (province_val != null && typeof (province_val) != "undefined" && province_val != '') {
                province.val(province_val);
                var city_change_Map = loadArea(basePath + "/commons/queryRegion?parentId=" + province_val);
                city.empty();
                city.append("<option value='0'>请选择市</option>");
                if (city_change_Map != 0) {
                    $.each(city_change_Map, function(i, n) {
                        city.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            }
            city.change(function() {
                var city_change = $(this).val();
                var county_change_Map = loadArea(basePath + "/commons/queryRegion?parentId=" + city_change);
                county.empty();
                county.append("<option value='0'>请选择县/区</option>");
                if (county_change_Map != null) {
                    $.each(county_change_Map, function(i, n) {
                        county.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            });

            var city_val = $("#" + city.attr("name") + "_hid").val();
            var county = element.find("select").eq(2);
            if (city_val != null && typeof (city_val) != "undefined" && city_val != '') {
                city.val(city_val);
                var countyMap = loadArea("/region/queryRegion?parentId=" + city_val);
                county.empty();
                county.append("<option value='0'>请选择县/区</option>");
                if (countyMap != null) {
                    $.each(countyMap, function(i, n) {
                        county.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            }

            var county_val = $("#" + county.attr("name") + "_hid").val();
            if (county_val != null && typeof (county_val) != "undefined" && county_val != '') {
                county.val(county_val);
            }
        }
    });

    function loadArea(url) {
        console.log(1);
        var areaMap;
        //$.ajax({
        //    url : url,
        //    dataType : 'json',
        //    type : 'POST',
        //    async : false,
        //    success : function(data) {
        //        areaMap = data.regionInfoList;
        //    }
        //});
        Io.post(url,{},
            function(data){
                areaMap = data.regionInfoList;
            },function(){}
        );
        return areaMap;
    }

});

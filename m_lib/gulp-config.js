var path = require('path');

var PROJECT_NAME = 'lib';
var STATIC_SERVER = 's1.zhongzhihui.com';
var CDN = '//' + STATIC_SERVER + '/' + PROJECT_NAME + '/';
var PATH_SOURCE = '';
var PATH_DIST = 'dist';

var CONFIG = {
    cdn: CDN,
    dist: './' + PATH_DIST,
    images: {
        src: ['./**/*.{bpm,jpg,jpeg,png,gif}', '!./node_modules/**/*'],
        dest: './' + PATH_DIST + '/'
    },
    fonts: {
        src: ['./**/*.{eot,svg,ttf,woff}', '!./node_modules/**/*'],
        dest: './' + PATH_DIST + '/'
    },
    md: {
        src: ['./**/*.md', '!./node_modules/**/*'],
        dest: './' + PATH_DIST + '/'
    },
    sass: {
        src: ['./**/*.{sass,scss}', '!./node_modules/**/*'],
        dest: './' + PATH_DIST + '/'
    },
    css: {
        src: ['./**/*.css', '!./node_modules/**/*'],
        dest: './' + PATH_DIST + '/'
    },
    js: {
        src: ['./**/*.js', '!./node_modules/**/*', '!./gulpfile.js', '!./gulp-config.js'],
        dest: './' + PATH_DIST + '/'
    },
    px2rem: {
        isExecute: true,
        options: {
            remUnit: 46.875
        }
    },
    //开发和生成环境通用,生产环境会用gulp-clean-css瘦身压缩
    sassOptions: {
        outputStyle: 'nested' // Can be nested (default), compact, compressed, or expanded
    },
    //autoprefixer 配置，自动添加需要兼容浏览器前缀
    autoprefixer: {
        browsers: [
            'last 10 versions',
            'safari 5',
            'ie 8',
            'ie 9',
            'opera 12.1',
            'ios 6',
            'android 4'
        ],
        cascade: false
    }
};
module.exports = CONFIG;

//是否发布发布环境
var gIsRelease = false;
var CONFIG = require('./gulp-config');
//A ternary gulp plugin: conditionally control the flow of vinyl objects.
var gulpif = require('gulp-if');
//导入配置
//删除
var del = require('del');
var path = require('path');
//gulp插件
var gulp = require("gulp");
//sass编译，注意：只支持sass，不支持compass
var sass = require("gulp-sass");
//样式瘦身
var cleanCss = require("gulp-clean-css");
//postcss
var postcss = require('gulp-postcss');
//PostCSS插件 CSSNext 用下一代CSS书写方式兼容现在浏览器
// var cssnext = require('cssnext');
//PostCSS插件 Autoprefixer 为CSS补全浏览器前缀
var autoprefixer = require('autoprefixer');
//PostCSS插件 CSS Grace 让CSS兼容旧版IE 
var cssgrace = require('cssgrace');
//PostCSS插件 处理样式中的图片，支持内联图片base64，svg图片，支持获取图片高度宽度，cachebuster=true 没测试通过
var assets = require('postcss-assets');
//PostCSS插件 给图片添加后缀
var urlrev = require('postcss-urlrev');
//PostCSS插件 支持图片精灵
var postcssSprites = require('postcss-sprites');
//This plugin does not support streaming. If you have files from a streaming source, such as browserify, you should use gulp-buffer before gulp-rev in your pipeline:
var buffer = require('gulp-buffer');

var px2rem = require('postcss-px2rem');

var uglify = require('gulp-uglify');

minifycss = require('gulp-minify-css');
//sass合并
gulp.task("sass", function() {
    var postcssProcessors = [
        assets,
        urlrev,
        autoprefixer(CONFIG.autoprefixer),
        // postcssSprites({
        //     stylesheetPath: './dist/css',
        //     spritePath: './dist/images' //雪碧图合并后存放地址
        // }),
        cssgrace
    ];
    // if (CONFIG.px2rem.isExecute) {
    //     postcssProcessors.push(px2rem(CONFIG.px2rem.options));
    // }
    return gulp.src(CONFIG.sass.src)
        .pipe(sass(CONFIG.sassOptions).on('error', sass.logError))
        .pipe(gulpif(gIsRelease, cleanCss()))
        .pipe(postcss(postcssProcessors))
        .pipe(gulp.dest(CONFIG.sass.dest))
        .pipe(buffer())
        .pipe(gulp.dest(CONFIG.sass.dest));
});

//./dist目录
gulp.task('clear-dist', function() {
    return del([CONFIG.dist]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

//copy-fonts
gulp.task('copy-fonts', function() {
    return gulp.src(CONFIG.fonts.src)
        .pipe(gulp.dest(CONFIG.fonts.dest));
});

//copy-markdown
gulp.task('copy-md', function() {
    return gulp.src(CONFIG.md.src)
        .pipe(gulp.dest(CONFIG.md.dest));
});

//copy-images
gulp.task('copy-images', function() {
    return gulp.src(CONFIG.images.src)
        .pipe(gulp.dest(CONFIG.images.dest))
});

//js 压缩
gulp.task('scripts', function() {
    return gulp.src(CONFIG.js.src)
        .pipe(uglify()) //压缩
        .pipe(gulp.dest(CONFIG.js.dest)); //输出
});

//css 压缩
gulp.task('css', function() {
    return gulp.src(CONFIG.css.src)
        .pipe(minifycss()) //压缩
        .pipe(gulp.dest(CONFIG.css.dest)) //输出
});

gulp.task('watch', function() {
    gulp.watch(CONFIG.sass.src, gulp.series('sass'));
    gulp.watch(CONFIG.css.src, gulp.series('css'));
    gulp.watch(CONFIG.fonts.src, gulp.series('copy-fonts'));
    gulp.watch(CONFIG.md.src, gulp.series('copy-md'));
    gulp.watch(CONFIG.images.src, gulp.series('copy-images'));
    gulp.watch(CONFIG.js.src, gulp.series('scripts'));
});
// 
gulp.task('release', function() {
    gIsRelease = true;
    return gulp.src('___/*___', function() {});
});

//生成环境：1、删除dist目录 2、编译sass，并把编译后的结果发送到dist目录；3、合并js请求
gulp.task('release', gulp.series('release', 'clear-dist', gulp.parallel('scripts', gulp.series('css', 'sass'), 'copy-fonts', 'copy-md', 'copy-images'), 'watch'));

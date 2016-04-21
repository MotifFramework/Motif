var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
 
gulp.task('less', function() {
    gulp.src('./less/global.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        // .pipe(cleanCSS({debug: true}, function(details) {
        //     console.log(details.name + ': ' + details.stats.originalSize);
        //     console.log(details.name + ': ' + details.stats.minifiedSize);
        // }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./gulpbuild/css'));
});
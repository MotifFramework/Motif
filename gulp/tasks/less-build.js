var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('less', ['less-motif','less-motif-fixed']);

gulp.task('less-motif', function() {
    gulp.src('./less/global.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./gulpbuild/css'));
});

gulp.task('less-motif-fixed', function() {
    gulp.src('./less/global-fixed.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./gulpbuild/css'));
});
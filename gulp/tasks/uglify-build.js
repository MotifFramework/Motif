var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var scripts = {
    helpers: [
        "./js/vendor/modernizr.js",
        "./js/vendor/viewport.js",
        "./js/utils/motif.utils.load-script.js"
    ],
    main: [
        "./js/vendor/jquery-2.1.4.js",
        "./js/vendor/requestAnimFrame.js",
        "./js/utils/motif.utils.plugins.js",
        "./js/forms/motif.gauntlet.js",
        "./js/forms/motif.ajax-submission.js",
        "./js/ui/motif.reveal.js",
        "./js/ui/motif.tabs.js",
        "./js/vendor/holder.js",
        "./js/actions.js"
    ]
};

gulp.task('uglify', ['uglify-motif','uglify-motif-helpers']);

gulp.task('uglify-motif', function() {
    return gulp.src(scripts.main)
        .pipe(sourcemaps.init())
        .pipe(concat('motif.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./gulpbuild/js'));
});

gulp.task('uglify-motif-helpers', function(){
    return gulp.src(scripts.helpers)
        .pipe(sourcemaps.init())
        .pipe(concat('helpers.motif.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./gulpbuild/js'));
});
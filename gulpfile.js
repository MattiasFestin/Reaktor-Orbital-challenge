var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

gulp.task('clean', function () {
    return gulp
        .src('./build/**/*')
        .pipe(clean());
});

gulp.task('compile', ['clean'], function() {
    return gulp
        .src('./src/**/*.ts')
        .pipe(ts({
		}))
		.pipe(gulp.dest('./build/'));
});

gulp.task('browserify', ['compile'], function() {
    return gulp
        .src('./build/main.js')
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
		}))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./build')); 
});

gulp.task('clean-build', function() {
    return gulp
        .src([
            './build/*.js',
            '!./build/app.js'
        ])
        .pipe(clean());
});

gulp.task('minify', function () {
    return gulp.src('build/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./build'));
})

gulp.task('build', function() {
    runSequence('browserify', 'clean-build', 'minify');
});
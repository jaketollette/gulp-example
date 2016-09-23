'use strict';

var gulp    = require('gulp'),
      concat = require('gulp-concat'),
      uglify  = require('gulp-uglify'),
 cleanCSS = require('gulp-clean-css'),
     rename = require('gulp-rename'),
          sass = require('gulp-sass'),
        maps = require('gulp-sourcemaps'),
            del = require('del');

gulp.task("concatScripts", function(){
    return gulp.src([
        'js/src/libs/jquery-3.1.0.js',
        'js/src/general.js'])
        .pipe(maps.init())
        .pipe(concat("app.js"))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('js'))
});

gulp.task('minifyScripts', ['concatScripts'], function(){
    return gulp.src("js/app.js")
        .pipe(uglify())
        // .pipe(rename('app.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function(){
    return gulp.src('scss/application.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('css'));
});
gulp.task('concatCss', ['compileSass'], function(){
    return gulp.src([
        'css/src/animate.css',
        'css/application.css'])
        .pipe(concat("application.css"))
        .pipe(gulp.dest('css'))
});
gulp.task('minifyCSS', ['concatCss'], function(){
    return gulp.src('css/*.css')
                .pipe(cleanCSS({ compatibility: 'ie9' }))
                .pipe(gulp.dest('css'));
});

gulp.task("watchFiles", function(){
    gulp.watch('scss/**/*.scss', ['concatCss']);
    gulp.watch('js/src/*.js', ['concatScripts'])
});

gulp.task('clean', function(){
    del(['dist', 'css/application.css*', 'js/app*.js*']);
});

gulp.task("build", ["minifyScripts", "minifyCSS"], function(){
    return  gulp.src(['css/application.css', 'js/app.min.js', 'index.html',
                                'img/**', 'fonts/**'], { base: './' })
                    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);

gulp.task("default", ["clean"], function(){
    gulp.start('build');
});

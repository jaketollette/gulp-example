'use strict';

var gulp    = require('gulp'),
      concat = require('gulp-concat'),
      uglify  = require('gulp-uglify'),
 cleanCSS = require('gulp-clean-css'),
     rename = require('gulp-rename'),
          sass = require('gulp-sass'),
        maps = require('gulp-sourcemaps'),
            del = require('del');

// Concatenate All JS (Order Matters!)
gulp.task("concatScripts", function(){
    return gulp.src([
        'includes/js/src/libs/jquery-3.1.0.js',
        'includes/js/src/general.js'])
        .pipe(maps.init())
        .pipe(concat("app.js"))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('includes/js'))
});

// Minify JS. This will Concat them first
gulp.task('minifyScripts', ['concatScripts'], function(){
    return gulp.src("includes/js/app.js")
        .pipe(uglify())
        // .pipe(rename('app.min.js'))
        .pipe(gulp.dest('includes/js'));
});

// Compile SASS
gulp.task('compileSass', function(){
    return gulp.src('includes/scss/application.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('includes/css'));
});

// Concatenate all CSS. (Order Matters)
// Compiles SASS first and then concats other css from libraries
gulp.task('concatCss', ['compileSass'], function(){
    return gulp.src([
        'includes/css/src/libs/animate.css',
        'includes/css/application.css'])
        .pipe(concat("application.css"))
        .pipe(gulp.dest('includes/css'))
});
gulp.task('minifyCSS', ['concatCss'], function(){
    return gulp.src('includes/css/*.css')
                .pipe(cleanCSS({ compatibility: 'ie9' }))
                .pipe(gulp.dest('includes/css'));
});

gulp.task("watchFiles", function(){
    gulp.watch('includes/scss/**/*.scss', ['concatCss']);
    gulp.watch('includes/js/src/*.js', ['concatScripts'])
});

gulp.task('clean', function(){
    del(['dist', 'includes/css/*.css*', 'includes/js/*.js*']);
});

gulp.task("build", ["minifyScripts", "minifyCSS"], function(){
    return  gulp.src(['includes/**', '*.+(asp|html|txt|config)'], { base: './' })
    // return  gulp.src(['includes/css/*.css*', 'includes/js/*.js*',
    //                             'includes/images/**', 'includes/fonts/**',
    //                             'includes/*.+(asp)', '*.+(asp|html|txt|config)'], { base: './' })
                    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);

gulp.task("default", ["clean"], function(){
    gulp.start('build');
});

//-----------------------------------------------------
// SWANIX UI
// by Sebastian Serna
// 2015 - 2018
//-----------------------------------------------------

'use strict';

var gulp = require('gulp' ),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    postcss = require('gulp-postcss'),
    postcssPrefixer = require('postcss-prefixer'),
    nunjucks = require('gulp-nunjucks');


//-----------------------------------------------------
// Global variables
//-----------------------------------------------------


// Sass to CSS
var inputSass = 'src/**/*.scss';
var outputSass = 'dist/';
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};
var outputDocs = 'docs/styles/';

// Nunjucks to HTML
var inputHtml = 'docs/templates/*.njk';
var inputAllHtml = 'docs/templates/**/*.njk';
var outputHtml = 'docs/';

//-----------------------------------------------------
// Sass compiler task
//-----------------------------------------------------

gulp.task ('sass' , function() {
    return gulp
      .src(inputSass)
      .pipe(plumber())
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(gulp.dest(outputSass))
      .pipe(gulp.dest(outputDocs))
      .pipe(cleanCSS())
      .pipe(rename('swanix.min.css'))
      .pipe(gulp.dest(outputSass))
      .pipe(gulp.dest(outputDocs))
      .pipe(browserSync.stream());
});

//-----------------------------------------------------
// PostCSS compiler task (CSS namespace)
//-----------------------------------------------------

gulp.task('css-ns', function () {
  var plugins = [
      postcssPrefixer({ 
          prefix: 'sw-',
          ignore: ([ /is-/, '.small', '.medium', '.large' ])      
        })
       ];
  return gulp.src('./dist/*.css')
      .pipe(postcss(plugins))
      .pipe(gulp.dest('./dist/ns/'));
});

//-----------------------------------------------------
// HTML compiler task
//-----------------------------------------------------

gulp.task('html', function () {
  gulp
    .src(inputHtml)
    .pipe(nunjucks.compile())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(outputHtml));
});

//-----------------------------------------------------
// BrowserSync task (server)
//-----------------------------------------------------

gulp.task ('browser-sync' , function() {
    browserSync.init({
        server: {
          baseDir: 'docs',
          index: 'index.html',
          serveStaticOptions: {
            extensions: ['html']
          }
        }
    });
    gulp.watch([
      'docs/**/*.html',
      'dist/*.css'
      ]).on("change", browserSync.reload);
});

//-----------------------------------------------------
// Watch tasks
//-----------------------------------------------------

gulp.task('watch', ['html', 'sass', 'css-ns', 'browser-sync'] , function() {
      gulp.watch(inputSass, ['sass', 'css-ns']);
      gulp.watch(inputAllHtml, ['html']);
});

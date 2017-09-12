var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var bourbon = require('bourbon').includePaths;
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var flexFixes = require('postcss-flexbugs-fixes');


// Static Server + watching scss/pug files
gulp.task('serve', ['build', 'sass'], function() {

  browserSync.init({
                     server: './dist',
                   });

  gulp.watch(['src/**/*.pug'], ['pug']);
  gulp.watch('src/styles/**/*.scss', ['sass']);
});

// var MY_LOCALS = { errLogToConsole: true };
//
// // make sure these symbols compile down correctly
// pug.filters.htmlFilter = function(block) {
//   return block
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/#/g, '&#35;')
//     .replace(/\\/g, '\\\\')
//     .replace(/\n/g, '\\n');
// };

gulp.task('sass', function() {
  return gulp.src('./src/styles/**/*.scss')
             .pipe(sass({
                          sourcemaps: false,
                          includePaths: [bourbon],
                        }).on('error', sass.logError))
             .pipe(postcss([ autoprefixer(), flexFixes() ]))
             .pipe(gulp.dest('./dist'))
             .pipe(browserSync.stream());
});

gulp.task('pug', function buildHTML () {
  return gulp.src('./src/*.pug')
             .pipe(pug({
                         pretty: true,
                       })
                     .on('error', function(err) {
                       console.log('Pug error:', err);
                       this.emit('end');
                     }))
             .pipe(gulp.dest('./dist'))
             .pipe(browserSync.stream());
});

gulp.task('watch', ['build', 'sass'], function() {
  gulp.watch(['src/**/*.pug'], ['pug']);
  gulp.watch('src/styles/**/*.scss', ['sass']);

});

gulp.task('build', ['sass', 'pug']);
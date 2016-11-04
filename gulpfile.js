var gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		minifycss    = require('gulp-minify-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		concatCss    = require('gulp-concat-css'),
		uglify       = require('gulp-uglifyjs'),
		imagemin     = require('gulp-imagemin');

gulp.task('browser-sync', [
							'styles',							
							'compress',
							'scriptsConcat',
							'scriptsCommon',
							'vendorCss',
							'htmldist',
							'fontsdist',
							], function() {
		browserSync.init({
				server: {
						baseDir: "./dist"
				},
				notify: false
		});
});

gulp.task('styles', function () {
	gulp.src('app/sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(minifycss(''))
	.pipe(gulp.dest('dist/css'));
});

gulp.task('compress', function() {
  return gulp.src('app/img/*')
  .pipe(imagemin(''))
  .pipe(gulp.dest('dist/img/'));
});

gulp.task('scriptsConcat', function() {
  return gulp.src('app/libs/**/*.js')
    .pipe(concat('plagin.min.js'))
    .pipe(uglify(''))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scriptsCommon', function() {
  return gulp.src('app/js/*.js')
    .pipe(concat('common.min.js'))
    .pipe(uglify(''))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('vendorCss', function () {
  return gulp.src('app/libs/**/*.css')
    .pipe(concatCss("vendor.css"))   
    .pipe(minifycss('')) 
    .pipe(rename("vendor.min.css"))
    .pipe(gulp.dest('dist/css'));
}); 

gulp.task('htmldist', function() {
  	return gulp.src('app/*.html')   
    .pipe(gulp.dest('./dist/'));
});

gulp.task('fontsdist', function() {
  	return gulp.src('app/fonts/*/**')   
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('watch', function () {
	gulp.watch('app/sass/*.sass', ['styles']).on('change', browserSync.reload);
	gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js',['scriptsCommon']).on("change", browserSync.reload);
	gulp.watch('app/*.html', ['htmldist']).on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);

var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var imagemin = require('gulp-imagemin');
var order = require("gulp-order");
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

var options = {
	src: "src",
	dest: "dist"
};

gulp.task('html', function() {
	return gulp.src(options.src + '/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(options.dest));
});

gulp.task('sass', function() {
	return gulp.src(options.src + '/sass/*.scss')
					.pipe(sass().on('error', sass.logError))
					.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        	}))
					.pipe(gulp.dest(options.src + '/css'))
					.pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', ['sass'], function() {
	return gulp.src([options.src + '/css/*.css',
	 'bower_components/normalize-css/normalize.css'])				 
				 .pipe(order([
					'normalize.css',
					'*'
				]))
				 .pipe(concatCss("style.css"))	
				 .pipe(cssmin())			 	 
				 .pipe(gulp.dest(options.dest + '/css'));	
});

gulp.task('images', function() {
	return gulp.src(options.src + '/**/*.jpg')
		.pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(options.dest));
});

gulp.task('clean', function () {  
  return gulp.src(options.dest, {read: false})
    .pipe(clean());
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {baseDir: 'src'}
	})
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
	gulp.watch(options.src + '/sass/**/*.scss', ['sass']);
	gulp.watch(options.src + '/*.html', browserSync.reload);	
});


gulp.task('build', function() {
	runSequence('clean', ['html', 'styles', 'images']);
});
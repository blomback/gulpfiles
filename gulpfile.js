var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify       = require('gulp-uglify'),
	jshint       = require('gulp-jshint'),
	header       = require('gulp-header'),
	rename       = require('gulp-rename'),
	minifyCSS    = require('gulp-minify-css'),
	gutil        = require('gulp-util'),
	sourcemaps   = require('gulp-sourcemaps'),
	package      = require('./package.json'),
	paths        = require('./paths.json'),
	concat       = require('gulp-concat');


var banner = [
	'/*!\n' +
	' * <%= package.title %>\n' +
	' * <%= package.url %>\n' +
	' * @author <%= package.author %>\n' +
	' * @version <%= package.version %>\n' +
	' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
	' */',
	'\n'
].join('');

gulp.task('css', function()
{
	gulp.src(paths.css.src)
		.pipe( sass() )
		.on('error', function(err)
		{
			gutil.log("Error: ", err.message);
			gutil.log("File: ", err.fileName);
			gutil.log("Line: ", err.lineNumber);
			gutil.beep();
		})
		.pipe(autoprefixer('last 4 version'))
		.pipe(gulp.dest(paths.css.build))
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(header(banner, {package: package}))
		.pipe(gulp.dest(paths.css.dest))
	;
});

gulp.task('js', function()
{
	gulp.src(paths.js.src)
		.pipe(concat('script.js'))
		.pipe(gulp.dest(paths.js.build))
		.pipe(uglify())
		.on('error', function(err)
		{
			gutil.log("Error: ", err.message);
			gutil.log("File: ", err.fileName);
			gutil.log("Line: ", err.lineNumber);
			gutil.beep();
		})
		.pipe(header(banner, {package: package}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.js.dest))
	;
});

gulp.task('default', ['css', 'js'], function()
{
	gulp.watch(paths.css.watch, ['css']);
	gulp.watch(paths.js.watch, ['js']);
});

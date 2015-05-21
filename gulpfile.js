var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify       = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var header       = require('gulp-header');
var rename       = require('gulp-rename');
var minifyCSS    = require('gulp-minify-css');
var gutil        = require('gulp-util');
var sourcemaps   = require('gulp-sourcemaps');
var package      = require('./package.json');
var paths        = require('./paths.json');
var concat       = require('gulp-concat');


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
		.pipe(gulp.dest(paths.css.dest))
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(header(banner, {package: package}))
		.pipe(gulp.dest(paths.css.dest))
	;
});

gulp.task('js', function()
{
	gulp.src(paths.js.src)
		.pipe(concat('all.js'))
		.pipe(gulp.dest(paths.js.dest))
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

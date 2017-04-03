var gulp = require('gulp')
var less = require('gulp-less')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var ngAnnotate = require('gulp-ng-annotate')


var srcPath = '';
var distPath = 'dist/';

gulp.task('src', function() {
    gulp.src([srcPath + 'src/index\.php'],[srcPath + 'src/bstl\.png'],[srcPath + 'src/\.htaccess'])
        .pipe(gulp.dest(distPath));
});

gulp.task('app', function() {
    gulp.src([srcPath + 'src/app/**/*.js'])
        .pipe(sourcemaps.init())
        .on('error', swallowError)
        .pipe(concat(distPath + 'js/app.js'))
        .on('error', swallowError)
        .pipe(ngAnnotate())
        .on('error', swallowError)
        .pipe(sourcemaps.write())
        .on('error', swallowError)
        .pipe(gulp.dest('.'))
        .on('error',swallowError)
        .pipe(rename(distPath + 'js/app.min.js'))
        .on('error', swallowError)
        .pipe(uglify({ mangle: false }))
        .on('error', swallowError)
        .pipe(gulp.dest('.'))
        .on('error',swallowError);
});

gulp.task('js', function() {
    gulp.src(srcPath + 'js/**/*.*')
        .pipe(gulp.dest(distPath + 'js/.'));
});

gulp.task('templates', function() {
    gulp.src(srcPath + 'src/app/**/*.html')
        .pipe(gulp.dest(distPath + 'templates/.'));
});

gulp.task('lib', function() {
    gulp.src([srcPath + 'lib/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat(distPath + 'js/libs.js'))
        .pipe(gulp.dest('.'))

    gulp.src([srcPath + 'lib/**/*.js.map'])
        .pipe(gulp.dest(distPath + 'js/.'));

    gulp.src([srcPath + 'js/**/*.js'])
        .pipe(gulp.dest(distPath + 'js/.'));
})

gulp.task('css', function() {
    gulp.src([srcPath + 'css/**'])
        .pipe(gulp.dest(distPath + 'css/.'));
});

gulp.task('build', ['src', 'app', 'templates', 'lib','js', 'css'], function() {

});

gulp.task('watch', ['src', 'app', 'templates', 'lib','js', 'css'], function() {
    gulp.watch([srcPath + 'src/*'], ['src'])
    gulp.watch([srcPath + 'src/app/**/*.*'], ['app', 'templates'])
    gulp.watch([srcPath + 'lib/**/*.*'], ['lib'])
    gulp.watch([srcPath + 'js/**/*.*'], ['js'])
    gulp.watch([srcPath + 'css/**/*.*'], ['css'])
})

function swallowError(error) {
    console.log(error.toString())
    this.emit('end')
}

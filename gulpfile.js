const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();


const isMap = process.argv.includes('--map');
const isMinify = process.argv.includes('--minify');
const isSync = process.argv.includes('--sync');


function clean() {
    return del('./build/*');
}

function html() {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./build/'))
        .pipe(gulpif(isSync, browserSync.stream()));
}
function css() {
    return gulp.src('./src/css/**/*.css')
        .pipe(gulpif(isMap, sourcemaps.init()))
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(gcmq())
        .pipe(gulpif(isMinify, cleanCSS( {level: 2} )))
        .pipe(gulpif(isMap, sourcemaps.write()))
        .pipe(gulp.dest('./build/css/'))
        .pipe(gulpif(isSync, browserSync.stream()));
}
function img() {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./build/img/'));
}

function watch(){
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

    gulp.watch('./src/**/*.html', html);
    gulp.watch('./src/**/*.css', css);
}

const build = gulp.series(clean, gulp.parallel(html, css, img))

gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));
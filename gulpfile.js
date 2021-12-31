let sass = require('gulp-sass')(require('sass'));
let {dest, src, series, watch} = require('gulp'),
gulp = require('gulp'),
sourcemaps = require('gulp-sourcemaps');


function css(){
   return src('src/styles/main.scss')
   .pipe(sourcemaps.init())
   .pipe(sass())
   .pipe(sourcemaps.write())
   .pipe(dest('dist/css/'));
}

function watchCss(){
   watch('src/styles/**/*.scss', css)
}

exports.default = series(css, watchCss)
exports.css = css
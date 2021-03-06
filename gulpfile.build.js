const gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    sass = require('gulp-sass'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del'),
    template = require('./template'),
    zip = require('gulp-zip'),
    war = require('gulp-war');

const app = require('./config/apps')
/* 
发布环境
*/
let tasks = [],
    isDone = false;
gulp.task('clean', function (cb) {
    if (!isDone) {
        console.log('cleaning')
        return del(['./build'])
    } else {
        console.log('skip clean')
        cb()
    }
})
app.dirs.forEach((value) => {
    gulp.task(`${value}-template`, ['clean'], function () {
        return gulp.src(`./src/${value}/templates/*.html`)
            .pipe(template(value))
            .pipe(concat('template.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(`./build/${value}/js`))

    })
    gulp.task(`${value}-js`, ['clean'], function () {
        return gulp.src([
            `./src/${value}/**/*.js`,
            `!./src/framework/dev/**`
        ])
            .pipe(uglify())
            .pipe(concat(`${value}.min.js`))
            .pipe(gulp.dest(`./build/${value}/js`))
    })
    gulp.task(`${value}-sass`, ['clean'], function () {
        return gulp.src([`./src/${value}/styles/*.scss`])
            .pipe(sass().on('error', sass.logError))
            // .pipe(concat(`${value}.css`))
            .pipe(gulp.dest(`./src/${value}/styles`))
    })
    gulp.task(`${value}-css`, [`${value}-sass`], function () {
        return gulp.src([`./src/${value}/**/*.css`])
            .pipe(minifycss())
            .pipe(concat(`${value}.min.css`))
            .pipe(gulp.dest(`./build/${value}/styles`))
    })
    gulp.task(`${value}-html`, ['clean'], function () {
        return gulp.src(`./src/${value}/*.html`)
            .pipe(htmlmin())
            .pipe(htmlreplace({
                template: 'js/template.min.js',
                js: `js/${value}.min.js`,
                framework: '../framework/js/framework.min.js',
                css: `styles/${value}.min.css`
            }))
            .pipe(gulp.dest(`./build/${value}/`))
    })
    gulp.task(`${value}-copy`, ['clean'], function () {
        return gulp.src([
            `./src/${value}/**`,
            `!./src/${value}/**/*.{html,js,css,scss}`
        ])
            .pipe(gulp.dest(`./build/${value}`))
    })
    gulp.task(value, [
        `${value}-template`, 
        `${value}-js`, 
        `${value}-css`, 
        `${value}-html`,
        `${value}-copy`
    ])
    tasks.push(value)
})

let serverOpen = app.build.serverOpen
gulp.task('default', tasks, function () {
    if (serverOpen) {
        browserSync({
            server: {
                baseDir: 'build'
            },
            open: false
        });
    }
    if(app.build.compressWar){
        return gulp.src(['./build/**','!./build/*.war'])
        .pipe(zip(`${app.name}.war`))
        .pipe(gulp.dest('./build'))
    }
})
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
    server = require('./server');

const app = require('./config/apps')
/* 
开发环境 
*/
let tasks = [],
    isDone = false;
gulp.task('clean', function (cb) {
    if (!isDone) {
        console.log('cleaning')
        return del(['./dev'])
    } else {
        console.log('skip clean')
        cb()
    }
})
app.dirs.forEach((value) => {
    gulp.task(`${value}-template`, ['clean'], function () {
        return gulp.src(`./src/${value}/templates/*.html`)
            .pipe(template())
            .pipe(concat('template.js'))
            .pipe(gulp.dest(`./dev/${value}/js`))

    })
    gulp.task(`${value}-js`, ['clean'], function () {
        return gulp.src([
                `./src/${value}/**/*.js`,
                `!./src/${value}/build/*.js`
            ])
            .pipe(concat(`${value}.js`))
            .pipe(gulp.dest(`./dev/${value}/js`))
    })
    gulp.task(`${value}-sass`, ['clean'], function () {
        return gulp.src([`./src/${value}/styles/*.scss`])
            .pipe(sass().on('error', sass.logError))
            // .pipe(concat(`${value}.css`))
            .pipe(gulp.dest(`./src/${value}/styles`))
    })
    gulp.task(`${value}-css`, [`${value}-sass`], function () {
        return gulp.src([`./src/${value}/**/*.css`])
            .pipe(concat(`${value}.css`))
            .pipe(gulp.dest(`./dev/${value}/styles`))
    })
   
    gulp.task(`${value}-html`, ['clean'], function () {
        return gulp.src(`./src/${value}/*.html`)
            .pipe(htmlreplace({
                template: 'js/template.js',
                js: `js/${value}.js`,
                framework: '../framework/js/framework.js',
                css: `styles/${value}.css`
            }))
            .pipe(gulp.dest(`./dev/${value}`))
    })
    gulp.task(`${value}-copy`, ['clean'], function () {
        return gulp.src([
                `./src/${value}/**`,
                `!./src/${value}/**/*.{html,js,css,scss}`
            ])
            .pipe(gulp.dest(`./dev/${value}`))
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

gulp.task('watch', tasks, function (cb) {
    app.dirs.forEach((value) => {
        gulp.watch(`./src/${value}/js/*.js`, [`${value}-js`]);
        gulp.watch(`./src/${value}/styles/*.scss`, [`${value}-sass`]);
        gulp.watch(`./src/${value}/styles/*.css`, [`${value}-css`]);
        gulp.watch(`./src/${value}/*.html`, [`${value}-html`]);
        gulp.watch(`./src/${value}/templates/*.html`, [`${value}-template`]);
    })
    isDone = true
    cb()
});
let useVorlon = app.dev.useVorlon,
    vorlonPort = app.dev.vorlonPort,
    openServer = app.dev.serverOpen
gulp.task('default', ['watch'], function () {
    if (openServer) {
        browserSync({
            server: {
                baseDir: 'dev'
            },
            open: false,
            files: ["dev/**/*.css", "dev/**/js/*.js", "dev/**/*.html"],
            scriptPath: function (path, port, options) {
                if (useVorlon) {
                    return 'http://HOST:' + vorlonPort + '/vorlon.js'
                } else {
                    return 'http://HOST:' + port + path
                }

            }
        });
    }
})
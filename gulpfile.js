const gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del'),
    template = require('./template'),
    server = require('./server');

const apps = require('./config/apps').dirs
/* 
开发版
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
apps.forEach((value) => {
    gulp.task(`${value}-template`, ['clean'], function () {
        return gulp.src(`./src/${value}/templates/*.html`)
            .pipe(template(value))
            .pipe(concat('template.js'))
            .pipe(gulp.dest(`./dev/${value}/js`))

    })
    gulp.task(`${value}-js`, ['clean'], function () {
        return gulp.src([`./src/${value}/js/*.js`])
            // .pipe(uglify())
            .pipe(gulp.dest(`./dev/${value}/js`))
    })
    gulp.task(`${value}-css`, ['clean'], function () {
        return gulp.src([`./src/${value}/styles/*.css`])
            // .pipe(uglify())
            .pipe(gulp.dest(`./dev/${value}/styles`))
    })
    gulp.task(`${value}-html`, ['clean'], function () {
        return gulp.src(`./src/${value}/*.html`)
            // .pipe(htmlmin())
            .pipe(gulp.dest(`./dev/${value}/`))
    })
    gulp.task(value, [`${value}-template`, `${value}-js`, `${value}-css`, `${value}-html`])
    tasks.push(value)
})
gulp.task('framework', ['clean'], function () {
    return gulp.src('./src/framework/**')
        .pipe(gulp.dest('./dev/framework'))
})
tasks.push('framework')
gulp.task('watch', tasks, function (cb) {
    // apps.forEach((value) => {
    //     gulp.watch(`./src/${value}/js/*.js`, [`${value}-js`]);
    //     gulp.watch(`./src/${value}/styles/*.css`, [`${value}-css`]);
    //     gulp.watch(`./src/${value}/*.html`, [`${value}-html`]);
    //     gulp.watch(`./src/${value}/templates/*.html`, [`${value}-template`]);
    // })
    isDone = true
    cb()
});
let useVorlon = false,
    vorlonPort = 1337
gulp.task('default', ['watch'], function () {
    // browserSync({
    //     server: {
    //         baseDir: 'dev'
    //     },
    //     open: false,
    //     files: ["dev/**/*.css", "dev/**/js/*.js", "dev/**/*.html"],
    //     scriptPath: function (path, port, options) {
    //         if (useVorlon) {
    //             return 'http://HOST:' + vorlonPort + '/vorlon.js'
    //         } else {
    //             return 'http://HOST:' + port + path
    //         }

    //     }
    //     // port: 8080,
    //     // ui: {
    //     //     port: 8081,
    //     // }
    // });
})

// function getIPAddress() {
//     var interfaces = require('os').networkInterfaces();
//     for (var devName in interfaces) {
//         var iface = interfaces[devName];
//         for (var i = 0; i < iface.length; i++) {
//             var alias = iface[i];
//             if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
//                 console.log(alias)
//                 return alias.address;
//             }
//         }
//     }
// }
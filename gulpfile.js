var gulp            = require('gulp');
var autoprefixer    = require('gulp-autoprefixer');
var browserSync     = require('browser-sync');
var concat          = require('gulp-concat');
var fileInclude     = require('gulp-file-include');
var imagemin        = require('gulp-imagemin');
var htmlmin         = require('gulp-htmlmin');
var rename          = require('gulp-rename');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var watch           = require('gulp-watch');
var util            = require('gulp-util');
var uglify          = require('gulp-uglify');

//=========================================================
//                                                Variáveis
//=========================================================

// Bundle CSS || Chamar todos os arquivos .css e .scss para gerar uma variável de CSS geral
var cssBundle = [
    'src/scss/*.scss',
    'src/components/**/*scss'
];

// Bundle JS || Chamar todos os arquivos .js para gerar uma variável de JS geral
var jsBundle = [
    'src/js/*.js',
    'src/js/**/*.js'
];

// Includes HTML || chamar todos os arquivos HTML para inclusão
var html = [
    'src/*.html',
    'src/**/*.html'
];

// Bundle IMAGES || Chamar todos os arquivos de imagens (.png, .jpg, .jpeg, .svg., .gif) para gerar uma variável de IMAGENS geral
var imgBundle = [
    'src/images/*.png',
    'src/images/*.jpg',
    'src/images/*.jpeg',
    'src/images/*.svg',
    'src/images/*.gif',
    'src/images/**/*.png',
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.svg',
    'src/images/**/*.gif'
];


//=========================================================
//                                                    Tasks
//=========================================================

/*****|| CSS/SASS ||*****/
gulp.task('build:cssBundle', function() {
    var sassOption = {
        errLogToConsole: true,
        outputStyle: 'expanded'
    };

    return gulp
    .src(cssBundle)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOption).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['ie >= 10', 'last 10 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('stylesheets/maps'))
    .pipe(concat('bundle.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

/*****|| JS ||*****/
gulp.task('build:jsBundle', function() {
    return gulp
    .src(jsBundle)
    .pipe(uglify())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

/*****|| HTML ||*****/
gulp.task('build:html', function() {
    gulp.src(html)
    .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

/*****|| IMAGE ||*****/
gulp.task('build:imgBundle', function() {
    return gulp
    .src(imgBundle)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/image'))
    .pipe(browserSync.stream());
});

/*****|| RELOAD ||*****/
gulp.task('reload', function() {
    browserSync.reload();
});

/*****|| WATCH ||*****/
gulp.task('watch', ['reload'], function() {
    gulp.watch(cssBundle, ['build:cssBundle']);
    gulp.watch(jsBundle, ['build:jsBundle']);
    gulp.watch(html, ['build:html']);
    gulp.watch(imgBundle, ['build:imgBundle']);
});

/*****|| WEBSERVER ||*****/
gulp.task('webserver', ['watch', 'build:cssBundle', 'build:jsBundle', 'build:html', 'build:imgBundle'], function() {
    var browser = browserSync.create();
    browser.init({
        injectChanges: true,
        open: 'internal',
        files: ['index.html'],
        server: {
            baseDir: './dist'
        },
        port: 1992
    });

    return browser.watch([cssBundle, jsBundle, html, imgBundle], function() {
        browser.reload();
    })
});

/*****|| DEFAULT ||*****/
gulp.task('default', ['build:cssBundle', 'build:jsBundle', 'build:html', 'build:imgBundle']);

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require("gulp-imagemin");
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const gifsicle = require('imagemin-gifsicle');
const svgo = require('imagemin-svgo');
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const plumber = require("gulp-plumber");
const slim = require("gulp-slim");
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const browserSync = require('browser-sync').create();

const baseDir = {
  dest: 'dist',
  sass: 'src/**/*.sass',
  js: 'src/**/*.js',
  slim: 'src/**/*.slim',
  img: 'src/**/*.{png,jpg,gif,svg}'
}

//sassコンパイル
gulp.task('sass', () => {
  return gulp.src(baseDir.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(autoprefixer({
      browsers: [
        'last 2 version',
        'Explorer >= 11',
        'iOS >= 8.1',
        'Android >= 4.4'
      ],
      cascade: false
    }))
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(baseDir.dest))
    .pipe(browserSync.stream());
});


//babel
gulp.task('babel', () => {
  gulp.src([baseDir.js, '!src/**/_*.js'])
    .pipe(browserify({
      insertGlobals: true,
      debug: !gulp.env.production
    }))
    .pipe(babel({presets: ['env']}))
    .pipe(uglify())
    .pipe(plumber())
    .pipe(gulp.dest(baseDir.dest))
    .pipe(browserSync.stream());
});

//slim
gulp.task('slim', function () {
  gulp.src([baseDir.slim, "!src/**/_*.slim"])
    .pipe(changed(baseDir.dest))
    .pipe(plumber())
    .pipe(slim({
      include: true,
      pretty: true
    }))
    .pipe(gulp.dest(baseDir.dest))
    .pipe(browserSync.stream());
});

//画像圧縮
gulp.task('imagemin', () => {
  gulp.src(baseDir.img)
    .pipe(changed(baseDir.dest))
    .pipe(imagemin([
      pngquant({ quality: '75-95', speed: 1 }),
      {use: [mozjpeg()]},
      imagemin.svgo(),
      imagemin.gifsicle()
    ]))
    .pipe(imagemin())
    .pipe(gulp.dest(baseDir.dest));
});

gulp.task('copy', () => {
  return gulp.src([
      'src/**/*',
      '!src/_**',
      '!src/**/_**',
      '!src/**/*.sass',
      '!src/**/*.slim',
      '!src/**/*.js',
      '!src/*.+(jpg|png|gif|svg)'
    ])
    .pipe(gulp.dest(baseDir.dest))
    .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: baseDir.dest
    }
  });

  gulp.watch([baseDir.sass], ['sass']);
  gulp.watch([baseDir.slim], ['slim']);
  gulp.watch([baseDir.js], ['babel']);
  gulp.watch([baseDir.img], ['imagemin']);
  gulp.watch([
    'src/**/*',
    '!src/**/*.slim',
    '!src/**/*.sass',
  ], ['copy']);
});

gulp.task('default', ['copy','sass','slim','babel', 'watch']);

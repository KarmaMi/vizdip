const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const jsdoc = require('gulp-jsdoc3')

gulp.task('browserify', () => {
  browserify({entries: ['lib/index.js']})
  .bundle()
  .pipe(source('vizdip.js'))
  .pipe(gulp.dest('./'))
})
gulp.task('watch-browserify', () => gulp.watch(['lib/**'], ['browserify']))

gulp.task('docs', (cb) => {
  const configs = require('./configs/jsdoc-config.json')
  gulp.src(['./lib/**/*.js', 'README.md'], { read: false })
    .pipe(jsdoc(configs, cb))
})

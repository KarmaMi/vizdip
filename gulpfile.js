const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

gulp.task('browserify', () => {
  browserify({entries: ['lib/index.js']})
  .bundle()
  .pipe(source('vizdip.js'))
  .pipe(gulp.dest('./'))
})
gulp.task('watch-browserify', () => gulp.watch(['lib/**'], ['browserify']))

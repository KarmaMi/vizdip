const gulp = require('gulp')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const merge = require('merge2')

const ts = require('gulp-typescript')
const tsify = require('tsify')
const typedoc = require('gulp-typedoc')
const sourcemaps = require('gulp-sourcemaps')

const browserify = require('browserify')

const tsSourceProject = ts.createProject('./src/tsconfig.json')
const tsCompilerOptions = require('./src/tsconfig.json').compilerOptions

// compile source files
gulp.task('compile-src', () => {
  const tsResult = gulp.src(['./src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsSourceProject(ts.reporter.defaultReporter()))

  return merge([
    tsResult.dts.pipe(gulp.dest('./target/interface')),
    tsResult.js
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./target/src'))
  ])
})

gulp.task('compile-sample', () => {
  browserify({entries: ['example/src/example.js']})
  .plugin(tsify, tsCompilerOptions)
  .bundle()
  .pipe(source('example.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('example/'))
})
gulp.task('watch-sample', () => gulp.watch(['src/**/*.ts', 'example/**/*.js'], ['compile-sample']))

// Create a documentation
gulp.task('docs', () => {
  const packageOption = require('./package.json')
  const configs = {
    target: tsCompilerOptions.target,
    module: tsCompilerOptions.module,
    out: './docs',
    includeDeclarations: false,
    name: packageOption.name,
    version: true
  }
  gulp.src(['./src/**/*.ts'], { read: false })
    .pipe(typedoc(configs))
})

gulp.task('browserify', () => {
  browserify({entries: ['browser/index.ts']})
  .plugin(tsify, tsCompilerOptions)
  .bundle()
  .pipe(source('vizdip.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('browser/'))
})

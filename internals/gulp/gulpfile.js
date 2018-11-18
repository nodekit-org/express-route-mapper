(function changeCurrentWorkingDirectoryToResolveNodeModulesPath() {
  process.chdir('../../');
  console.info('Current working directory %s', process.cwd());
})();

const babel = require('gulp-babel');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const util = require('util');

const babelRc = require('./.babelrc');
const paths = require('../../src/paths');
const tsConfig = require('./tsconfig');

const buildLog = (tag, ...args) => {
  console.info(chalk.cyan(`[build - ${tag}]`), util.format(...args));
};

const Task = {
  BABEL: 'babel',
  BUILD: 'build',
  CLEAN: 'clean',
  TSC: 'tsc',
};

/**
 * Currently not used, mainly because gulp-typescript does not support `emitDeclarationOnly`.
 */
// gulp.task(Task.BABEL, () => {
//   buildLog(
//     Task.BABEL,
//     'NODE_ENV: %s, LIB_PATH: %s, SRC_PATH: %s',
//     process.env.NODE_ENV, 
//     paths.lib,
//     paths.src,
//   );

//   return gulp.src([`${paths.src}/**/*.{js,jsx,ts,tsx}`])
//     .pipe(sourcemaps.init())
//     .pipe(babel(babelRc))
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(paths.lib));
// });

gulp.task(Task.CLEAN, () => {
  buildLog(Task.CLEAN, 'LIB_PATH: %s', paths.lib);

  return del([
    `${paths.lib}/**/*`,
  ]);
});

gulp.task(Task.TSC, gulp.series(Task.CLEAN, function _tsc(done) {
  buildLog('tsc config: %o', tsConfig.compilerOptions);
  const tsProject = ts.createProject(tsConfig.compilerOptions);

  return gulp.src([`${paths.src}/**/*.{ts,tsx}`])
    .pipe(tsProject())
    .pipe(gulp.dest(paths.lib));
}));

gulp.task(Task.BUILD, gulp.series(Task.CLEAN, Task.TSC));

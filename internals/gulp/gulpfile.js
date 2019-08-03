(function changeCurrentWorkingDirectoryToResolveNodeModulesPath() {
  process.chdir('../../');
  console.info('Current working directory %s', process.cwd());
})();

const { buildLogger } = require('jege/server');
const del = require('del');
const gulp = require('gulp');
const ts = require('gulp-typescript');

const paths = require('../../src/paths');

const log = buildLogger('[express-route-mapper]');

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
  log(Task.CLEAN, 'LIB_PATH: %s', paths.lib);

  return del([
    `${paths.lib}/**/*`,
  ]);
});

gulp.task(Task.TSC, gulp.series(Task.CLEAN, function _tsc(done) {
  const tsProject = ts.createProject('tsconfig.json');
  log(Task.TSC, 'Typescript configuration:\n%o', tsProject.config);

  return gulp.src([`${paths.src}/**/*.{ts,tsx}`])
    .pipe(tsProject())
    .pipe(gulp.dest(paths.lib));
}));

gulp.task(Task.BUILD, gulp.series(Task.CLEAN, Task.TSC));

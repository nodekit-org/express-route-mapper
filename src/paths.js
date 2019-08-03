const fs = require('fs');
const { logger } = require('jege/server')
const path = require('path');

const log = logger('[express-route-mapper]');
const ROOT_PATH = fs.realpathSync(process.cwd());

(function checkIfCurrentWorkingDirectoryIsCorrect() {
  log('ROOT_PATH', ROOT_PATH);
  const pJson = fs.existsSync(`${ROOT_PATH}/package.json`);
  if (!pJson) {
    log(`
Current working directory might not be the project root directory.
Did you call process.chdir() properly?`);
    process.exit(0);
  }
})();

module.exports = {
  lib: path.resolve(ROOT_PATH, 'lib'),
  src: path.resolve(ROOT_PATH, 'src'),
};

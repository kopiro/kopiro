const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const paths = {
  dotenv: resolveApp('.env'),
  dist: resolveApp('dist'),
  src: resolveApp('src'),
  srcComponents: resolveApp('src/components'),
  srcServer: resolveApp('src/server'),
  readmeFile: resolveApp('README.md'),
  db: resolveApp('db'),
  public: resolveApp('public'),
  publicJs: resolveApp('public/js'),
};

paths.resolveModules = [paths.srcComponents, paths.srcServer, paths.src, 'node_modules'];

module.exports = paths;

const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
  root: appDirectory,
  src: resolveApp("src"),
  public: resolveApp("public"),
  db: resolveApp("db"),
  partials: resolveApp("partials"),
  readme: resolveApp("README.md"),
  build: resolveApp("build"),
};

module.exports = paths;

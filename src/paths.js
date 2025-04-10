const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
  root: appDirectory,
  dist: resolveApp("dist"),
  src: resolveApp("src"),
  md: resolveApp("md"),
  db: resolveApp("db"),
  partials: resolveApp("partials"),
  readme: resolveApp("readme.md"),
  public: resolveApp("public"),
  press: resolveApp("press"),
};

module.exports = paths;

const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const paths = {
  root: appDirectory,
  src: resolveApp("src"),
  db: resolveApp("db"),
  partials: resolveApp("partials"),
  readme: resolveApp("README.md"),
  build: resolveApp("build"),
};

// Assets to copy from root to build
paths.publicAssets = [
  "favicon.ico",
  "gpg.txt",
  "img",
  "keybase.txt",
  "media",
  "script.js",
  "style.css",
];

module.exports = paths;

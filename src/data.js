const fs = require("fs");
const path = require("path");
const paths = require("./paths");

async function readMdFile(file) {
  return fs.readFileSync(path.join(paths.md, `${file}.md`), "utf-8").trim();
}

async function readDbFile(file) {
  const filePath = path.join(paths.db, `${file}.json`);
  if (!fs.existsSync(filePath)) return [];

  let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let mask = process.env[`${file.toUpperCase()}_WHITELIST`] || "";
  if (mask !== "*") {
    mask = mask.split(",").map((m) => {
      if (String(Number(m)) === m) {
        return { id: m };
      }
      return { name: new RegExp(m) };
    });

    data = data.filter((e) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const m of mask) {
        if (m.id) {
          if (m.id === String(e.id)) return true;
        } else if (m.name) {
          if (m.name.test(e.name)) return true;
          if (m.name.test(e.full_name)) return true;
        }
      }
      return false;
    });
  }

  return data;
}

module.exports = { readDbFile, readMdFile };

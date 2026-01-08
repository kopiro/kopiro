const fs = require("fs");
const path = require("path");
const paths = require("./paths");

const readPartial = (file) => fs.readFileSync(path.join(paths.partials, file), "utf-8").trim();

const deepMerge = (a, b) => {
  const result = { ...a };
  Object.keys(b).forEach((key) => {
    if (Array.isArray(b[key])) {
      result[key] = [...(a[key] || []), ...b[key]];
    } else if (typeof b[key] === "object" && b[key] !== null) {
      result[key] = deepMerge(a[key] || {}, b[key]);
    } else {
      result[key] = b[key];
    }
  });
  return result;
};

const walkMarkdowns = (dir = paths.public) => {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(walkMarkdowns(filePath));
    } else if (file.name.endsWith(".md")) {
      results.push(path.relative(paths.public, filePath));
    }
  }
  return results;
};

const readDbFile = (file) => {
  const filePath = path.join(paths.db, `${file}.json`);
  if (!fs.existsSync(filePath)) return [];

  let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let mask = process.env[`${file.toUpperCase()}_WHITELIST`] || "*";
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
};

function getDateHumanFormat(date) {
  if (!(date instanceof Date)) {
    // eslint-disable-next-line no-param-reassign
    date = new Date(date);
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

module.exports = { readDbFile, readPartial, getDateHumanFormat, walkMarkdowns, deepMerge };

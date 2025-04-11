const fs = require("fs");
const path = require("path");
const paths = require("./paths");

const readPartial = (file) => fs.readFileSync(path.join(paths.partials, file), "utf-8").trim();

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

  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  // Add ordinal suffix to day
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${year}, ${month} ${ordinal(day)}`;
}

module.exports = { readDbFile, readPartial, getDateHumanFormat };

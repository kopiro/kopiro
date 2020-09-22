const fetch = require("cross-fetch");
const fs = require("fs");
const path = require("path");
const paths = require("./paths");

const RUNNERS = {
  github: async () => {
    const usernames = process.env.GITHUB_USERNAME.split(",");
    const responses = await Promise.all(
      usernames.map((username) =>
        fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&access_token=${process.env.GITHUB_TOKEN}`,
        ).then((response) => response.json()),
      ),
    );
    return responses.reduce((carry, e) => carry.concat(e), []).sort((a, b) => b.stargazers_count - a.stargazers_count);
  },
  devto: async () => {
    const response = await fetch(`https://dev.to/api/articles?username=${process.env.DEVTO_USERNAME}`).then((r) =>
      r.json(),
    );
    return response.sort((a, b) => b.public_reactions_count - a.public_reactions_count);
  },
};

async function writeDbFile(file, json) {
  const filePath = path.join(paths.db, `${file}.json`);
  return fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

async function main() {
  Object.keys(RUNNERS).forEach(async (name) => {
    console.log(`${name}: running...`);
    try {
      const data = await RUNNERS[name]();
      if (data) writeDbFile(name, data);
      console.log(`${name}: OK, ${data.length} rows fetched`);
    } catch (ex) {
      console.error(`${name}: ERR`, ex);
    }
  });
}

main();

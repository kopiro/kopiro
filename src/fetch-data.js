const fetch = require("cross-fetch");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const paths = require("./paths");

const fetchers = {
  github: async () => {
    const usernames = process.env.GITHUB_USERNAME.split(",");
    let response = [];
    for (const username of usernames) {
      const r = await (
        await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&access_token=${process.env.GITHUB_TOKEN}`,
        )
      ).json();
      response = response.concat(r);
    }
    response = response.sort((b, a) => a.stargazers_count + a.forks_count - (b.stargazers_count - b.forks_count));
    return response;
  },
  medium: async () => {
    let response = await fetch(`https://medium.com/@${process.env.MEDIUM_USERNAME}/latest?format=json`);
    response = await response.text();
    response = response.replace("])}while(1);</x>", "");
    response = JSON.parse(response);
    response = response.payload.references.Post;
    response = Object.values(response);
    response = response.sort((b, a) => a.virtuals.totalClapCount - b.virtuals.totalClapCount);
    return response;
  },
  devto: async () => {
    let response = await fetch(`https://dev.to/api/articles?username=${process.env.DEVTO_USERNAME}`);
    response = await response.json();
    return response;
  },
};

async function writeDbFile(file, json) {
  if (!(file in fetchers)) {
    throw new Error(`Invalid fetcher ${file}`);
  }

  const filePath = path.join(paths.db, `${file}.json`);
  return promisify(fs.writeFile)(filePath, JSON.stringify(json, null, 2));
}

async function main() {
  Object.keys(fetchers).forEach(async (name) => {
    console.log(`${name}: running...`);
    try {
      const data = await fetchers[name]();
      if (data) {
        await writeDbFile(name, data);
      }
      console.log(`${name}: OK, ${data.length} rows fetched`);
    } catch (ex) {
      console.error(`${name}: ERR`, ex);
    }
  });
}

main();

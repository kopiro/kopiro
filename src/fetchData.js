const fs = require("fs");
const path = require("path");
const paths = require("./paths");

const RUNNERS = {
  github: async () => {
    const MAX_PER_PAGE = 100;
    const usernames = process.env.GITHUB_USERNAME.split(",");
    const responses = await Promise.all(
      usernames.map(async (username) => {
        let page = 1;
        let json = null;
        let carry = [];
        while (json == null || json.length > 0) {
          // eslint-disable-next-line no-await-in-loop
          const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=${MAX_PER_PAGE}&page=${page++}`,
            {
              headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
            },
          );
          // eslint-disable-next-line no-await-in-loop
          json = await response.json();
          carry = carry.concat(json);
        }
        return carry;
      }),
    );
    return responses.reduce((carry, e) => carry.concat(e), []);
  },
  devto: async () => {
    const response = await fetch(`https://dev.to/api/articles?username=${process.env.DEVTO_USERNAME}`).then((r) =>
      r.json(),
    );
    return response;
  },
};

const writeDbFile = (file, json) => {
  const filePath = path.join(paths.db, `${file}.json`);
  return fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
};

const main = () => {
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
};

main();

import fetch from 'cross-fetch';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import paths from '../../paths';

const fetchers = {
  github: async () => {
    const usernames = process.env.GITHUB_USERNAME.split(',');
    let response = [];
    for (const username of usernames) {
      const r = await (await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&access_token=${
          process.env.GITHUB_TOKEN
        }`,
      )).json();
      response = response.concat(r);
    }
    response = response.sort(
      (b, a) => a.stargazers_count + a.forks_count - (b.stargazers_count - b.forks_count),
    );
    return response;
  },
  medium: async () => {
    let response = await fetch(
      `https://medium.com/@${process.env.MEDIUM_USERNAME}/latest?format=json`,
    );
    response = await response.text();
    response = response.replace('])}while(1);</x>', '');
    response = JSON.parse(response);
    response = response.payload.references.Post;
    response = Object.values(response);
    response = response.sort((b, a) => a.virtuals.totalClapCount - b.virtuals.totalClapCount);
    return response;
  },
  projects: async () => null,
};

export async function readDbFile(file) {
  if (!(file in fetchers)) {
    throw new Error(`Invalid fetcher ${file}`);
  }

  const filePath = path.join(paths.db, `${file}.json`);

  let data = [];
  data = String(await promisify(fs.readFile)(filePath));
  data = JSON.parse(data);

  let mask = process.env[`${file.toUpperCase()}_WHITELIST`] || '';
  if (mask !== '*') {
    mask = mask.split(',').map((m) => {
      if (String(Number(m)) === m) {
        return { id: m };
      }
      return { name: new RegExp(m) };
    });

    data = data.filter((e) => {
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

export async function writeDbFile(file, json) {
  if (!(file in fetchers)) {
    throw new Error(`Invalid fetcher ${file}`);
  }

  const filePath = path.join(paths.db, `${file}.json`);
  return promisify(fs.writeFile)(filePath, JSON.stringify(json, null, 2));
}

export default async function () {
  Object.keys(fetchers).forEach(async (file) => {
    console.log('Running fetcher :', file);
    try {
      const data = await fetchers[file]();
      if (data) {
        await writeDbFile(file, data);
      }
    } catch (ex) {
      console.error(file, ex);
    }
  });
}

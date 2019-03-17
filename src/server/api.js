import showdown from 'showdown';
import { promisify } from 'util';
import fs from 'fs';
import { readDbFile } from './fetcher';
import paths from '../../paths';

export async function getStory() {
  const converter = new showdown.Converter();
  const readmeFile = (await promisify(fs.readFile)(paths.readmeFile)).toString();
  const data = converter.makeHtml(readmeFile);
  return data;
}

export async function getProjects() {
  const data = await readDbFile('projects');
  return data;
}

export async function getMedium() {
  const data = await readDbFile('medium');
  return data;
}

export async function getGithub() {
  const data = await readDbFile('github');
  return data;
}

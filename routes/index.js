const fs = require('fs').promises;
const express = require('express');
const router = express.Router();
const pack = require('../package.json');
const showdown = require('showdown');

async function getData(file) {
	let json = (await fs.readFile(`./db/${file}.json`)).toString();
	json = JSON.parse(json) || { data: [] };
	return Object.values(json.data).filter(e => e.visible);
}

async function getPress() {
	let data = await getData('press');
	data = data.sort(e => e.totalClapCount);
	return data;
}

async function getOssProjects() {
	let data = await getData('oss_projects');
	data = data.filter(e => !e.fork && !e.private);
	data = data.filter(e => e.description);
	data = data.sort(e => -e.stargazers_count);
	return data;
}

async function getProjects() {
	let data = await getData('projects');
	data = data.sort(e => e.updated_at);
	return data;
}

async function getStory() {
	const converter = new showdown.Converter();
	const readmeFile = (await fs.readFile('./README.md')).toString();
	return converter.makeHtml(readmeFile);
}

router.get('/', async (req, res, next) => {
	const data = {
		pack: pack,
		story: await getStory(),
		press: await getPress(),
		oss_projects: await getOssProjects(),
		projects: await getProjects()
	};
	res.render('index', data);
});

module.exports = router;

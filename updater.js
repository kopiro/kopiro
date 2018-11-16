const fetch = require('node-fetch');
const fs = require('fs').promises;

async function getOssProjects() {
	let response = await fetch(
		`https://api.github.com/users/${
			process.env.GITHUB_USERNAME
		}/repos?per_page=100&access_token=${process.env.GITHUB_TOKEN}`
	);
	response = await response.json();
	return response;
}

async function getPress() {
	let response = await fetch(
		`https://medium.com/@${process.env.MEDIUM_USERNAME}/latest?format=json`
	);
	response = await response.text();
	response = response.replace('])}while(1);</x>', '');
	response = JSON.parse(response);
	response = response.payload.references.Post;
	return Object.values(response);
}

const fetchers = {
	oss_projects: getOssProjects,
	press: getPress
};

async function readDbFile(file) {
	try {
		let json = (await fs.readFile(`./db/${file}.json`)).toString();
		json = JSON.parse(json);
		if (json == null || json.data == null) {
			throw 'invalid_db';
		}
		return json;
	} catch (err) {
		console.error(err);
		return { id: file, data: {} };
	}
}

async function writeDbFile(file, data) {
	return fs.writeFile(`./db/${file}.json`, JSON.stringify(data, null, 2));
}

exports.run = async function() {
	try {
		for (let file of ['press', 'oss_projects']) {
			const db = await readDbFile(file);

			const data = await fetchers[file]();
			let atLeastOneAdded = false;

			for (let el of data) {
				if (typeof el !== 'object') continue;
				if (db.data[el.id] != null) continue;

				console.log(`Updater - inserting <${file}, ${el.id}>`);
				el.visible = true;
				db.data[el.id] = el;
				atLeastOneAdded = true;
			}

			if (atLeastOneAdded) {
				writeDbFile(file, db);
			}
		}
	} catch (err) {
		console.error(err);
	}
};

const puppeteer = require('puppeteer');

async function run() {
	console.log('Screenshot run');
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
	const page = await browser.newPage();
	const response = await page.goto('http://nginx', {
		waitUntil: 'networkidle2'
	});
	if (response.status() == 200) {
		await page.emulateMedia('screen');
		await page.pdf({
			margin: { left: '2cm', top: '2.5cm', right: '2cm', bottom: '2.5cm' },
			path: '/screenshots/cv.pdf'
		});
		console.log('Screenshot OK');
	} else {
		console.log('Screenshot gave error');
	}
	await browser.close();
}

console.log('Screenshot started');

run();
setInterval(run, 60 * 1000);

const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
	const page = await browser.newPage();
	await page.goto('http://app', { waitUntil: 'networkidle2' });
	await page.emulateMedia('screen');
	await page.pdf({ path: '/screenshots/cv.pdf' });
	await browser.close();
})();

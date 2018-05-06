var gcloud = require('gcloud')({
  keyFilename: 'gcloud.json'
});
var vision = gcloud.vision();

const fs = require('fs');
const express = require('express')
const app = express()
const dataUriToBuffer = require('data-uri-to-buffer');

let TOKEN = null;

app.get('/', (req, res) => {
	res.send('<h1>' + TOKEN + '</h1>');
})

app.post('/', (req, res) => {
	const decoded = dataUriToBuffer(req.data);
	fs.writeFileSync('latest.jpg', decoded);
	vision.detectText('latest.jpg', function(err, text, apiResponse) {
		TOKEN = text;
	});
})

app.listen(3000, () => {
	console.log('Server listening on 3000');
});


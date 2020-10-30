const intraConf = require('./config.json');
const express = require('express')
const discordClient = require('../discord/client.js')
const fs = require('fs');
const app = express()

let intraAuth = function (req, res, next) {
	endpointName = req.url.split('/').pop()
	if (!(req.headers['x-secret'] === intraConf.hooks_secrets[endpointName])) {
		console.log('unauthorized');
		res.sendStatus(401);
		return;
	}
	next();
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(intraAuth);

fs.readdir('./intra/endpoints/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const endpoint = require(`./endpoints/${file}`);
		let endpointURL = `/${file.split('.')[0]}`;
		app.post(endpointURL, endpoint.bind(null, discordClient, intraConf));
	});
});

app.listen(intraConf.port, () => {
	console.log(`Listening intrahooks at http://localhost:${intraConf.port}`);
});

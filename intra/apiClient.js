const axios = require('axios')
const intraConf = require('./config.json');

const TRIESLIMIT = 10;
const TIMEOUT = 900;

let token;

async function getToken() {
	return axios.post(intraConf.token_url, {
		client_id: intraConf.client, 
		client_secret: intraConf.secret, 
		grant_type: 'client_credentials', 
		scope: intraConf.scopes
	});
}

async function renewToken() {
	token = getToken();
}

function authError(authHead, token) {
	if (!(authHead === "")) {
		const desc = authHead.split('error_description="')[1].split('"')[0];
		if (desc == "The access token expired" || desc == "The access token is invalid") {
			console.log(desc);
			console.log("Renewing token");
			renewToken();
			return true
		}
	}
	return false
}

async function rateLimit(retryAfter) {
	console.log("Rate limit exceeed");
	const waitTime = parseInt(retryAfter);
	console.log(`Waiting ${waitTime}s before requesting again`) 
	return new Promise(r => setTimeout(r, 1000 * waitTime));
}

function logError(resp, url, params) {
	console.error(`Headers: ${resp.headers}`);
	console.error(`${'Client' ? resp.status < 500 : 'Server'}Error(${resp.status})`)
	console.error(`${url} with params: ${params}`)
	console.error(`Response: ${resp.data}`)
}

async function writeHeader(params) {
	if (token === undefined) {
		renewToken();
	}
	tokenData = (await token).data;
	params.headers = {
		'Authorization': `${tokenData.token_type} ${tokenData.access_token}`
	};
}

async function intraRequest(method, url, params={}) {
	await writeHeader(params);
	params.method = params.method == undefined ? method : params.method;
	params.timeout = params.timeout == undefined ? 900 * 1000 : params.timeout;
	params.url = params.url == undefined ? `${intraConf.endpoint}/${url}` : params.url;	
	let tries = 0;
	while (tries < TRIESLIMIT) {
		await new Promise(r => setTimeout(r, 50 * tries++));
		try {
			return await axios(params);
		} catch (error) {
			let resp = error.response;
			switch (resp.status) {
				case 401:
					if (authError(resp.headers['www-authenticate'])) 
						await writeHeader(params);
						break;
				case 429:
					await rateLimit(resp.headers['retry-after']);
					break;
				default:
					if (resp.status >= 400) {
						logError(resp, url, params);
						throw error;
					}	
			};
		}
	}
}

exports.intraRequest = intraRequest;

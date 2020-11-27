const axios = require('axios')
const intraConf = require('./config.json');

const TRIESLIMIT = 10;
const TIMEOUT = 900;

let token;

const getToken = () => {
	return axios.post(intraConf.token_url, {
		client_id: intraConf.client, 
		client_secret: intraConf.secret, 
		grant_type: 'client_credentials', 
		scope: intraConf.scopes
	});
}

const renewToken = () => {
	token = getToken();
}

function authError(authHead) {
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

const rateLimit = async (retryAfter) => {
	const waitTime = await parseInt(retryAfter);
	console.log(`[apiClient] rate limit exceeed. Waiting ${waitTime}s before requesting again`) 
	return new Promise(r => setTimeout(r, 1000 * waitTime));
}

function logError(resp, url, params) {
	console.error(`[apiClient] ${resp.status} - ${resp.status < 500 ? 'Client' : 'Server'}Error`)
	console.error(`\theaders: ${resp.headers}`);
	console.error(`\t${url} with params: ${JSON.stringify(params)}`)
	console.error(`\tresponse: ${JSON.stringify(resp.data)}`)
}

const writeHeader = async (params) => {
	if (token === undefined) {
		renewToken();
	}
	tokenData = (await token).data;
	params.headers = {
		'Authorization': `${tokenData.token_type} ${tokenData.access_token}`
	};
}

const reqAll = async (method, url, params={}) => {
	const ret = await req(method, url, {...params, per_page: 1})
	const maxCount = ret.headers['x-total'];
	const all = [];

	for (let page = 1; page <= Math.ceil(maxCount / 100); page++)
	{
		newUrl = url + (url.includes('?') ? '&' : '?') + 'per_page=100&page=' + page

		let data = (await req(method, newUrl, {
					...params,
			})).data;
			all.push(...data)
	}
	return all;
}

const req = async (method, url, params={}) => {
	await writeHeader(params);
	params.method = params.method == undefined ? method : params.method;
	params.timeout = params.timeout == undefined ? TIMEOUT * 1000 : params.timeout;
	params.url = params.url == undefined ? `${intraConf.endpoint}/${url}` : params.url;	
	
	let tries = 0;
	
	while (tries < TRIESLIMIT) {
		await new Promise(r => setTimeout(r, 50 * tries++));
		
		try {
			const res = await axios(params);
			console.log(`[apiClient] ${res.status} - ${url}`)
			return res
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

module.exports = { req, reqAll }

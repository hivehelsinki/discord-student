module.exports = async (discordClient, intraConf, req, res) => {
	console.log(req.body)

	if (!req.body.cursus_ids.includes(intraConf.active_cursus) 
		|| !req.body.campus_ids.includes(intraConf.active_campus)) {
		res.sendStatus(200);
		return;
	}

	let msgBuilder = discordClient.helpers.msgBuilder;

	discordClient.channels.cache.find(c => c.name === 'announcements')
		.send(msgBuilder.eventMessage(req.body));

	res.sendStatus(200);
}

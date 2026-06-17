module.exports = async (discordClient, intraConf, req, res) => {
	const {
		plant_name,
		location,
		message,
		due_at,
		assignee_discord_id,
		assignee_name,
		alert_type,
		url,
	} = req.body;

	if (!plant_name || typeof plant_name !== 'string') {
		console.log('plant-watering: invalid payload — plant_name is required');
		res.sendStatus(400);
		return;
	}

	const guild = discordClient.config?.guild;
	if (!guild) {
		console.log('SproutSquad Watering Scheduler 🪴: bot is not ready');
		res.sendStatus(503);
		return;
	}

	const channelTarget = intraConf.plantAlertsChannelName;
	const defaultName = 'SproutSquad Watering Scheduler 🪴';
	let channel = null;
	
	if(channelTarget) {
		channel = guild.channels.cache.get(channelTarget);
		if(!channel) {
			channel = await guild.channels.fetch(channelTarget).catch(() => null);
		}
	}

	if(!channel) {
		channel = guild.channels.cache.find(
			c => (c.name === channelTarget || c.name === defaultName) && c.isTextBased());
	}

	if (!channel?.isTextBased()) {
		console.log(`SproutSquad Watering Scheduler 🪴: sendable channel "${channelTarget}" not found (use a text channel or forum post thread ID, not a forum channel ID)`);
		res.sendStatus(503);
		return;
	}

	const msgBuilder = discordClient.helpers.msgBuilder;
	try {
		const sendChannel = channel.partial ? await channel.fetch() : channel;
		if (!sendChannel?.isTextBased()) {
			console.log(`SproutSquad Watering Scheduler 🪴: channel "${channelTarget}" is not sendable`);
			res.sendStatus(503);
			return;
		}
		const mention = msgBuilder.plantWateringMention(assignee_discord_id);
		await sendChannel.send({
			...(mention && { content: mention }),
			embeds: [msgBuilder.plantWateringMessage({
				plant_name,
				location,
				message,
				due_at,
				assignee_name,
				alert_type,
				url,
			})],
		});
		res.sendStatus(200);
	}
	catch (error) {
		console.error("plant-watering: Failed to send message to Discord", error);
		res.sendStatus(500);
	}
}

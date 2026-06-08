const { ChannelType } = require('discord.js');

module.exports = async (discordClient, intraConf, req, res) => {
	const { plant_name, location, message, due_at } = req.body;

	if (!plant_name || typeof plant_name !== 'string') {
		console.log('plant-watering: invalid payload — plant_name is required');
		res.sendStatus(400);
		return;
	}

	const guild = discordClient.config?.guild;
	if (!guild) {
		console.log('plant-watering: bot is not ready');
		res.sendStatus(503);
		return;
	}

	const channelName = intraConf.plantAlertsChannelName || 'plant-watering';
	const channel = guild.channels.cache.find(
		c => c.name === channelName && c.type === ChannelType.GuildText
	);

	if (!channel) {
		console.log(`plant-watering: channel "${channelName}" not found`);
		res.sendStatus(503);
		return;
	}

	const msgBuilder = discordClient.helpers.msgBuilder;
	try {
		await channel.send({ embeds: [msgBuilder.plantWateringMessage({ plant_name, location, message, due_at })] });
		const sendChannel = channel.partial ? await channel.fetch() : channel;
		await sendChannel.send({ embeds: [msgBuilder.plantWateringMessage({ plant_name, location, message, due_at })] });
		res.sendStatus(200);
	}
	catch (error) {
		console.error("plant-watering: Failed to send message to Discord", error);
		res.sendStatus(500);
	}
}
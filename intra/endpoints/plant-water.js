/* 

Module.export turns function public 
async tells Node.js the function requires time and will operate over the network
and should continue running asynchronously while other functions run

*/

module.exports = async (discordClient, intraConf, req, res) => {
	const { plant_name, location, message, due_at } = req.body;

	if (!plant_name || typeof plant_name !== 'string') {
		console.log('plant-watering: invalid payload — plant_name is required');
		res.sendStatus(400);
		return;
	}

	const channelName = intraConf.plantAlertsChannelName || 'plant-watering';
	const channel = discordClient.channels.cache.find(c => c.name === channelName);

	if (!channel) {
		console.log(`plant-watering: channel "${channelName}" not found`);
		res.sendStatus(200);
		return;
	}

	const msgBuilder = discordClient.helpers.msgBuilder;
	channel.send(msgBuilder.plantWateringMessage({ plant_name, location, message, due_at }));
	res.sendStatus(200);
};

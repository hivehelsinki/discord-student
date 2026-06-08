const Discord = require('discord.js');
const dateFormat = require('dateformat');

exports.eventMessage = (data) => {
	const eventEmbed = new Discord.MessageEmbed()
		.setColor('#F57C00')
		.setTitle(data.name)
		.setURL('https://intra.42.fr/')
		.setAuthor('Newspaper Hawker', 'http://clipart-library.com/image_gallery/n1648829.jpg')
		.setDescription(data.description)
		.setThumbnail('http://clipart-library.com/image_gallery/n1648829.jpg')
		.addFields(
			{ name: '🕐 When', value: dateFormat(data.begin_at, "dd/mm/yyyy HH:MM"), inline: true },
			{ name: '🌐 Where', value: data.location ? data.location : "Not specified", inline: true },
			{ name: '👥 People', value: data.max_people ? data.max_people : "Unlimited", inline: true },
		);
	return eventEmbed;
}

exports.plantWateringMessage = (data) => {
	const embed = new Discord.MessageEmbed()
		.setColor('#4CAF50')
		.setTitle(`Water ${data.plant_name}`)
		.setDescription(data.message || 'Time to water this plant!');

	if (data.location) {
		embed.addField('Location', data.location, true);
	}

	if (data.due_at) {
		embed.addField('Due', dateFormat(data.due_at, 'dd/mm/yyyy HH:MM'), true);
	}

	return embed;
};

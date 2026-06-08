const { EmbedBuilder } = require('discord.js');
const dateFormat = require('dateformat');

exports.eventMessage = (data) => {
	return new EmbedBuilder()
		.setColor('#F57C00')
		.setTitle(data.name)
		.setURL('https://intra.42.fr/')
		.setAuthor({ name: 'Newspaper Hawker', iconURL: 'http://clipart-library.com/image_gallery/n1648829.jpg' })
		.setDescription(data.description)
		.setThumbnail('http://clipart-library.com/image_gallery/n1648829.jpg')
		.addFields(
			{ name: '🕐 When', value: dateFormat(data.begin_at, "dd/mm/yyyy HH:MM"), inline: true },
			{ name: '🌐 Where', value: data.location ? data.location : "Not specified", inline: true },
			{ name: '👥 People', value: data.max_people ? data.max_people : "Unlimited", inline: true },
		);
}

exports.plantWateringMessage = (data) => {
	const embed = new EmbedBuilder()
		.setColor('#4CAF50')
		.setTitle(`Water ${data.plant_name}`)
		.setDescription(data.message || 'Time to water this plant!');

	const fields = [];
	if (data.location) {
		fields.push({ name: 'Location', value: data.location, inline: true });
	}
	if (data.due_at) {
		fields.push({ name: 'Due', value: dateFormat(data.due_at, 'dd/mm/yyyy HH:MM'), inline: true });
	}
	if (fields.length) {
		embed.addFields(fields);
	}

	return embed;
};

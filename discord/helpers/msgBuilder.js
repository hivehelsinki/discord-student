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

const PLANT_ALERT_STYLES = {
	your_turn: { color: '#4CAF50', title: (name) => `Your turn: ${name}` },
	overdue: { color: '#E53935', title: (name) => `Overdue: ${name}` },
	reassigned: { color: '#2196F3', title: (name) => `Reassigned: ${name}` },
};

exports.plantWateringMessage = (data) => {
	const style = PLANT_ALERT_STYLES[data.alert_type] ?? PLANT_ALERT_STYLES.your_turn;
	const embed = new EmbedBuilder()
		.setColor(style.color)
		.setTitle(style.title(data.plant_name))
		.setDescription(data.message || 'Time to water this plant!');

	const fields = [];
	if (data.assignee_name) {
		fields.push({ name: 'Assignee', value: data.assignee_name, inline: true });
	}
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

exports.plantWateringMention = (assigneeDiscordId) => {
	if (!assigneeDiscordId || !/^\d{17,20}$/.test(assigneeDiscordId)) {
		return undefined;
	}
	return `<@${assigneeDiscordId}>`;
};

const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');

const client = new Discord.Client();
const config = require('./config.json');

client.config = config; 

client.helpers = {};

fs.readdir('./discord/helpers/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const mod = require(`./helpers/${file}`);
        let modName = file.split('.js')[0];
        client.helpers[modName] = mod;
    });
});

fs.readdir('./discord/events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split('.js')[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.commands = new Enmap();

fs.readdir('./discord/commands/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split('.js')[0];
		console.log(`Attempting to load command ${commandName}`);
		client.commands.set(commandName, props);
	});
});

client.authorizedCommandLocations = (client, message) => {
  let channel = message.channel;
  // We allow commands to be sent through DMs.
  if (channel.type === 'dm' && client.config.pmBotAuthorized === true)
    return true;
  if (channel.type === 'text') {
		// We allow commands to be sent through the commands allowed channels.
		if (client.config.authorizedCommandChannels.includes(channel.name))
			return true;
		// We allow commands to be sent through the commands allowed categories.
		if (channel.parent && client.config.authorizedCommandCategories.includes(channel.parent.name))
      return true;
  }
  return false;
}

client.login(config.token);

module.exports = client;

const { Events } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    if (client.helpers.channelsAuth.authorizedCommandLocations(client, message) === false) return;


    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);

    if (!cmd) return;
    cmd.run(client, message, args);
  },
};
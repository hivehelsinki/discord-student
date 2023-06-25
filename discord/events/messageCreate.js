const { Events, ChannelType } = require('discord.js');
const { prefix } = require('../config.json');

const autoThreadEnabled = (client, message) => {
  const channel = message.channel;
  if (channel.type === ChannelType.GuildText) {
    if (client.config.autoThreadChannels && client.config.autoThreadChannels.includes(channel.id)) return true;
  }
  return false;
};

const startThread = async (message) => {
  await message.startThread({
    name: message.content.substring(0, 99)
  })
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) {
      if (autoThreadEnabled(client, message) === true) {
        await startThread(message);
      }
      return;
    }
    if (client.helpers.channelsAuth.authorizedCommandLocations(client, message) === false) return;


    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);

    if (!cmd) return;
    cmd.run(client, message, args);
  },
};
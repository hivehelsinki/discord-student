module.exports = (client, message) => {
  client.config.guild = client.guilds.cache.last();
  client.config.rulesChannel = client.config.guild.channels.cache.find(channel => channel.name === client.config.rulesChannelName);
};
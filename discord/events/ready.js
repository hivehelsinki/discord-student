module.exports = (client, message) => {
  let guild = client.guilds.cache.values().next().value;
  client.rulesChannel = guild.channels.cache.find(channel => channel.name === client.config.rulesChannel);
  console.log("The bot is ready!");
};
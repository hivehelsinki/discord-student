module.exports = (client, message) => {
  client.config.guild = client.guilds.cache.last();
  client.config.rulesChannel = client.config.guild.channels.cache.find(channel => channel.name === client.config.rulesChannelName);
  
  console.log(`[DISCORD] Logged in as ${client.user.tag}\n \
    \t> ${client.guilds.cache.size} servers\n \
    \t> ${client.channels.cache.size} channels\n \
    \t> ${client.users.cache.size} users\n`);

};
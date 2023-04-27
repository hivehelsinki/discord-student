const config = require('../config.json');

const { ChannelType } = require('discord.js');

exports.InPrivateGroupOnly = (channel) => {
  if (channel.type === ChannelType.DM) {
    channel.send('This command should be run in a private group channel.');
    return false;
  }
  if (!channel.parent || !channel.parent.name.startsWith(config.privateGroupsCategory)) {
    channel.send('This command should be run in a private group channel.');
    return false;
  }
  return true;
};

exports.authorizedCommandLocations = (client, message) => {
  const channel = message.channel;
  // We allow commands to be sent through DMs.
  if (channel.type === ChannelType.DM && client.config.pmBotAuthorized === true) {return true;}

  if (channel.type === ChannelType.GuildText) {
    // We allow commands to be sent through the commands allowed channels.
    if (client.config.authorizedCommandChannels.includes(channel.id)) {return true;}
    // We allow commands to be sent through the commands allowed categories.
    if (channel.parent) {
      if (client.config.authorizedCommandCategories.includes(channel.parent.name)) {return true;}
      if (channel.parent.name.startsWith(client.config.privateGroupsCategory)) {return true;}
    }
  }
  return false;
};

exports.onlyAuthorizeDmOrChannel = (client, message) => {
  const channel = message.channel;
  // We allow commands to be sent through DMs.
  if (channel.type === ChannelType.DM && client.config.pmBotAuthorized === true) {return true;}
  if (channel.type === ChannelType.GuildText) {
    // We allow commands to be sent through the commands allowed channels.
    if (client.config.authorizedCommandChannels.includes(channel.id)) {return true;}
  }
  return false;
};
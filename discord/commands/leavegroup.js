const config = require('../config.json');

exports.help = {
  name: 'leavegroup',
  description: 'Removes you from the group you\'re in.',
  usage: `‣ \`${config.prefix}leavegroup\` : Removes you from the group you\'re launching the command from.
‣ \`${config.prefix}leavegroup help\` : Displays the usage.`,
};

exports.run = (client, message, args) => {
  leaveGroup(client, message, message.channel, args).catch(console.error);
};

const leaveGroup = async (client, message, channel, args) => {
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, channel, exports.help)) return;
  // Must only be sent from a private group channel.
  if (!client.helpers.channelsAuth.InPrivateGroupOnly(channel)) return;

  const members = channel.members.filter(member =>
    member.roles.cache.some(role =>
      [config.studentRole, config.staffRole].includes(role.name)
    )
  );
  if (members.size === 1) {
    channel
      .send(`You are the last person in this channel! Please use \`${config.prefix}deletegroup --sure\` instead, if this group is no longer needed.`)
      .catch(console.error);
    return;
  }

  await channel.permissionOverwrites.delete(message.author);
};

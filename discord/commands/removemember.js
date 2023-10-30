const config = require('../config.json');
const { PermissionsBitField, Collection } = require('discord.js');

exports.help = {
  name: 'removemember',
  description: 'Removes members from the group you\'re in.',
  usage: `‣ \`${config.prefix}removemember help\` : Display the instructions.
‣ \`${config.prefix}removemember login1 [ login2 .. ] --sure\` : Removes one of more members from the private group you're lauching the command from.`,
};

exports.run = (client, message, args) => {
  const channel = message.channel;
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, channel, exports.help)) { return; }
  // Must only be sent from a private group channel.
  if (!client.helpers.channelsAuth.InPrivateGroupOnly(channel)) return;

  if (!message.channel.permissionsFor(message.author).has(PermissionsBitField.Flags.ManageChannels)) {
    const msg = 'This command can only be used by channel owners\n';
    message.channel.send(msg).catch(console.error);
    return;
  }

  if (!args || args.length < 2 || args.pop() !== '--sure') {
    channel.send(exports.help.usage).catch(console.error);
    return;
  }

  console.log(args);

  args.forEach(arg => {
    config.guild.members.fetch({ query: arg, limit: 1 })
      .then(result => {
        let member;
        if (result instanceof Collection)
          member = result.first();
        else
          member = result;
        if (member.id === message.author.id) {
          // TODO:
          const msg = "Wont remove self from group, please use `/leavegroup --sure` instead if this is intentional.";
          message.channel.send(msg).catch(console.error);
          return;
        }
        message.channel.permissionOverwrites.delete(member)
          .catch(error => console.log(`removemember failed unexpectedly: ${error}`));
      }).catch(error => {
        // TODO: Failed to fetch member
        console.log(error);
      });
  });
};

const config = require('../config.json');
const { PermissionsBitField, MessageMentions } = require('discord.js');

exports.help = {
  name: 'removemember',
  description: 'Removes members from the group you\'re in.',
  usage: `‣ \`${config.prefix}removemember help\` : Display the instructions.
‣ \`${config.prefix}removemember login1 | @user1 [ login2 | @user2 ... ] --sure\` : Removes one of more members from the private group you're lauching the command from.`,
};

exports.run = (client, message, args) => {
  removeMembers(client, message, message.channel, args)
    .catch(console.error);
};

const removeMembers = async (client, message, channel, args) => {
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, channel, exports.help)) return;
  // Must only be sent from a private group channel.
  if (!client.helpers.channelsAuth.InPrivateGroupOnly(channel)) return;

  if (!channel
    .permissionsFor(message.author)
    .has(PermissionsBitField.Flags.ManageChannels)) {
    channel.send(`This command can only be used by channel owners\n`)
      .catch(console.error);
    return;
  }

  if (!args || args.length < 2 || args.pop() !== '--sure') {
    channel.send(exports.help.usage).catch(console.error);
    return;
  }

  let members = await Promise.all(
    args.filter(arg => !MessageMentions.UsersPattern.test(arg))
      .map(async arg => {
        const member = await client.helpers.shared.fetchMember(arg);
        if (!member) {
          channel.send(`Unknown user '${arg}'!`).catch(console.error);
          return null;
        }
        return member;
      })
  );
  members = members.concat([...message.mentions.members.values()]);
  const unique_members = [...new Set(members.filter(m => m))];

  for (const member of unique_members) {
    if (member.id === message.author.id) {
      channel
        .send(`Wont remove self from group, please use \`/leavegroup --sure\` instead if this is intentional.`)
        .catch(console.error);
      return;
    }
    if (!channel.permissionOverwrites.resolve(member.id)) {
      channel
        .send(`${member} not was not found in this channel!`)
        .catch(console.error);
      return;
    }
    await channel.permissionOverwrites.delete(member);
  }
};

const config = require('../config.json');
const { PermissionsBitField, Collection, GuildMember } = require('discord.js');

exports.help = {
  name: 'removemember',
  description: 'Removes members from the group you\'re in.',
  usage: `‣ \`${config.prefix}removemember help\` : Display the instructions.
‣ \`${config.prefix}removemember login1 [ login2 .. ] --sure\` : Removes one of more members from the private group you're lauching the command from.`,
};

exports.run = (client, message, args) => {
  const channel = message.channel;
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, channel, exports.help)) return;
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

  removeMembers(message, args).catch(console.error);
};

const removeMembers = async (message, args) => {
  let members = await Promise.all(args.map(async arg => {
    const member = await fetchMember(arg);
    if (!member) {
      const msg = `Unknown user '${arg}'!`;
      message.channel.send(msg).catch(console.error);
      return null;
    }
    return member;
  }));

  const unique_members = [...new Set(members)];

  for (const member of unique_members) {
    if (member.id === message.author.id) {
      const msg = "Wont remove self from group, please use `/leavegroup --sure` instead if this is intentional.";
      message.channel.send(msg).catch(console.error);
      return;
    }
    if (!message.channel.permissionOverwrites.cache.has(member.id)) {
      const msg = `${member} not was not found in this channel!`;
      message.channel.send(msg).catch(console.error);
      return;
    }
    await message.channel.permissionOverwrites.delete(member);
  }
};

const fetchMember = async login => {
  const result = await config.guild.members.fetch({ query: login });
  if (result instanceof GuildMember)
    return result;
  if (!(result instanceof Collection))
    throw "Unexpected type";
  if (result.size === 0)
    return null;
  if (result.size === 1)
    return result.first();
  return result.find(member => member.displayName.split(' ')[0] === login);
};

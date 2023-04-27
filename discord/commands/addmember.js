const config = require('../config.json');
const Discord = require('discord.js');

exports.help = {
  name: 'addmember',
  description: 'Adds a member to your private group.',
  usage: `‣ \`${config.prefix}addmember help\` : Display the instructions.
‣ \`${config.prefix}addmember login1 [login2 login3 etc]\` : Adds the user in the group you're launching the command from (only with login, no mention).`,
};

async function collectArgsData(client, newLogins, message) {
  const usersData = { users: [], logins_list: [] };
  await Promise.all(newLogins.map(async (element) => {
    await client.helpers.shared.addToPrivateGroupData(client, usersData, message.author, element);
  }));
  return usersData;
}

exports.run = (client, message, args) => {
  const channel = message.channel;
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, channel, exports.help)) {return;}
  // Must only be sent from a private group channel.
  if (!client.helpers.channelsAuth.InPrivateGroupOnly(channel)) return;

  // TODO: Did it actually ever worked?!? arg are not mentionable since they are not in the channel.
  const newLogins = args.filter(arg => !arg.type === 'MENTIONABLE');
  const currentUsers = channel.permissionOverwrites;
  const cad = collectArgsData;
  cad(client, newLogins, message).then(res => {
    const usersData = res;
    usersData.users.forEach((user, index, object) => {
      if (currentUsers.has(user.id)) {object.splice(index, 1);}
    });
    if (usersData.users.length == 0) {
      const msg = 'You must specify at least one login. Make sure it\'s spelled correctly, without an `@`, and that the student is not already in the group.\n';
      message.channel.send(msg + exports.help.usage).catch(console.error);
      return;
    }
    let welcome_pm_message = 'Welcome to the private group ';
    usersData.users.forEach(user => {
      channel.permissionOverwrites.edit(user.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        MANAGE_CHANNELS: false,
        MANAGE_ROLES: false,
        MANAGE_WEBHOOKS: false,
        CREATE_INSTANT_INVITE: false,
        MANAGE_MESSAGES: false,
        SEND_TTS_MESSAGES: false,
      }).catch(console.error);
      welcome_pm_message += `${user.toString()} `;
    });
    channel.send(welcome_pm_message + '👋').catch(console.error);
  });
};
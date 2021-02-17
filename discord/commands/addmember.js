const config = require("../config.json");
const Discord = require('discord.js');

exports.help = {
  name: "addmember",
  description: "Adds a member to your private group.",
  usage: `‣ \`${config.prefix}addmember help\` : Display the instructions.
‣ \`${config.prefix}addmember login1 [login2 login3 etc]\` : Adds the user in the group you're launching the command from (only with login, no mention).`
}

async function collectArgsData(client, newLogins, message) {
  let usersData = {users: [], logins_list: []};
  await Promise.all(newLogins.map(async (element) => {
    await client.helpers.shared.addToPrivateGroupData(client, usersData, message.author, element);
  }));
  return usersData;
};


exports.run = (client, message, args) => {
  let channel = message.channel;
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, channel, exports.help))
    return;
  // Must only be sent from a private group channel.
  if (!client.helpers.channelsAuth.InPrivateGroupOnly(channel)) return;  
  
  let newLogins = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
  let currentUsers = channel.permissionOverwrites;
  let cad = collectArgsData;
  cad(client, newLogins, message).then( res => {
    let usersData = res;
    usersData.users.forEach((user, index, object) => {
      if (currentUsers.has(user.id))
        object.splice(index, 1);
    });
    if (usersData.users.length == 0) {
      msg = `You must specify at least one login. Make sure it's spelled correctly, without an \`@\`, and that the student is not already in the group.\n`;
      message.channel.send(msg + exports.help.usage).catch(console.error);
      return;
    }
    let welcome_pm_message = "Welcome to the private group ";
    usersData.users.forEach(user => {
      channel.updateOverwrite(user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, MANAGE_CHANNELS: false, MANAGE_ROLES: false,
                                         MANAGE_WEBHOOKS: false, CREATE_INSTANT_INVITE: false, MANAGE_MESSAGES: false, SEND_TTS_MESSAGES: false }).catch(console.error);
      welcome_pm_message += `${user.toString()} `;
    });
    channel.send(welcome_pm_message + "👋").catch(console.error); 
  });
}
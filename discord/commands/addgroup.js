const config = require("../config.json");
const Discord = require('discord.js');

exports.help = {
  name: "addgroup",
  description: "Creates a private group channel with the members specified as arguments.",
  usage: `‣ \`${config.prefix}addgroup help\` : Display the instructions.
‣ \`${config.prefix}addgroup @login1 login2 [@login3 etc]\` : Creates a private channel with you and the members specified as arguments (logins and/or mentions).`
}

const welcome_pm_message = `Welcome to your own **private channel**! 👋

If you wish, you can already update its name in the **settings**.
If you want to **add** other members manually, run the following command:
\`\`\`
/addmember login1 login2
\`\`\`
Replace the logins with the members you want to add - Discord won't automatically suggest them to you as they are not in the channel, make sure you write their login properly.
`;

async function collectArgsData(client, argsWithoutMentions, message) {
  let usersData = {users: [message.author], logins_list: []};
  let author_member = client.config.guild.member(message.author);
  let author_login = author_member.nickname ? author_member.nickname.split(" ")[0] : message.author.username.split(" ")[0];
  usersData.logins_list.push(author_login)
  await Promise.all(argsWithoutMentions.map(async (element) => {
    await client.helpers.shared.addToPrivateGroupData(client, usersData, message.author, element);
  }));
  if (message.mentions && message.mentions.members) {
    await Promise.all(message.mentions.members.map(async (element) => {
      await client.helpers.shared.addToPrivateGroupData(client, usersData, message.author, element);
    }));
  }
  return usersData;
};

exports.run = (client, message, args) => {
  // We only allow this command to be run by DM or command channels (not categories).
	if (!client.helpers.channelsAuth.onlyAuthorizeDmOrChannel(client, message)) return;
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, message.channel, exports.help))
    return;

  let argsWithoutMentions = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
  let cad = collectArgsData;

  cad(client, argsWithoutMentions, message).then( res => {
    let usersData = res;
    if (usersData.users.length <= 1) {
      message.channel.send(exports.help.usage).catch(console.error);
      return;
    }
    usersData.logins_list = usersData.logins_list.filter((x, i) => i === usersData.logins_list.indexOf(x))
    usersData.logins_list.sort();

    let channel_name = usersData.logins_list.join('_');
    channel_name = (channel_name.length > 100) ? channel_name.substr(0, 97) + '...' : channel_name;

    const parent_category = client.config.guild.channels.cache.find(cat=> cat.name === client.config.privateGroupsCategory);
    if (typeof parent_category === 'undefined' || !parent_category) {
      message.channel.send(`Could not find the \`${client.config.privateGroupsCategory}\` category, please contact an administrator.`).catch(console.error);
      return;
    }

    let permissionOverwrites = [];
    // We deny every role to view this channel.
    client.config.guild.roles.cache.forEach(role => {
      permissionOverwrites.push({ id: role.id, type: "role", deny: ['VIEW_CHANNEL']})
    });
    // We allow author and every mentioned users to view this channel.
    usersData.users.forEach(user => {
      permissionOverwrites.push({ id: user.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                                deny: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'CREATE_INSTANT_INVITE', 'MANAGE_MESSAGES', 'SEND_TTS_MESSAGES'] });
    });
    // Create channel with permissions.
    let req = client.config.guild.channels.create(channel_name, {
      type: 'text',
      parent: parent_category,
      permissionOverwrites: permissionOverwrites
    });

    req.then(channel => {
      channel.send(welcome_pm_message).catch(console.error);
    }).catch(error => { console.log(error); });
  });
}

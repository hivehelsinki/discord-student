const { Events } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    console.log(1);
    if (message.author.bot) return;
    console.log(2);
    if (message.content.indexOf(prefix) !== 0) return;
    console.log(3);
    if (client.helpers.channelsAuth.authorizedCommandLocations(client, message) === false) return;


    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    console.log(cmd);

    if (!cmd) return;
    cmd.run(client, message, args);
    console.log(message.content);
  },
};


// module.exports = (client, message) => {
//   if (message.author.bot) return;

//   if (message.content.indexOf(client.config.prefix) !== 0) return;

//   // Ignore messages that are not send from authorized channels or categories.
//   if (client.helpers.channelsAuth.authorizedCommandLocations(client, message) === false) return;

//   const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
//   const command = args.shift().toLowerCase();

//   const cmd = client.commands.get(command);

//   if (!cmd) return;

//   cmd.run(client, message, args);
// };

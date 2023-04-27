const config = require('../config.json');

exports.help = {
  name: 'deletegroup',
  description: 'Deletes a private group you\'re in.',
  usage: `‣ \`${config.prefix}deletegroup help\` : Display the instructions.
‣ \`${config.prefix}deletegroup --sure\` : Deletes the private group you're lauching the command from.`,
};

exports.run = (client, message, args) => {
  const channel = message.channel;
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, channel, exports.help)) {return;}
  // Must only be sent from a private group channel.
  if (!client.helpers.channelsAuth.InPrivateGroupOnly(channel)) return;

  if (!args || args.length == 0 || args[0] !== '--sure') {
    channel.send(exports.help.usage).catch(console.error);
    return;
  }
  channel.delete();
};
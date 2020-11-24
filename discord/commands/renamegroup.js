const config = require("../config.json");

exports.help = {
  name: "renamegroup",
  description: "Renames your private group.",
  usage: `‣ \`${config.prefix}renamegroup help\` : Display the instructions.
‣ \`${config.prefix}renamegroup my-new-name\` : Renames the group you're writing the command from (100 chars max - only twice every 10 minutes).`
}

exports.run = (client, message, args) => {
  // Returns documentation.
  if (client.helpers.shared.helpArg(args, message.channel, exports.help))
    return;
  let channel = message.channel;

  // Must only be sent from a private group channel.
  if (!client.helpers.channelsAuth.InPrivateGroupOnly(channel)) return;

  if (!args || args.length == 0) {
    channel.send(exports.help.usage).catch(console.error);
    return;
  }

  let channel_name = args.join('_');
  if (channel_name.length > 100) {
    channel.send('The channel name is too long! (100 characters max)').catch(console.error);
    return;
  }
  channel.setName(channel_name.toLowerCase().trim()).catch(console.error);
  channel.send("You can only do this action twice every 10 minutes.").catch(console.error);
}
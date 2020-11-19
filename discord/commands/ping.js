const config = require("../config.json");

exports.help = {
  name: "ping",
  description: "A command that responds pong.",
	usage: `‣ \`${config.prefix}ping\` : Displays pong.
‣ \`${config.prefix}ping help\` : Displays the usage.`
}

exports.run = (client, message, args) => {
	if (client.helpers.commandShared.helpArg(args, message.channel, exports.help))
		return;
	message.channel.send("pong!").catch(console.error);
}
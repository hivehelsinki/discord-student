const config = require("../config.json");

exports.help = {
  name: "ping",
  description: "A command that responds pong.",
	usage: `‣ \`${config.prefix}ping\` : Displays pong.
‣ \`${config.prefix}ping help\` : Displays the usage.`
}

exports.run = (client, message, args) => {
	// We only allow this command to be run by DM or command channels (not categories).
	if (!client.helpers.channelsAuth.onlyAuthorizeDmOrChannel(client, message)) return;
	// Returns documentation.
	if (client.helpers.shared.helpArg(args, message.channel, exports.help))
		return;
	message.channel.send("pong!").catch(console.error);
}
exports.help = {
  name: "ping",
  description: "A command that responds pong.",
	usage: `‣ \`/ping\` : Displays pong.
‣ \`/ping help\` : Displays the usage.`
}

exports.run = (client, message, args) => {
	if (client.helpers.commandShared.helpArg(args, message.channel, exports.help))
		return;
	message.channel.send("pong!").catch(console.error);
}
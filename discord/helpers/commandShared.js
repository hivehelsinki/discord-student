exports.helpArg = (args, channel, help) => {
  // Sends the description and usage of the function.
  if (args.length > 0 && args[0] === 'help') {
		channel.send(`${help.description}\n${help.usage}`).catch(console.error);
		return true;
  }
  return false;
}
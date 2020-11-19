const config = require("../config.json");

exports.help = {
  name: "help",
  description: "The simple command you're using right now. Displays a small help documentation.",
  usage: `‣ \`${config.prefix}help\``
}

exports.run = (client, message, args) => {  
  msg = `:purple_circle: **RULES AND USAGE OF THE DISCORD SERVER**\n
You can find the rules and some features on the ${client.rulesChannel} channel
  
:purple_circle: **AVAILABLE COMMANDS**\n`;
  
  client.commands.forEach(command => {
    if (!command.help || typeof command.help === 'undefined')
      return;  
    msg += `\n**${command.help.name}**:\n${command.help.description}\n`;
    msg += `${command.help.usage}\n`;
  });
  message.channel.send(msg).catch(console.error);
}
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
  ],
});


client.config = config;
client.commands = new Collection();
client.helpers = {};


fs.readdir('./discord/helpers/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const mod = require(`./helpers/${file}`);
    const modName = file.split('.js')[0];
    client.helpers[modName] = mod;
  });
});

client.on('error', (err) => {
  console.log(err.message);
});

const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

fs.readdir('./discord/commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const props = require(`./commands/${file}`);
    const commandName = file.split('.js')[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.login(config.token);

module.exports = client;

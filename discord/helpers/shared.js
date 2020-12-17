const config = require("../config.json");
const axios = require('axios');

exports.helpArg = (args, channel, help) => {
  // Sends the description and usage of the function.
  if (args.length > 0 && args[0] === 'help') {
		channel.send(`${help.description}\n${help.usage}`).catch(console.error);
		return true;
  }
  return false;
}

exports.addToPrivateGroupData = async function (client, usersData, author, element) {
  let member = null;
  let login = null;
  if (typeof element === 'string') {
    try {
      let res = await client.config.guild.members.fetch({query: element, limit: 1});
      if (res.size == 1) {
        member = res.last();
        if (member.roles.cache.some(role => [config.studentRole, config.staffRole].includes(role.name))) {
          if (member.user.id != author.id && !(usersData.users.includes(member))) {
            login = element.split(" ")[0];
            usersData.users.push(member.user);
            usersData.logins_list.push(login);
          }
        }
      }
    } catch(error) { console.log(error); }
  } else {
    if (element.roles.cache.some(role => [config.studentRole, config.staffRole].includes(role.name))) {
      if (element.user.id != author.id && !(usersData.users.includes(element))) {
        try {
          login = element.nickname ? element.nickname.split(" ")[0] : element.user.username.split(" ")[0];
          usersData.users.push(element.user);
          usersData.logins_list.push(login);
        } catch(error) { console.log(error); }
      }
    }
  }
  return usersData;
}

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

exports.getLoginFromId = async function (user) {
  return axios.get(`https://discord.hive.fi/api/members/${user.id}`);
}

exports.getIdFromLogin = async function (login) {
  return axios.get(`https://discord.hive.fi/api/members/${login}`);
}

exports.addToPrivateGroupData = async function (client, usersData, author, element) {
  let login = null;
  let member = null;
  if (typeof element === 'string') {
    await exports.getIdFromLogin(element).then(res => {
      member = config.guild.members.cache.get(res.data.discord_id);
      if (member.roles.cache.some(role => [config.studentRole, "staff"].includes(role.name))) {
        if (member.user.id != author.id && !(usersData.users.includes(member))) {
          usersData.users.push(member.user);
          usersData.logins_list.push(res.data.login);
        }
      }
    }).catch(error => { console.log(error); });
  } else {
    if (element.roles.cache.some(role => [config.studentRole, "staff"].includes(role.name))) {
      if (element.user.id != author.id && !(usersData.users.includes(element))) {
        await exports.getLoginFromId(element).then(res => {
          usersData.users.push(element.user);
          usersData.logins_list.push(res.data.login)
        }).catch(error => { console.log(error); });
      }
    }
  }
  return usersData;
}
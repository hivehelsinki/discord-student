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

exports.getLoginById = function (user) {
  return axios.get(`https://discord.hive.fi/api/members/${user.id}`);
}

exports.getIdByLogin = function (login) {
  return axios.get(`https://discord.hive.fi/api/members/${login}`);
}

exports.addToPrivateGroupData = async function (client, usersData, author, element) {
  let member = null;
  if (typeof element === 'string') {
    try {
      const resp = await exports.getIdByLogin(element);
      member = config.guild.members.cache.get(resp.data.discord_id);
      if (member.roles.cache.some(role => [config.studentRole, config.staffRole].includes(role.name))) {
        if (member.user.id != author.id && !(usersData.users.includes(member))) {
          usersData.users.push(member.user);
          usersData.logins_list.push(resp.data.login);
        }
      }
    } catch(error) {
      if (error.response) {
        console.log(`Error while getting user (${error.response.status}): ${error.response.data.error}`);
      } else {
        console.log(error);
      }
    }
  } else {
    if (element.roles.cache.some(role => [config.studentRole, config.stafftRole].includes(role.name))) {
      if (element.user.id != author.id && !(usersData.users.includes(element))) {
        try {
          const res = await exports.getLoginById(element);
          usersData.users.push(element.user);
          usersData.logins_list.push(res.data.login);
        } catch(error) {
          if (error.response) {
            console.log(`Error while getting user (${error.response.status}): ${error.response.data.error}`);
          } else {
            console.log(error);
          }
        }
      }
    }
  }
  return usersData;
}
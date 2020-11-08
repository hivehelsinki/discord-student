# Hive students' discord bot

This is Hive Helsinki nodejs-based discord bot built to enchance studying environment and promote community interactions. It is maintained by Hive Helsinki students. 

# Structure

It consists of two main parts: discord bot itself and everything (server and API client) related to interactions with intranet. 
  - [discord](https://github.com/hivehelsinki/discord-student/tree/main/discord)
  - [intra](https://github.com/hivehelsinki/discord-student/tree/main/intra)

# Discord

An entry point is [client.js](https://github.com/hivehelsinki/discord-student/blob/main/discord/client.js). It imports everything from these three folders: 

 #### 1. [helpers](https://github.com/hivehelsinki/discord-student/tree/main/discord/helpers) (everything that can be used and reused for practical purposes, e.g. message builder which allows to simply create discord message object)
Every helper is exported and available in client object in `client.helpers`. It will be named exactly as a file, e.g. `msgBuilder.js` will be available via `client.helpers.msgBuilder`. To create new helper you simply need to create a new file with desired name and export everything you want to exports module of this file. 
 #### 2. [events](https://github.com/hivehelsinki/discord-student/tree/main/discord/events) (discord events handlers, e.g. new message, reactions to message, etc.)
 All the events are exported and attached to client. Events files should be named **exactly** after discord event, e.g. `message.js`. If you want to modify or add a new behaviour to an existing event, you should not create a new file, but instead change an existing one. 
 #### 3. [commands](https://github.com/hivehelsinki/discord-student/tree/main/discord/commands) (bot commands, e.g. ping) 
Every command is exported and available in client object in `client.commands` enmap. In `message` event every message is checked for a command and if message includes a command, it runs an appropriate command code. Therefore, every command file should have `run` function in exports module which takes 3 arguments: client, message, and args. And, as always, to make the process easy an automated, every command file is named after the command, e.g. `ping` command named `ping.js`.

---
**NOTE: Naming convention is expecially important to allow smooth automated import process**

---
If you want to learn more, you can take a look at [official documentation](https://discord.js.org/#/docs/main/stable/general/welcome) or at [an idiots guide](https://anidiots.guide/) which was mainly used to build the initial base of the bot. 
# Intra

There are two parts to intra module. It is `apiClient.js` and `server.js`. The latter is an endpoint server for intra webhooks and the former is a basic client to make request to intra api. 

#### [apiClient](https://github.com/hivehelsinki/discord-student/blob/main/intra/apiClient.js)
In order to use api client, you need to specify your credentials in config file. After that, you can make a request simply using intraRequest function from apiClient which behaviour is similar to [axios request](https://github.com/axios/axios#axios-api) expect that you have to spevify method as a first variable. The client will take care of authentication and basic error handling. 
Example of usage: 
```
const ic = require('./apiClient.js');

ic.intraRequest("get", "users", {params: {'filter[id]': 24007}})
	.then(res => {
	console.log(`statusCode: ${res.status}`)
	console.log(res.data)
})
```

#### server
--- 
**Endpoints cannot be configured by students. Only by staff members.** 

--- 
However, in order to set up a new endpoint, you have to create a file named exactly as endpoint url in [endpoints](https://github.com/hivehelsinki/discord-student/blob/main/intra/endpoints/) folder. This endpoint main exports module should be a function which receives 4 parameters: discordClient (to send messages and interact with discord server), intraConf (in case you need to check on configuration file *note: should be changed to intra client which will have config in it*), req, and res. 
You can check an example in [intra-events.js](https://github.com/hivehelsinki/discord-student/blob/main/intra/endpoints/intra-events.js). This endpoint receives information about every event created in the intra and posts information to announcements channel.

# AFTERWORD
This bot is on early stage of its development. We hope to see it flourish driven by creative force of the Hive Helsinki student community. It is up to you to help it grow, use it to empower the learning spirit, to strengthen others students motivation to study, to enable active exchange of knowledge and connections inside our cozy hive. 
> A journey of a thousand miles begins with a single step

and we welcome you to make this first step and make your first pull request today. 

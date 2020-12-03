<h1 align="center"><code>Discord-Student</code></h1>

<div align="center">
  <sub>Created by <a href="https://github.com/d15ky">Oleksii Martynovskyi (disky)</a>, <a href="https://github.com/plantran">Paula Lantran (ablette)</a> and <a href="https://github.com/jgengo">Jordane Gengo (titus)</a></sub>
</div>
<div align="center">
  <sub>From <a href="https://hive.fi">Hive Helsinki</a></sub>
  <br />
</div>

# Description
<div align="center">
  <a href="https://github.com/hivehelsinki/discord-student/wiki">wiki</a> | <a href="https://github.com/hivehelsinki/discord-student/projects/1">kanban</a> | ... | etc.
</div>
<br />


This is Hive Helsinki’s nodejs-based discord bot built to enhance the studying environment and to promote community interactions. It is maintained by Hive Helsinki’s students. 

<br><br>

# 1. Structure

It consists of two main parts: the Discord bot itself and everything related to interactions with the 42 intranet (server and API client).

```sh
├── discord # discord bot
│   ├── client.js # discord client
│   ├── commands # every single file in this folder is turned as a bot command
│   ├── config-example.json #config example
│   ├── events # every single file in this dir is a discord event listener
│   └── helpers # every helper you may need to make your code cleaner / DRY
├── intra
│   ├── apiClient.js # 42 API client
│   ├── config-example.json # config example
│   ├── endpoints # for webhooks
│   └── server.js # express server (for the webhook)

```

<br><br>

# 2. Discord

The main entrypoint is [client.js](https://github.com/hivehelsinki/discord-student/blob/main/discord/client.js). It imports everything from these three folders: 

**2.1. [helpers](https://github.com/hivehelsinki/discord-student/tree/main/discord/helpers) (everything that can be used and reused for practical purposes, e.g. message builder which allows to simply create discord message object)**

Every helper is exported and available in client object in `client.helpers`. It will be named exactly as a file, e.g. `msgBuilder.js` will be available via `client.helpers.msgBuilder`. To create a new helper you simply need to create a new file with the desired name and export everything you want to the exports module of this file. 

<br />

**2.2. [events](https://github.com/hivehelsinki/discord-student/tree/main/discord/events) (discord events handlers, e.g. new messages, reactions to messages, etc.)**

All the events are exported and attached to the client. The event’s files should be named **exactly** after the discord event, e.g. `message.js`. If you want to modify or add a new behaviour to an existing event, you should not create a new file, but instead change an existing one. 

<br />

**2.3. [commands](https://github.com/hivehelsinki/discord-student/tree/main/discord/commands) (bot commands, e.g. ping)**
Every command is exported and available in the client objects in `client.commands` enmap. In the `message` event every message is checked for a command and if message includes a command, it runs the appropriate command code. Therefore, every command file should have a `run` function in the exports module which takes 3 arguments: client, message, and args. And, as always, to make the process easy and automated, every command file is named after the command, e.g. `ping` command named `ping.js`.

<br />

---
**NOTE: Naming convention is especially important to allow smooth automated import process**

---
If you want to learn more, you can take a look at [official documentation](https://discord.js.org/#/docs/main/stable/general/welcome) or at [an idiots guide](https://anidiots.guide/) which was mainly used to build the initial base of the bot. 

<br><br>

# 3. Intra

There are two parts to the intra module. `apiClient.js` and `server.js`. The latter is an endpoint server for intra webhooks and the former is a basic client to make requests to intra API. 

<br />

**3.1. [apiClient](https://github.com/hivehelsinki/discord-student/blob/main/intra/apiClient.js)**
In order to use the API client, you need to specify your credentials in the config file. After that, you can make a request simply by using the intraRequest function from the apiClient which behaviour is similar to [axios request](https://github.com/axios/axios#axios-api) except that you have to specify a method as a first variable. The client will take care of the authentication and basic error handling. 

You can find more information about the 42 intra API: [here](https://api.intra.42.fr/apidoc)

**Example of usage:**
```javascript
const ic = require('./apiClient.js');

ic.req("get", "users", {params: {'filter[id]': 24007}})
	.then(res => {
	console.log(`statusCode: ${res.status}`)
	console.log(res.data)
})
```

If you are looking to get a paginated collection you may use
```javascript
const ic = require('./apiClient.js');

ic.reqAll("get", "users", {params: {'filter[staff?]': false, 'filter[primary_campus_id]': 13}})
	.then( usersArray => {
		console.log(`statusCode: ${usersArray}`)
	})
```
<br /><br />

**3.2. [server](https://github.com/hivehelsinki/discord-student/blob/main/intra/server.js)**
 
**⚠️ Endpoints cannot be configured by students. Only by staff members. ⚠️** 

However, in order to set up a new endpoint, you have to create a file named exactly as the endpoint url in [endpoints](https://github.com/hivehelsinki/discord-student/blob/main/intra/endpoints/) folder. This endpoint main exports module should be a function which receives 4 parameters: discordClient (to send messages and interact with discord server), intraConf (in case you need to check on configuration file *note: should be changed to intra client which will have config in it*), req, and res. 

You can check an example in [intra-events.js](https://github.com/hivehelsinki/discord-student/blob/main/intra/endpoints/intra-events.js). This endpoint receives information about every event created in the intra and posts information to announcements channel on discord.

<br><br>

# 4. Afterword
This bot is in the early stage of its development. We hope to see it flourish, driven by the creative force of the Hive Helsinki student community. It is up to you to help it grow, use it to empower the learning spirit, to strengthen other student’s motivation to study, to enable active exchange of knowledge and to create connections inside our cozy hive. 
> A journey of a thousand miles begins with a single step

We welcome you to make this first step and make your first pull request today. 

<br><br>

# 5. Contributors

(add your name above if you contribute and a link to your github)



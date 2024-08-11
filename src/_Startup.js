// Imports \\
const { Client, Partials, REST, Routes } = require("discord.js"); // Discord.JS
const { SlashCommands } = require("./Commands.js"); // Commands.JS
require('dotenv').config(); // DOTENV



// Client Instantiation \\
const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "GuildMembers", "DirectMessages", "MessageContent", "GuildEmojisAndStickers"],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});



// Register All Events \\
require("./Events.js").forEach(event => {
    if(event.name === "ready" && process.argv.includes("--debug"))
        return client.once(event.name, (...args) => event.execute(...args, "--debug"));

    if (event.once) { client.once(event.name, (...args) => event.execute(...args)); } // Event ONCE

    else { client.on(event.name, (...args) => event.execute(...args)); } // Any Event
});



// Register all Slash Commands \\
(async () => {
    try
    {
        console.log("Refreshing application commands..");

        await new REST({ version: '10' }).setToken(process.env.TOKEN).put
        (
            Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID), { body: SlashCommands.map(o => o.toJSON()) }
        )

        console.log("Application commands have been refreshed!");
    }
    catch (err) { console.error(err) }
})();


// Client Login \\
client.login(process.env.TOKEN);
const { EmbedBuilder, Colors } = require("discord.js");
const { CommandHandler } = require("./Commands.js");
const { LunarTools } = require("./out_source/LunarTools.js");
const { LunarAPI } = require("./out_source/LunarAPI.js");


let Role_StarGazers, Role_CelestialCartographer;
const OnReady =
{
    name: 'ready',
    once: true,
    async execute(client, ...args)
    {
        console.log(`Logged in as ${client.user.tag} !!`);


        // Get first guild (LE) and assign roles to variables for 'OnMessageReactionAdd' & 'OnMessageReactionRemove'
        let guild = client.guilds.cache.first();
        if(guild)
        {
            Role_StarGazers = guild.roles.cache.find(role => role.name === "Star Gazers");
            Role_CelestialCartographer = guild.roles.cache.find(role => role.name === "Celestial Cartographer");
        }



        // Create timeout for Twitch live streamer check \\
        let selene = new LunarTools(client);
        let _LunarAPI = new LunarAPI();

        if(!args.includes("--debug"))
        {
            setTimeout(async () => {
                try
                {
                    setInterval(async () => {
                        let streamers = await _LunarAPI.GetLiveStreamers();
    
                        streamers.forEach(streamer => {
                            if(new Date().getMinutes() - new Date(streamer.started_at).getMinutes() > 3)
                                return console.log(`Streamer was already active. { ${streamer.user_name} }`)
                            
                            let tmpEmbed = new EmbedBuilder()
                                .setColor(Colors.DarkPurple)
                                .setTitle(`${streamer.title}`)
                                .setDescription(`**(https://twitch.tv/${streamer.user_name})** is now live on Twitch!`)
                                .addFields({ name: "Game", value: streamer.game_name})
                                .setFooter({text: "𝐿𝓊𝓃𝒶𝓇 𝐸𝒸𝓁𝒾𝓅𝓈𝑒™"})
                                .setTimestamp();
    
                            client.guilds.cache.first().channels.cache.get("1236838822885593228").send({ content: `<@&1236890645545746452>`, embeds: [tmpEmbed] })
                        })
                    }, 10000)
                }
                catch (err) { console.error(err) }
            }, 1000);
        }

        await require("util").promisify(setTimeout)(1000); selene.DisableDebugMode(); // Wait for Github to update before fetching last commit message.
        
        if(args.includes("--debug"))
            return selene.EnableDebugMode();

        else if (selene.LastCommit.includes("hotfix"))
            return selene.SendDebugMessage(selene.LastCommit);

        else if (selene.LastCommit.includes("NoAlert"))
            return console.log("Selene has started silently.");

        else if (selene.LastCommit.includes("Restart"))
            return console.log("Selene has restarted.");

        else if(selene.LastCommit !== "")
        {
            return selene.SendDebugMessage
            (
                "Selene is ready, please review the changelog below for updates.\n\n" + 
                "***CHANGELOG:***\n" +
                `Commit Message: *${selene.LastCommit}*\n` +
                `Current Selene Version: *v2.2*\n` +
                "Important Selene Updates: *Selene double checks the time that a user started their stream to ensure it was started recently, if the start time is past 3 minutes and she restarts, she will no longer send another message.*"
            )
        }
        
        else return selene.SendDebugMessage("An unknown error has occured.. how'd this happen?");
    }
}



const OnMessageReactionAdd =
{
    name: 'messageReactionAdd',
    async execute(reaction, user)
    {
        if(reaction.message.channel.name != "roles") return;

        let ServerMember = reaction.message.guild.members.cache.get(user.id);
        
        let RoleTernaryEmbed = new EmbedBuilder()
            .setColor(Colors.DarkBlue)
            .setTitle("You received a new role!")
            .setFooter({text: "𝐿𝓊𝓃𝒶𝓇 𝐸𝒸𝓁𝒾𝓅𝓈𝑒™"})
            .setTimestamp()
        
        switch(reaction.emoji.name)
        {
            // CASE: Star Gazers \\
            case "✨":
                await ServerMember.roles.add(Role_StarGazers);

                RoleTernaryEmbed.setDescription("You obtained the Star Gazers role!")
                user.send({embeds: [RoleTernaryEmbed]})

                break;

            // CASE: Celestial Cartographers \\
            case "🗺️":
                await ServerMember.roles.add(Role_CelestialCartographer);

                RoleTernaryEmbed.setDescription("You obtained the Celestial Cartographers role!")
                user.send({embeds: [RoleTernaryEmbed]})

                break;

            // CASE: Default | NONE \\
            default: break;
        }
    }
}



const OnMessageReactionRemove =
{
    name: 'messageReactionRemove',
    async execute(reaction, user)
    {
        if(reaction.message.channel.name != "roles") return;

        let ServerMember = reaction.message.guild.members.cache.get(user.id);
        
        let RoleTernaryEmbed = new EmbedBuilder()
            .setColor(Colors.DarkBlue)
            .setTitle("You lost a role!")
            .setFooter({text: "𝐿𝓊𝓃𝒶𝓇 𝐸𝒸𝓁𝒾𝓅𝓈𝑒™"})
            .setTimestamp()
        
        switch(reaction.emoji.name)
        {
            // CASE: Star Gazers \\
            case "✨":
                await ServerMember.roles.remove(Role_StarGazers);

                RoleTernaryEmbed.setDescription("You lost the Star Gazers role!")
                user.send({embeds: [RoleTernaryEmbed]})

                break;

            // CASE: Celestial Cartographers \\
            case "🗺️":
                await ServerMember.roles.remove(Role_CelestialCartographer);

                RoleTernaryEmbed.setDescription("You lost the Celestial Cartographers role!")
                user.send({embeds: [RoleTernaryEmbed]})

                break;

            // CASE: Default | NONE \\
            default: break;
        }
    }
}



const OnMessageCreate =
{
    name: 'messageCreate',
    execute(message)
    {
        if(message.guild || message.author.id == process.env.BOT_ID) return;

        try {
            message.author.send({
                embeds:
                [
                    new EmbedBuilder()
                        .setColor(Colors.DarkBlue)
                        .setTitle("Selene does not accept private messages.")
                        .setDescription("Please use Selene from the server, the only time you may message Selene is if you are providing evidence to back a claim/report.")
                        .setFooter({text: "𝐿𝓊𝓃𝒶𝓇 𝐸𝒸𝓁𝒾𝓅𝓈𝑒™"}) .setTimestamp()
                ]
            })
        }
        catch (err) { console.log(`User ${message.author.username} is not accepting PM's.`); }
    }
}



const OnGuildMemberAdd =
{
    name: 'guildMemberAdd',
    execute(member)
    {
        let NewMemeberEmbed = new EmbedBuilder()
            .setTitle("Welcome to the Lunar Eclipse.")
            .setColor(Colors.DarkPurple)
            .setDescription(`Welcome ${member.displayName}, to our constellation!`)
            .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
            .setFooter({text: "𝐿𝓊𝓃𝒶𝓇 𝐸𝒸𝓁𝒾𝓅𝓈𝑒™"}) .setTimestamp()
        
        member.guild.channels.cache.find(channel => channel.name === "new-explorers").send({embeds: [NewMemeberEmbed]});
    }
}



const OnGuildMemberUpdate =
{
    name: 'guildMemberUpdate',
    execute(Old_ServerMember, New_ServerMember)
    {
        if(!Old_ServerMember.roles.cache.has("1236891118940065902") && New_ServerMember.roles.cache.has("1236891118940065902"))
        {
            New_ServerMember.user.send({embeds: [
                new EmbedBuilder()
                    .setTitle("You gained a special role!")
                    .setDescription("You have gained the Cosmic Creators role in the Lunar Eclipse!")
                    .setFields({name: "Getting started.", value: "To allow users to get alerts when you go live or when you post, you must submit the command /set creator --MediaType --MediaLink in #bot-commands."})
                    .setFooter({text: "𝐿𝓊𝓃𝒶𝓇 𝐸𝒸𝓁𝒾𝓅𝓈𝑒™"}) .setTimestamp()
            ]})
        }
    }
}



const OnInteractionCreate =
{
    name: 'interactionCreate',
    async execute(interaction)
    {
        if(!interaction.isCommand()) return;
        if(interaction.channel.name != "bots-general")
            return await interaction.reply({content: "Commands must be used within the #bots-general text channel.", ephemeral: true});

        await CommandHandler(interaction);
    }
}


module.exports =
[
    OnReady,
    OnMessageReactionAdd,
    OnMessageReactionRemove,
    OnMessageCreate,
    OnGuildMemberAdd,
    OnGuildMemberUpdate,
    OnInteractionCreate
];
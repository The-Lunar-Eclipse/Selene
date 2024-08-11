const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { LunarAtlas } = require('./out_source/LunarAtlas'); // Adjust the path as necessary

async function CommandHandler(interaction)
{
    const { commandName, options } = interaction;
    switch(commandName) {

        // CASE: /help \\
        case "help":
            await interaction.reply({ embeds: 
                [
                    new EmbedBuilder()
                        .setTitle("Current Selene Commands.")
                        .setDescription("Here are all of the current Selene commands you can use and their usage.")
                        .addFields(
                            { name: "/help", value: "Lists all the available commands that users may use." },
                            { name: "/create ticket", value: "Creates a ticket against a specified user that violated the rules, attachments may be used if applicable." },
                            { name: "/create report", value: "Creates a feedback/bug report." },
                            { name: "/set creator", value: "Sets your Content Creator link. Verified users only. (This proccess is irreversible without an admin!)" }
                        )
                        .setFooter({text: "𝐿𝓊𝓃𝒶𝓇 𝐸𝒸𝓁𝒾𝓅𝓈𝑒™"}).setTimestamp()
                ],
                ephemeral: true
            });
            break

        // CASE: /create \\
        case "create":
            console.log(`\nLunarAtlas interaction started for user: ${interaction.user.username}`);
            
            switch(options.getSubcommand()) {

                // SUB-CASE: /create ticket \\
                case "ticket": {
                    const data =
                    {
                        "Discord Member": interaction.user.username,
                        "Report Type": "User Report",
                        "Reported User": options.getUser("user").username,
                        "Synopsis": options.getString("synopsis"),
                        "Channel": options.getChannel("channel") ? options.getChannel("channel").name : "N/A",
                        "Attachment": options.getAttachment("attachment") ? options.getAttachment("attachment").url : "N/A"
                    }

                    await interaction.reply({ content: await new LunarAtlas().SendData("Reports", data) ? "Ticket created successfully, an admin will get with you soon about this issue." : "There was an error during the upload, please contact an admin.", ephemeral: true });
                    break;
                }

                // SUB-CASE: /create report \\
                case "report": {
                    const data =
                    {
                        "Discord Member": interaction.user.username,
                        "Report Type": "Feedback/Bug Report",
                        "Synopsis": options.getString("synopsis")
                    }

                    await interaction.reply({ content: await new LunarAtlas().SendData("Reports", data) ? "Ticket created successfully, please wait while we review your report." : "There was an error during the upload, please contact an admin.", ephemeral: true });
                    break;
                }
                
                // CASE: Default | NONE \\
                default: await interaction.reply({content: "Invalid command."});
            }
            break;

        // CASE: /set \\
        case "set":
            switch(options.getSubcommand()) {

                // SUB-CASE: /set creator \\
                case "creator": {
                    if(interaction.member.roles.cache.some(role => ["1236889713785311314", "1236890088957415445", "1236891118940065902"].includes(role.id))) {
                        console.log(`\nLunarAtlas interaction started for user: ${interaction.user.username}`);

                        const _username = interaction.options.getString("mediausername").toLowerCase();
                        const _type = interaction.options.getString("mediatype").toLowerCase();
                    
                        if(!["twitch", "youtube"].includes(_type)) {
                            await interaction.reply({content: "Media type is invalid, types acceptable: [\"Twitch\",\"Youtube\"]", ephemeral: true });
                            console.log("Interaction forcefully ended { Invalid_Type }.");
                            break;
                        }

                        const _r = await new LunarAtlas().FindReports("Cosmic-Creators", interaction.user.username.toString(), null);

                        let count = 0;
                        _r.forEach(r => { if(r["Media Type"] == _type) { count++ } });
                        if(count > 0) {
                            await interaction.reply({content: "A report under your name was already specified with this media type, please contact an admin for removal.", ephemeral: true });
                            console.log("Interaction forcefully ended { Pre-Exists }.");
                            break;
                        }

                        const data = {
                            "Discord Member": `${interaction.user.username}`,
                            "Media Type": `${_type}`,
                            "Media Username": `${_username}`
                        };

                        const _t = await new LunarAtlas().SendData("Cosmic-Creators", data);
                        await interaction.reply({content: _t == true ? "Creator link uploaded successfully" : "There was an error during the upload, please contact an admin.", ephemeral: true });

                        break;
                    }
                    
                    await interaction.reply({content: "You need administrative privileges to use this command.", ephemeral: true});
                    break;
                }
                default: await interaction.reply({content: "Invalid command."});
            }
            break;

        // CASE: Default | NONE \\
        default: break;
    }
}



const SlashCommands =
[
    //  /help  \\
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Provides all commands and their usage.")
        
    ,

    //  /create  \\
    new SlashCommandBuilder()
        .setName("create")
        .setDescription("Creates a report of sub-type. ('ticket', 'report')")

        /**
         * Main Command: /create
         * Sub-Command: ticket
         * 
         * Command: /create ticket --user(REQUIRED) --synopsis(REQUIRED) --channel(OPTIONAL)
         */
        .addSubcommand(command =>
            command
                .setName("ticket")
                .setDescription("Creates a ticket against a user.")
                .addUserOption(op => op.setName("user").setDescription("The user to report.").setRequired(true))
                .addStringOption(op => op.setName("synopsis").setDescription("What the user in question did.").setRequired(true))
                .addChannelOption(op => op.setName("channel").setDescription("The channel in which the user committed the violation.").setRequired(false))
                .addAttachmentOption(op => op.setName("attachment").setDescription("Proof of the user violating a rule.").setRequired(false))
        )

        /**
         * Main Command: /create
         * Sub-Command: report
         * 
         * Command: /create report --synopsis(REQUIRED)
         */
        .addSubcommand(command => 
            command
                .setName("report")
                .setDescription("Submit a feedback/bug report.")
                .addStringOption(op => op.setName("synopsis").setDescription("A brief summary of the report.").setRequired(true))
        )
    ,

    new SlashCommandBuilder()
        .setName("set")
        .setDescription("Apply administrative privileges.")
        
        /**
         * Main Command: /set
         * Sub-Command: creator
         * 
         * Command: /set creator --MediaLink(REQUIRED)
         */
        .addSubcommand(command => 
            command
                .setName("creator")
                .setDescription("Set your creator media link. (This proccess is irreversible without an admin!)")
                .addStringOption(op => op.setName("mediausername").setDescription("The username attached to your media. (  !!! CASE SENSITIVE, COPY AS IS !!!  )").setRequired(true))
                .addStringOption(op => op.setName("mediatype").setDescription("Type of media link. (Youtube, Twitch).").setRequired(true))
        )
]

module.exports = { CommandHandler, SlashCommands } ;
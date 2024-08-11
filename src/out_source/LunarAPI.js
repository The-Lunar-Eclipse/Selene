const { LunarAtlas } = require("./LunarAtlas.js");
const axios = require("axios");

class LunarAPI
{
    // Twitch API Keys \\
    #TAPI_Token = null;

    // Lunar_TAPI API Keys \\
    #TAPI_CLID = process.env.Twitch_ClientID;
    #TAPI_SID = process.env.Twitch_ClientSecret;

    // TAPI_Streamer Keys \\
    #TwitchStreamerNames = [];
    ActiveStreamers = [];

    // Youtube API Keys \\
    //#YAPI_Key = process.env.Youtube_Token;

    constructor()
    {
        this.#TAPI_RequestNewToken();

        // Gather Twitch Streamer Usernames \\
        this.#GatherStreamerUsernames();
        setInterval(() => this.#GatherStreamerUsernames, 10000)
    }

    async #GatherStreamerUsernames()
    {
        console.log("\nLunarAtlas interaction started for user: Selene");
        let reports = await new LunarAtlas().FindReports("Cosmic-Creators", "", "ALL")

        reports.forEach(report => {
            if(!(report["Media Type"] === "twitch")) return;

            this.#TwitchStreamerNames.push(report["Media Username"])
        })
    }

    /**
     * Requests a new token through Twitch API
     * @param {function} callback function to run after completion. (OPTIONAL)
     */
    async #TAPI_RequestNewToken(callback)
    {
        await axios.post("https://id.twitch.tv/oauth2/token", {
            client_id: this.#TAPI_CLID,
            client_secret: this.#TAPI_SID,
            grant_type: "client_credentials"
        })
        .then((RES) =>
        {
            console.log(callback ? "Twitch_API: Runtime Refresh Successful!" : "Twitch_API: Refresh Successful! (Class Instantiated)" );
            this.#TAPI_Token = RES.data["access_token"];
        })

        if(callback) { callback(); }
    }

    async #TAPI_VerifyToken(callback)
    {
        try
        {
            await axios.get("https://id.twitch.tv/oauth2/validate", {
                headers: {
                    "Authorization": `OAuth ${this.#TAPI_Token}`
                }
            });

            if(callback) { callback(); }
        }
        catch (err)
        {
            console.log("Twitch_API: Verification Incomplete, REASON ? { 'TOKEN_INVALID' } ... Requesting a new Token..");
            
            this.#TAPI_RequestNewToken(() => this.#TAPI_VerifyToken(callback) )
        }
    }

    async GetLiveStreamers() {
        let streamers = [];
    
        await new Promise((resolve, reject) => {
            this.#TAPI_VerifyToken(async () => {
                try {
                    for (let username of this.#TwitchStreamerNames) {
                        const RES = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(username)}`, {
                            headers: {
                                "Client-ID": this.#TAPI_CLID,
                                "Authorization": `Bearer ${this.#TAPI_Token}`
                            }
                        });
    
                        let StreamerData = RES.data.data[0];
    
                        if (StreamerData == null) {
                            // Verify that streamer is no longer in ActiveStreamers
                            if (this.ActiveStreamers.includes(username))
                                this.ActiveStreamers = this.ActiveStreamers.filter(i => i !== username);
                            continue;
                        }
    
                        if (!this.ActiveStreamers.includes(StreamerData["user_login"])) {
                            console.log(`Twitch_API: A user has come online! { ${StreamerData["user_login"]} }`);
                            streamers.push(StreamerData);
                            this.ActiveStreamers.push(StreamerData["user_login"]);
                            continue;
                        }
                    }
                    resolve();
                } catch (error) {
                    console.error(`Twitch_API: Encountered an error. { ${error} }`); reject(error);
                }
            });
        });
    
        return streamers;
    }

    /*
    async YAPIGetLastPost()
    {
        let lastvideodata = [];

        // Grab last video posted by user \\
        const _t = await new LunarAtlas().FindReports("Cosmic-Creators", "", "ALL");
        _t[1].close();

        try {
            await Promise.all(_t[0].map(async (report) => {
                if (report["Media Type"] !== "youtube") return;
                
                const channel = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
                    params: {
                        key: this.#YAPI_Key,
                        forUsername: report["Media Username"],
                        part: "id"
                    }
                });
                
                const video = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                    params: {
                        key: this.#YAPI_Key,
                        channelId: channel.data.items[0].id,
                        part: 'snippet',
                        order: 'date',
                        maxResults: 1
                    }
                });
                
                lastvideodata.push([ video.data.items[0], video.data.items[0]["id"]["videoId"] ]);
                // end of grab \\
                
                // Verify if new post \\
                const userlastpost = await new LunarAtlas().FindReports("Statistics", report["Media Username"], null);
            }));
        } catch (err) {
            console.log("YAPI ERROR:", err.message);
        }

        return lastvideodata; // Return lastvideodata from the function
    }
    */
}

module.exports = { LunarAPI };
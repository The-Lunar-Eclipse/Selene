const axios = require('axios');
require('dotenv').config();

class DynoManager {
    constructor() {
        this.HEROKU_API_KEY = process.env.HEROKU_API_KEY;
        this.APP_NAME = "selene-discord-bot";
        this.DYNO_NAME = "worker.1";
    }

    async RestartDyno() {
        try {
            await axios({
                method: 'delete',
                url: `https://api.heroku.com/apps/${this.APP_NAME}/dynos/${this.DYNO_NAME}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.heroku+json; version=3',
                    'Authorization': `Bearer ${this.HEROKU_API_KEY}`
                }
            });
            console.log("DynoScheduler: Dyno restarted successfully.");
        } catch (error) { console.error("DynoScheduler: Failed to restart dyno. ", error.response ? error.response.data : error.message) }
    }
}

switch(process.argv[2])
{
    case "restart": new DynoManager().RestartDyno(); break;
    default: console.error("Invalid argument. Please provide a valid argument.");
}

module.exports = { DynoManager }
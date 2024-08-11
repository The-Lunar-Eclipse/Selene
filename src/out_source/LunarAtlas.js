const { MongoClient } = require("mongodb");

class LunarAtlas
{
    constructor() { this.atlasurl = process.env.ATLAS_URL; }

    /**
     * Sends data to specified Atlas cluster.
     * 
     * @param {string} clusterName Name of Atlas Cluster.
     * @param {object} Data Data to be sent to the Atlas Cluster.
     */
    async SendData(clusterName, Data)
    {
        let temporaryClient = await new MongoClient(this.atlasurl).connect();
        const database = temporaryClient.db("Lunar-Eclipse");

        try
        {
            await database.collection(clusterName).insertOne(Data);

            if(Data["Media Type"] == "youtube")
            {
                var newData =
                {
                    "Media Username": Data["Media Username"],
                    "Last VideoID": "null"
                }
                await database.collection("Statistics").insertOne(newData)

                console.log(`LunarAtlas { SendData → Statistics } interaction complete.`);
            }

            return true;
        }
        catch (err) { return false; }
        finally { console.log(`LunarAtlas { SendData → ${clusterName} } interaction complete.`); temporaryClient.close(); }
    }

    /**
     * Returns all reports of the specified username
     * 
     * @param {string} clusterName Name of Atlas Cluster.
     * @param {string} Username Username of User (NOT REQUIRED if using querytype 'ALL').
     * @param {string} queryType Query type (DEFAULT: None).
     */
    async FindReports(clusterName, Username, queryType = null)
    {
        let temporaryClient = await new MongoClient(this.atlasurl).connect();
        const database = temporaryClient.db("Lunar-Eclipse");

        try
        {
            if(!queryType)
            {
                return await database.collection(clusterName).find({ ["Discord Username"]: Username }).toArray();
            }
            else
            {
                switch(queryType)
                {
                    case "ALL": return await database.collection(clusterName).find({}).toArray();
                    default: break;
                }
            }
        } finally { console.log(`LunarAtlas { ${clusterName} → FindReports } interaction complete.`); temporaryClient.close(); }
    }
}

module.exports = { LunarAtlas };
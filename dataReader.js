const MongoClient = require("mongodb").MongoClient;
const fs = require("fs").promises;
const commaNumber = require("comma-Number");   //1.5K (gzipped: 757)

// Constants 
const url = "mongodb://localhost27017";
const dbName = "fitness_analysis";
const collectionName = "exercises";
const fileName = "fitness_analysis.json";
const client = new MongoClient(url, {useNewUrlParser: true});

async function main(){
    try{
        const start = Date.now();
        await client.connect();
        console.log("connected to database server");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const fitnessPlanningData = await fs.readFile(fileName, "utf-8"); 
        await collection.insertMany(JSON.parse(fitnessPlanningData));
        const count = await collection.find().count();

        console.log(
            `there are ${commaNumber(count)} records this took ${
                (Date.now() - start) - 1000
            } seconds to execute`
        );

        process.exit()
    } catch (error) {
        console.log(error);
    }
}
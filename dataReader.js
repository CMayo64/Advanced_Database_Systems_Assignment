const MongoClient = require("mongodb").MongoClient;
const fs = require("fs").promises;
const commaNumber = require("comma-number"); //1.5K (gzipped: 757)

/** constants */
const url = "mongodb://localhost:27017";
const dbName = "wineTaste";
const collectionName = "tastes";
const fileName = "wine.json";
const client = new MongoClient(url, { useNewUrlParser: true });

async function main() {
    try {
        const start = new Date.now();
        await client.connect();
        console.log("connected to database server");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const wineTastingData = await fs.readFile(fileName, "utf-8");
        console.log(wineTastingData);
        await collection.insertMany(JSON.parse(wineTastingData));
        const count = await collection.find().count;
        console.log(
            `there are ${commaNumber(count)} records, this took ${
                (Date.now() - start) / 1000}
                 seconds to execute`);
        process.exit();
    }   catch (error) {
    }
}
const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");

/**
 *  constants 
 * mongodb://localhost27017/gym
*/
const uri = "mongodb+srv://wine-user:WenWikaM3x0c1L0A@cluster0.n2v80.mongodb.net/Gym?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        const db = client.db();
        const results = await db.collection("tastings").find({}).count();

        if (results) {
            db.dropDatabase();
        }

        //This is a loading message that displays a spinner whilst its loading
        const load = loading("importing your gym data").start();

        //This is where I import my "fitness_analysis.json" into the database
        const data = await fs.readFile(path.join(__dirname, "fitness_analysis.json"), "utf-8");
        await db.collection("tastings").insertMany(JSON.parse(data));

        const wineTastersRef = await.collection("tastings").aggregate([
            { $match: { taster_name: { $ne: null } } },
            {
                $group: {
                    _id: "$name",
                    email: { $first: "$email_address" },
                    tastings: { $sum: 1 },
                },
            },
            {
                $project: { 
                    _id: 0,
                    name: '$_id',
                    email: '$email',
                    tastings: '$tastings'
                },
            },
        ]);

        //This is where I output the results of my aggregate into a new collection
        const wineTasters = await wineTastersRef.toArray();
        await db.collection("tasters").insertMany(wineTasters);

        const updatedWineTastersRef = db.collection("tasters").find({});
        const uupdatedWineTasters = await updatedWineTastersRef.toArray();
        updatedWineTasters.forEach(async ({ _id, name }) => {
            await db.collection("tastings").updateMany({ taster_name: name }, [
                {
                    $set: {
                        taster_id: id,
                        regions: ["$region_1", "$region_2"],points: { $toInt: "$points" },
                    },
                  },
                ]);
              });
          
          
              /**
               * we can get rid of region_1/2 off our root document, since we've
               * placed them in an array
               */
              await db
                .collection("tastings")
                .updateMany({}, { $unset: { region_1: "", region_2: " " } });
          
              /**
               * Finally, we remove nulls regions from our collection of arrays
               * */
              await db
                .collection("tastings")
                .updateMany({ regions: { $all: [null] } }, [
                  { $set: { regions: [{ $arrayElemAt: ["$regions", 0] }] } },
                ])
          
          
              db.collection("tastings").aggregate([
                { $group: { _id: "$variety" } },
                { $project: { name: "$_id", "_id": 0 } },
                { $out: "varieties" }
              ]).toArray();
          
              db.collection("tastings").aggregate([
                { $group: { _id: "$country" } },
                { $project: { name: "$_id", "_id": 0 } },
                { $out: "countries" }
              ]).toArray()
          
          
          
              await db.collection("tastings").aggregate([
                { $group: { _id: "$province" } },
                { $project: { name: "$_id", "_id": 0 } },
                { $out: "provinces" }
              ]).toArray()
          
              await db.collection("tastings").aggregate([
                { $unwind: "$regions" },
                { $group: { _id: "$regions" } },
                { $project: { name: '$_id', _id: 0 } },
                { $out: "regions" }
              ]).toArray();
          
          
              await db.collection("tastings").aggregate([
                { $unwind: "$regions" },
                { $group: { _id: "$regions" } },
                { $project: { name: "$_id", "_id": 0 } },
                { $out: "regions" }
              ]).toArray()
          
          
          
              load.stop();
              console.info(
                `Gym Collection set up!! 🍷🍷🍷🍷🍷🍷🍷 \n I've also created a tasters collection for you 🥴 🥴 🥴`
              );
          
          
              process.exit();
            } catch (error) {
              console.error("error:", error);
              process.exit();
            }
          }
          
          main();
          
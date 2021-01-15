const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");

//Constants
const uri =  "mongodb+srv://gym-admin:jgKQB4F0tEs1VCZn@cluster0.n23ui.mongodb.net/gym?retryWrites=true&w=majority"
const client = new MongoClient(uri);
async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("workout-records").find({}).count();

    //If there are existing records then delete the current collections
    if (results) {
      db.dropDatabase();
    }

    //This is a loader module that displays a spinner to the command line
    const load = loading("Importing the gym data!!").start();

    //Import JSON data into the database
    const data = await fs.readFile(path.join(__dirname, "fitness.json"), "utf8");
    await db.collection("workout-records").insertMany(JSON.parse(data));

    //Group the exercise workouts and summ up their total workout-records.
    const gymUsersRef = await db.collection("workouts-records").aggregate([
      { $match: { gym_user_name: { $ne: null } } },
      {
        $group: {
          _id: "$gym_user_name",
          twitter: { $first: "$twitter_handle" },
          workouts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          twitter: '$twitter',
          workouts: '$workouts'
        },
      },
    ]);

    //Output the results of aggregate into new collection
    const exerciseGymuser = await wineGymUserRef.toArray();
    await db.collection("gymUsers").insertMany(exerciseGymuser);

    //Reference each document in the workouts collection to a taster id. 
    //Then take tidy up ages, adding them to an array
    const updatedGymuserRef = db.collection("gymUsers").find({});
    const updatedGymusers = await updatedGymuserRef.toArray();
    updatedGymusers.forEach(async ({ _id, name }) => {
      await db.collection("workouts").updateMany({ gymUser_name: name }, [
        {
          $set: {
            gymUser_id: _id,
            age: ["age"],
          },
        },
      ]);
    });

    //Get rid of age off of root document, as placed them in an array
    await db
      .collection("workouts")
      .updateMany({}, { $unset: { age: ""} });

    //Lastly, remove null ages from collection of arrays
    await db
      .collection("workouts")
      .updateMany({ ages: { $all: [null] } }, [
        { $set: { ages: [{ $arrayElemAt: ["$ages", 0] }] } },
      ])

    db.collection("workouts").aggregate([
      { $group: { _id: "$healthy" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "healyness" }
    ]).toArray();

    await db.collection("workouts").aggregate([
      { $group: { _id: "$currentLevel" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "Current_Level" }
    ]).toArray()

    await db.collection("workouts").aggregate([
      { $unwind: "$ages" },
      { $group: { _id: "$ages" } },
      { $project: { name: '$_id', _id: 0 } },
      { $out: "ages" }
    ]).toArray();

    await db.collection("workouts").aggregate([
      { $unwind: "$ages" },
      { $group: { _id: "$ages" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "ages" }
    ]).toArray()

    load.stop();
    console.info(
      `Gym collection set up! \n I have also created a workouts collection`
    );
    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}
main();
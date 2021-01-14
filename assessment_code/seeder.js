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
    const load = loading("importing the gym data!!").start();

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
    load.stop();
    console.info(
      `Gym collection set up! \n I've also created a workouts collection`
    );
    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}
main();
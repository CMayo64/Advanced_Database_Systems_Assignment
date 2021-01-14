
const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");

/**
 * constants
 */
// const uri = "mongodb://localhost:27017/wine";
const uri =  "mongodb+srv://gym-admin:V2V2Af0k96dG6xnp@cluster0.n23ui.mongodb.net/gym?retryWrites=true&w=majority"
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("workouts").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("importing your gym data!!").start();

    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "fitness.json"), "utf8");
    await db.collection("workouts").insertMany(JSON.parse(data));

    /**
     * This perhaps appears a little more complex than it is. Below, we are
     * grouping the wine tasters and summing their total workouts. Finally,
     * we tnamey up the output so it represents the format we need for our new collection
     */

    const gymUsersRef = await db.collection("workouts").aggregate([
      { $match: { gym_user_name: { $ne: null } } },
      {
        $group: {
          _id: "$gym_user_name",
          twitter: { $first: "$taster_twitter_handle" },
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
      `Gym collection set up! \n I've also created a workouts collection for you 🥴`
    );

    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();

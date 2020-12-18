const http = require("http");
const server = http.createServer();
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "student";
const client = new MongoClient(url, {useNewUrlParser: true });

server.on("request", async (req, res) => {
    const { url, headers } = req;
    try {
        const students = [
            {
                name: { first: "joe", last: "appleton" },
                dob: new Date("August 12, 1982"),
            },
            {
                name: { first: "bill", last: "smith" },
                dob: new Date("August 12, 1982"),
            },
        ];
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("students");
        await collection.insertMany(students);
        res.end("request ended");
    }   catch (e) {
        console.log(e);
        res.end("could not update");
    }
});

server.listen(8080);
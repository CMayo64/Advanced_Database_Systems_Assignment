const MongoClient = require("mongodb").MongoClient;
const fs = require("fs").promises;
const commaNumber = require("commaNumber");

const dbName = "fitness_analysis";
const collectionName = "exercises";
const url = "mongodb://localhost2701";
const fileName = "fitness_analysis.csv";
const client = new MongoClient(url, {useNewUrlParser: true});

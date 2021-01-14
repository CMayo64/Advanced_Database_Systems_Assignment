const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema(
  {
    points: Number,
    title: String,
    barriers: String,
    name: String,
    twitter_handle: String,
    age: Number,
    designation: String,
    healthy: String,
    currentLevel: String,

    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    currentLevel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "currentLevel",
    },
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
    },
    ages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Age" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Workout", workoutSchema);
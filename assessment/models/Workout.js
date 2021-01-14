const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema(
  {
    points: Number,
    title: String,
    description: String,
    name: String,
    twitter_handle: String,
    age: Number,
    designation: String,
    variety: String,
    province: String,
    country: String,
    winery: String,

    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    province_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
    },
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
    },
    regions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Region" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);

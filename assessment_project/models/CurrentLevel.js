const mongoose = require("mongoose");
const { Schema } = mongoose;

const currentLevelSchema = new Schema(
    {
        level: { type: String, required: [true, 'Level is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Current Level", currentLevelSchema);
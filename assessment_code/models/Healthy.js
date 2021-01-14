const mongoose = require("mongoose");
const { Schema } = mongoose;

const healthySchema = new Schema(
    {
        score: { type: int, required: [true, 'Score is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Healthy", healthySchema);
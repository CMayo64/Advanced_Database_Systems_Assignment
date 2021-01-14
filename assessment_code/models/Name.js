const mongoose = require("mongoose");
const { Schema } = mongoose;

const nameSchema = new Schema(
    {
        name: { type: String, required: [true, 'Name is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Name", nameSchema);
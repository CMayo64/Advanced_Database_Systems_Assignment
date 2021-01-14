const mongoose = require("mongoose");
const { Schema } = mongoose;

const ageSchema = new Schema(
    {
       age: { type: int, required: [true, 'Age is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Age", ageSchema);
const mongoose = require("mongoose");
const { Schema } = mongoose;
const ageSchema = new Schema(
    {
       age: { type: Number, required: [true, 'age is required'] },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Age", ageSchema);
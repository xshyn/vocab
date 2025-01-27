const { Schema, model } = require("mongoose");

const wordSchema = new Schema({
    persian: {
        type: String,
        required: true
    },
    english: {
        type: String,
        required: true
    },
    pro: {
        type: String,
        required: true
    },
    exp: String
}, {
    timestamps: true
})

const wordModel = model('model', wordSchema)

module.exports = {
    wordModel
}
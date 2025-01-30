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
    exp: String,
    users: [{type: Schema.Types.ObjectId , ref: "user"}]
}, {
    timestamps: true
})

const wordModel = model('word', wordSchema)

module.exports = {
    wordModel
}
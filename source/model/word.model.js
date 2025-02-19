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
        type: String
    },
    exp: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

const wordModel = model('word', wordSchema)

module.exports = {
    wordModel
}
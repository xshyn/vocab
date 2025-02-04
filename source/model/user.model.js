const { Schema , model } = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: Date,
    rule: {
        type: String,
        enum: ["User" , "Admin"]
    },
    wordsCount: {
        type: Number,
        default: 0
    },
    profile: String
} , {
    timestamps: true
})

const userModel = model('user' , userSchema)

module.exports = {
    userModel
}
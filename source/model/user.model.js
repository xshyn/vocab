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
} , {
    timestamps: true
})

const userModel = model('user' , userSchema)

module.exports = {
    userModel
}
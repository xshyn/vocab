const { Schema, model } = require("mongoose");

const activitySchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
},{timestamps: true})

const activityModel = model("activity" , activitySchema)

module.exports = {
    activityModel
}
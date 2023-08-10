const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DateTime } = require('luxon')

const MessageSchema = new Schema({
    title: {
        type: String,
        required: true,

    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: new Date()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})


MessageSchema.virtual("date").get(function() {
    return DateTime.fromJSDate(this.timestamp).toFormat("yyyy-MM-dd, HH:mm")
})

module.exports = mongoose.model("Message", MessageSchema)

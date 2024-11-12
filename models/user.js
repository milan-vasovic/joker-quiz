const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    resetToken: {
        type: String,
    },
    
    resetTokenExpiration: {
        type: Date,
    },

    events: [{
        eventId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Event"
        }
    }]
})

module.exports = mongoose.model('User', userSchema);
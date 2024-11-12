const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questSchema = new Schema({
    description: {
        type: String,
        required: true
    },

    category: [{
        type: String,
        required: true
    }],

    type: {
        type: String,
        required: true
    },

    date: {
        type: Date,
    },

    usedDate: {
        type: Date
    },

    cooldownDate: {
        type: Date
    },

    difficulty: {
        type: Number,
        required: true
    },

    acceptedAnswers: [{
        text: {
            type: String,
            required: true
        },

        points: {
            type: Number,
            required: true
        },

        image: {
            type: String
        }
    }],

    multipleChoice: [{
        text: {
            type: String,
        },

        image: {
            type: String
        }
    }]
})

module.exports = mongoose.model('Quest', questSchema);
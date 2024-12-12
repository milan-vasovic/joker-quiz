const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    category: [{
        type: String,
        required: true
    }],

    description: {
        type: String,
        required: true
    },

    quests: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Quest"
    }],

    status: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    teams: [{
        teamId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Team"
        }
    }],

    presenter: {
        presenterId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },

        username: {
            type: String,
            required: true
        }
    },

    rewards: [{
        reward: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        }
    }],

    leaderboard: [{
        teamId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Team"
        },
        
        place: {
            type: Number,
        },

        points: {
            type: Number,
            required: true,
            default: 0
        },

        isWinner: {
            type: Boolean
        }
    }]
})

module.exports = mongoose.model('Event', eventSchema);
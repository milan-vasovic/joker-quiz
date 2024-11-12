const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leagueSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    events: [{
        eventId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Event"
        }
    }],

    rewards: [{
        reward: {
            type: String,
            required: true
        },

        image: {
            type: String
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
            required: true
        },

        points: {
            type: Number,
            required: true,
            default: 0
        },

        isWinner: {
            type: Boolean,
            required: true
        }
    }]
})

module.exports = mongoose.model('League', leagueSchema);
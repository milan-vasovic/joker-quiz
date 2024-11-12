const LeagueModel = require("../models/league");
const errorHelper = require("../helpers/error-helper");

exports.getLeagues = async () => {
    const leagues = await LeagueModel.find()
        .select("name status startDate endDate");
    return leagues.length > 0 ? leagues : [];
};

exports.getLeagueById = async (id) => {
    const league = await LeagueModel.findById(id);
    if (!league) {
        errorHelper.throwNotFoundError("liga");
    }
    return league;
};

exports.postNewLeague = async (body) => {
    const currentDate = new Date();
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    const status = startDate > currentDate
        ? 'future'
        : endDate < currentDate
        ? 'finished'
        : 'progress';

    const newLeague = new LeagueModel({
        name: body.name,
        description: body.description,
        status: status,
        startDate: body.startDate,
        endDate: body.endDate,
        events: [],
        rewards: [],
        leaderboard: []
    });
    return await newLeague.save();
};

exports.postEditLeague = async (league) => {
    await LeagueModel.findOneAndUpdate(
        { _id: league._id },
        league
    );
};

exports.postDeleteLeague = async (id) => {
    await LeagueModel.findOneAndDelete({ _id: id });
};

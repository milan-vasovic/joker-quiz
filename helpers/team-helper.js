const TeamModel = require("../models/team");
const errorHelper = require("../helpers/error-helper");
const eventHelper = require("../helpers/event-helper");

exports.getTeams = async () => {
    const teams = await TeamModel.find();
    return teams.length > 0 ? teams : [];
};

exports.getTeamById = async (id) => {
    const team = await TeamModel.findById(id).select('-password');
    if (!team) {
        errorHelper.throwNotFoundError("team");
    }
    return team;
};

exports.postNewTeam = async (team) => {
    const newTeam = new TeamModel(team);
    await newTeam.save();
};

exports.postEditLeague = async (team) => {
    await TeamModel.findOneAndUpdate(
        { _id: team._id },
        team
    );
};

exports.postDeleteteam = async (id) => {
    await TeamModel.findOneAndDelete({ _id: id });
};

exports.postAddTeamToEvent = async (teamId, eventId) => {
    const event = await eventHelper.getEventById(eventId);

    event.teams.push(teamId);
    await event.save();
    return true;
};

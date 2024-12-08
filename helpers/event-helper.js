const EventModel = require("../models/event");
const QuestModel = require("../models/quest");
const TeamModel = require("../models/team");
const errorHelper = require("../helpers/error-helper");

exports.getEvents = async () => {
    const events = await EventModel.find()
        .select("name category status startDate presenter");
    return events.length > 0 ? events : [];
};

exports.getEventById = async (id) => {
    const event = await EventModel.findById(id).populate("teams.teamId leaderboard.teamId", "_id name").populate("quests", "description category difficulty type acceptedAnswers");
    if (!event) {
        errorHelper.throwNotFoundError("događaja");
    }
    return event;
};

exports.getQuestsFromEventById = async (id) => {
    const event = await EventModel.findById(id).populate("quests teams.teamId");
    if (!event) {
        errorHelper.throwNotFoundError("događaja");
    }
    return event;
};

exports.getNewTeamsForEvent = async (id) => {
    const event = await EventModel.findById(id).select("teams").populate("teams.teamId", "name");
    const excludedTeamIds = event.teams.map(team => team.teamId);
    const teams = await TeamModel.find({
        _id: { $nin: excludedTeamIds }
      }).select("name");

    return teams;
};

exports.postNewEvent = async (body, user) => {
    const currentDate = new Date();
    const startDate = new Date(body.startDate);

    const status = startDate > currentDate ? 'future' : 'current';

    const newEvent = new EventModel({
        name: body.name,
        category: body.category,
        description: body.description,
        startDate: body.startDate,
        status: status,
        presenter: {
            presenterId: user._id,
            username: user.username
        },
        quests: [],
        teams: [],
        rewards: [],
        leaderboard: []
    });
    return await newEvent.save();
};

exports.postEditEvent = async (event) => {
    await EventModel.findOneAndUpdate(
        { _id: event._id },
        event
    );
};

exports.postDeleteEvent = async (id) => {
    await EventModel.findOneAndDelete({ _id: id });
};

exports.postStartEvent = async (id) => {
    const event = await EventModel.findById(id).populate("teams.teamId", "_id name");

    const quests = [];
    const easyQuests = await getRandomQuestions(event.category[0], 1, 9);
    const mediumQuests = await getRandomQuestions(event.category[0], 2, 5);
    const hardQuests = await getRandomQuestions(event.category[0], 3, 3);
    const veryHardQuests = await getRandomQuestions(event.category[0], 4, 2);
    const extremeQuests = await getRandomQuestions(event.category[0], 5, 1);

    quests.push(...easyQuests, ...mediumQuests, ...hardQuests, ...veryHardQuests, ...extremeQuests);

    quests.sort(() => Math.random() - 0.5);

    event.quests = quests;
    event.status = "current";

    return await event.save();
};

async function getRandomQuestions(categoryValue, difficultyValue, size) {
    const currentDate = new Date();
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(currentDate.getDate() - 8);
  
    try {
      const questions = await QuestModel.aggregate([
        {
          $match: {
            category: { $in: [categoryValue] },
            difficulty: difficultyValue,
            $or: [
                { usedDate: { $lt: eightDaysAgo } },
                { usedDate: { $exists: false } }
              ],
              $or: [
                { cooldownDate: { $lt: currentDate } },
                { cooldownDate: { $exists: false } }
              ]
          }
        },
        { $sample: { size: size } }
      ]);
  
      return questions;
    } catch (error) {
      errorHelper.throwNotFoundError("pitanja");
    }
}

exports.postTeamsScores = async (body) => {
    const teams = body.teams;
    const points = body.points;

    const event = await EventModel.findById(body.eventId).select("leaderboard");

    const mappedData = teams.map((team, index) => ({
        teamId: team,
        points: points[index] ? parseInt(points[index], 10) : 0
      }));

    mappedData.sort((a, b) => b.points - a.points);

    event.leaderboard = mappedData.map((data, index) => ({
        teamId: data.teamId,
        place: index + 1,
        points: data.points,
        isWinner: index < 3
      }));

    event.status = "finished";

    return await event.save();   
}

exports.postAddTeamToEvent = async (body) => {
    const eventId = body.eventId;

    const event = await EventModel.findById(eventId).select("teams");

    event.teams.push({
        teamId: body.teamId
    });

    return await event.save();
}
const EventModel = require("../models/event");
const QuestModel = require("../models/quest");
const errorHelper = require("../helpers/error-helper");

exports.getEvents = async () => {
    const events = await EventModel.find()
        .select("name category status startDate presenter");
    return events.length > 0 ? events : [];
};

exports.getEventById = async (id) => {
    const event = await EventModel.findById(id);
    if (!event) {
        errorHelper.throwNotFoundError("događaja");
    }
    return event;
};

exports.getQuestsFromEventById = async (id) => {
    const event = await EventModel.findById(id).populate("quests");
    if (!event) {
        errorHelper.throwNotFoundError("događaja");
    }
    return event;
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
    const event = await EventModel.findById(id);

    console.log(event + "\nRadi!");
    console.log(event);
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
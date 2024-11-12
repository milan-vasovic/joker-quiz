const QuestModel = require("../models/quest");
const errorHelper = require("../helpers/error-helper");

exports.getQuests = async () => {
    const quests = await QuestModel.find()
        .select("description category type date difficulty");
    return quests.length > 0 ? quests : [];
};

exports.getQuestById = async (id) => {
    const quest = await QuestModel.findById(id);
    if (!quest) {
        errorHelper.throwNotFoundError("pitanja");
    }
    return quest;
};

exports.postNewQuest = async (body) => {
    let acceptedAnswers = [];
    if (body['acceptedAnswers[text]']) {
        const texts = Array.isArray(body['acceptedAnswers[text]']) ? body['acceptedAnswers[text]'] : [body['acceptedAnswers[text]']];
        const points = Array.isArray(body['acceptedAnswers[points]']) ? body['acceptedAnswers[points]'] : [body['acceptedAnswers[points]']];
        const images = Array.isArray(body['acceptedAnswers[image]']) ? body['acceptedAnswers[image]'] : [body['acceptedAnswers[image]']];

        acceptedAnswers = texts.map((text, index) => ({
            text: text,
            points: Number(points[index] || 0),
            image: images[index] || ''
        }));
    }

    let multipleChoice = [];
    if (body['multipleAnswers[text]'] || body['multipleAnswers[image]']) {
        const texts = Array.isArray(body['multipleAnswers[text]']) ? body['multipleAnswers[text]'] : [body['multipleAnswers[text]']];
        const images = Array.isArray(body['multipleAnswers[image]']) ? body['multipleAnswers[image]'] : [body['multipleAnswers[image]']];

        multipleChoice = texts.map((text, index) => ({
            text: text,
            image: images[index] || ''
        }));
    }

    const newQuest = new QuestModel({
        type: body.type,
        category: body.category,
        difficulty: Number(body.difficulty),
        date: body.date ? new Date(body.date) : null,
        description: body.description,
        acceptedAnswers: acceptedAnswers,
        multipleChoice: multipleChoice
    });

    return await newQuest.save().catch(err=> console.log(err));
};

exports.postEditLeague = async (quest) => {
    await QuestModel.findOneAndUpdate(
        { _id: quest._id },
        quest
    );
};

exports.postDeleteQuest = async (id) => {
    await QuestModel.findOneAndDelete({ _id: id });
};

const errorHelper = require('../helpers/error-helper');
const questHelper = require('../helpers/quest-helper');

// _____________________________________________________________ GET _______________________________________________________________

exports.getQuestsPage = async (req, res, next) => {
    try {
        const quests = await questHelper.getQuests();

        res.render("question/questions", {
            path: "/pitanja",
            pageTitle: "Pitanja",
            quests: quests
        })
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getQuestDetailsPage = async (req, res, next) => {
    try {
        const questionId = req.params.questionId;

        const quest = await questHelper.getQuestById(questionId);

        res.render("question/question-details", {
            path: "/pitanje",
            pageTitle: "Pitanje",
            quest: quest
        })
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getAddQuestPage = (req, res, next) => {
    try {
        res.render("question/add-question", {
            path: "/dodajte-pitenje",
            pageTitle: "Pitanje Dodavanje",
            edit: false,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getEditQuestPage = async (req, res, next) => {
    try {
        const questId = req.params.questId;

        const quest = await questHelper.getQuestById(questId);

        res.render("question/add-quest", {
            path: "/dodaj-zadatak",
            pageTitle: "Pitanje Izmena",
            quest: quest,
            edit: true,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

// _____________________________________________________________ POST _______________________________________________________________

exports.postAddQuest = async (req, res, next) => {
    try {
        // const error = validationResult(req);
        const body = req.body;

        // if (!error.isEmpty()) {
        //     return res.status(422).render(
        //         "question/add-question", {
        //         path: "/dodavanje-pitanja",
        //         pageTitle: "Dodavanje Pitanja",
        //         errorMessage: error.array()[0].msg,
        //         existingData: {
        //             type: body.type,
        //             difficulty: body.difficulty,
        //             date: body.date,
        //             description: body.description,
        //         },
        //         edit: false
        //     })
        // };

        const isAdded = await questHelper.postNewQuest(body);

        if (!isAdded) {
            errorHelper.throwServerError("Greska prilikom cuvanja!");
        }

        return res.redirect("/");
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postEditQuest = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postDeleteQuest = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
}
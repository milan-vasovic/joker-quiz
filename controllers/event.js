const errorHelper = require('../helpers/error-helper');
const eventHelper = require('../helpers/event-helper');

// _____________________________________________________________ GET _______________________________________________________________

exports.getEventsPage = async (req, res, next) => {
    try {
        const events = await eventHelper.getEvents();

        res.render("event/events", {
            pageTitle: "Događaji",
            path: '/dogadjaji',
            events: events
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};


exports.getEventDetailsPage = async (req, res, next) => {
    try {
        let activeRewards, activeTeams, activeLeaderboards, activeQuests;
        
        if (Object.keys(req.query).length === 0) {
            activeRewards = "active";
        } else {
            activeRewards = undefined;
            activeTeams = req.query.teams ? req.query.teams : undefined;
            activeLeaderboards = req.query.leaderboard ? req.query.leaderboard : undefined;
            activeQuests = req.query.quests ? req.query.quests : undefined;
        }
        
        const eventId = req.params.eventId;
        const loggedUser = req.session.user && req.session.user.username ? req.session.user._id : undefined;
        const loggedTeam = req.session.user && req.session.user.name ? {name : req.session.user.name, _id: req.session.user._id} : undefined
        const event = await eventHelper.getEventById(eventId);

        const teams = await eventHelper.getNewTeamsForEvent(eventId);

        let totalPoints = 0;

        event.quests.forEach(quest => {
            quest.acceptedAnswers.forEach(answer => {
                totalPoints += answer.points;
            })
        });

        res.render("event/event-details", {
            pageTitle: "Događaj Detalji",
            path: '/dogadjaj-detalji',
            loggedUser,
            loggedTeam,
            event: event,
            teams: teams,
            totalPoints: totalPoints,
            activeRewards,
            activeTeams,
            activeLeaderboards,
            activeQuests
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getEditEventPage = (req, res, next) => {
    try {
        res.render("event/add-event", {
            pageTitle: "Izmena Događaja",
            path: '/dodavanje-dogadjaja',
            isEdit: true
        })
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getAddEventPage = (req, res, next) => {
    try {
        res.render("event/add-event", {
            pageTitle: "Novi Događaj",
            path: '/dodavanje-dogadjaja',
            isEdit: false
        })
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getStartEventPage = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;

        const event = await eventHelper.getQuestsFromEventById(eventId);

        let totalPoints = 0;

        event.quests.forEach(quest => {
            quest.acceptedAnswers.forEach(answer => {
                totalPoints += answer.points;
            })
        });

        res.render("event/start-event", {
            path: "start-event",
            pageTitle: event.name,
            event: event,
            totalPoints: totalPoints
        })

    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

// _____________________________________________________________ POST _______________________________________________________________

exports.postAddEvent = async (req, res, next) => {
    try {
        const body = req.body;
        const user = req.session.user;

        const isAdded = await eventHelper.postNewEvent(body, user);

        if (!isAdded) {
            errorHelper.throwServerError("Greska prilikom cuvanja!");
        }

        res.redirect("/admin/dogadjaji");
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postEditEvent = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postDeleteEvent = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports,postAddEventToLeague = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postStartEvent = async (req, res, next) => {
    try {
        const {eventId} = req.body;

        const isSuccess = await eventHelper.postStartEvent(eventId);

        if (isSuccess) {
            res.redirect(`/admin/zapocnite-dogadjaj/${eventId}`)
        }
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postEventTeamsScores = async (req, res, next) => {
    try {
        const body = req.body;

        const isSuccess = await eventHelper.postTeamsScores(body);

        if (isSuccess) {
            res.redirect(`/admin/dogadjaj-detalji/${body.eventId}?leaderboard=active`)
        }
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postAddTeamToEvent = async (req, res, next) => {
    try {
        const body = req.body;

        const isSuccess = await eventHelper.postAddTeamToEvent(body);

        if (isSuccess) {
            res.redirect(`/admin/dogadjaj-detalji/${body.eventId}?teams=active`)
        }
    } catch (err) {
        errorHelper.throwServerError(err);
    }
}
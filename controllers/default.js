const errorHelper = require('../helpers/error-helper');
const eventHelper = require('../helpers/event-helper');
const leagueHelper = require('../helpers/league-helper');

// _____________________________________________________________ GET _______________________________________________________________

exports.getHomePage = async (req, res, next) => {
    try {
        const events = await eventHelper.getEvents();

        const leagues = await leagueHelper.getLeagues();

        res.render("default/home", {
            path: "/",
            pageTitle: "Početna",
            events,
            leagues
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

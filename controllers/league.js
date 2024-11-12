const errorHelper = require('../helpers/error-helper');
const leagueHelper = require('../helpers/league-helper');

// _____________________________________________________________ GET _______________________________________________________________

exports.getLeaguesPage = async (req, res, next) => {
    try {
        const leagues = await leagueHelper.getLeagues();

        res.render("league/leagues", {
            path: "/lige",
            pageTitle: "Lige",
            leagues: leagues
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getLeagueDetailsPage = async (req, res, next) => {
    try {
        const leagueId = req.params.leagueId;

        const league = await leagueHelper.getLeagueById(leagueId);

        res.render("league/league-details", {
            path: "/liga-detalji",
            pageTitle: "Liga Detalji",
            league: league
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getEditLeaguePage = async (req, res, next) => {
    try {
        const leagueId = req.params.leagueId;

        const league = await leagueHelper.getLeagueById(leagueId);

        res.render("league/add-league", {
            path: "/izmeni-ligu",
            pageTitle: "Liga Izmena",
            league: league,
            edit: true,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getAddLeaguePage = (req, res, next) => {
    try { 
        res.render("league/add-league", {
            path: "/dodaj-ligu",
            pageTitle: "Liga Dodavanje",
            edit: false,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

// _____________________________________________________________ POST _______________________________________________________________

exports.postAddLeague = async (req, res, next) => {
    try {
        const body = req.body;

        const isAdded = await leagueHelper.postNewLeague(body);

        if (!isAdded) {
            errorHelper.throwServerError("Greska prilikom cuvanja!");
        }

        res.redirect("/admin/lige");
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postEditLeague = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postDeleteLeague = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postDeleteEventFromLeague = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
}
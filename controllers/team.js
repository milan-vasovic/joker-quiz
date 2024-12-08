const errorHelper = require('../helpers/error-helper');
const teamHelper = require('../helpers/team-helper');
const team = require('../models/team');

// _____________________________________________________________ GET _______________________________________________________________

exports.getTeamsPage = async (req, res, next) => {
    try {
        const teams = await teamHelper.getTeams();

        console.log(teams);
        
        res.render("team/teams", {
            path: "/timovi",
            pageTitle: "Timovi",
            teams: teams
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getTeamDetailsPage = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;

        const team = await teamHelper.getTeamById(teamId);

        res.render("team/team-details", {
            path: "/tim-detalji",
            pageTitle: "Tim Detalji",
            team: team
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getTeamMyProfilePage = async (req, res, next) => {
    try {
        const teamId = req.session.user._id;

        const team = await teamHelper.getTeamById(teamId);

        res.render("team/team", {
            path: "/moj-tim",
            pageTitle: "Moj Tim",
            user: team
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
}

exports.getAddTeamPage = (req, res, next) => {
    try {
        res.render("team/add-team", {
            path: "/dodaj-tim",
            pageTitle: "Tim Dodavanje",
            edit: false,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getEditTeamPage = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;

        const team = await teamHelper.getTeamById(teamId);
        
        res.render("team/add-team", {
            path: "/izmenite-tim",
            pageTitle: "Tim Izmena",
            team: team,
            edit: true,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

// _____________________________________________________________ POST _______________________________________________________________

exports.postAddTeam = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postEditTeam = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postDeleteTeam = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postAddTeamToEvent = async (req, res, next) => {
    try {
        const {teamId, eventId} = req.body;
        const isAdded = await teamHelper.postAddTeamToEvent(teamId, eventId);

        if (isAdded) {
            return res.status(201).redirect('/dogadjaj-detalji/'+eventId);
        }
    } catch (err) {
        errorHelper.throwServerError(err);
    }
}

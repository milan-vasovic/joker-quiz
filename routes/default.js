const express = require("express");

const router = express.Router();

const defaultController = require("../controllers/default");
const eventController = require("../controllers/event");
const leagueController = require("../controllers/league");

router.get("/", defaultController.getHomePage);

router.get("/dogadjaji", eventController.getEventsPage);

router.get("/dogadjaj-detalji/:eventId", eventController.getEventDetailsPage);

router.get("/lige", leagueController.getLeaguesPage);

router.get("/liga-detalji/:leagueId", leagueController.getLeagueDetailsPage);

module.exports = router;
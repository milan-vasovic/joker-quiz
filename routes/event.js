const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const eventController = require("../controllers/event");

const isAuth = require('../middlewares/is-auth');

const isAdmin = require('../middlewares/is-admin');

// _____________________________________________________________ GET _______________________________________________________________

router.get("/admin/dogadjaji", isAuth, isAdmin, eventController.getEventsPage);

router.get("/admin/dogadjaj-detalji/:eventId", isAuth, isAdmin, eventController.getEventDetailsPage);

router.get("/admin/izmena-dogadjaj/:eventId", isAuth, isAdmin, eventController.getEditEventPage);

router.get("/admin/dodavanje-dogadjaja", isAuth, isAdmin, eventController.getAddEventPage);

router.get("/admin/zapocnite-dogadjaj/:eventId", isAuth, isAdmin, eventController.getStartEventPage);

// _____________________________________________________________ POST _______________________________________________________________

router.post("/admin/dodajte-dogadjaj",
    [],
    isAuth, isAdmin, eventController.postAddEvent);

// router.post("/admin/izmenite-dogadjaj",
//     [],
//     isAuth, isAdmin, eventController.postEditEvent);

// router.post("/admin/izbrisite-dogadjaj",
//     [],
//     isAuth, isAdmin, eventController.postDeleteEvent);

// router.post("/admin/dodajte-dogadjaj-u-ligu",
//     [],
//     isAuth, isAdmin, eventController.postAddEventToLeague);

router.post("/admin/dodajte-tim-u-dogadjaj",
    [],
    isAuth, isAdmin, eventController.postAddTeamToEvent);

router.post("/admin/zapocnite-dogadjaj",
    [],
    isAuth ,isAdmin, eventController.postStartEvent);

router.post("/admin/dogadjaj-rezultati",
    [],
    isAuth ,isAdmin, eventController.postEventTeamsScores);

module.exports = router;
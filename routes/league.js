const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const leagueController = require("../controllers/league");

const isAuth = require('../middlewares/is-auth');

const isAdmin = require('../middlewares/is-admin');

// _____________________________________________________________ GET _______________________________________________________________

router.get("/admin/lige", isAuth, isAdmin, leagueController.getLeaguesPage);

router.get("/admin/liga-detalji/:leagueId", isAuth, isAdmin, leagueController.getLeagueDetailsPage);

router.get("/admin/izmenite-ligu/:leagueId", isAuth, isAdmin, leagueController.getEditLeaguePage);

router.get("/admin/dodavanje-lige", isAuth, isAdmin, leagueController.getAddLeaguePage);

// _____________________________________________________________ POST _______________________________________________________________

router.post("/admin/dodajte-ligu",
    [],
    isAuth, isAdmin, leagueController.postAddLeague);

router.post("/admin/izmenite-ligu",
    [], isAuth,
    isAdmin, leagueController.postEditLeague);

router.post("/admin/izbrisite-ligu",
    [],
    isAuth, isAdmin, leagueController.postDeleteLeague);

router.post("/admin/izbrisite-dogadjaj-iz-lige",
    [],
    isAuth, isAdmin, leagueController.postDeleteEventFromLeague);


module.exports = router;
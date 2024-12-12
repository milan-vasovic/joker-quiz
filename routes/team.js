const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const teamController = require("../controllers/team");


const isAuth = require('../middlewares/is-auth');

const isAdmin = require('../middlewares/is-admin');

// _____________________________________________________________ GET _______________________________________________________________

router.get("/admin/timovi", isAuth, isAdmin, teamController.getTeamsPage);

router.get("/moj-tim", isAuth, teamController.getTeamMyProfilePage);

router.get("/admin/tim-detalji/:teamId", isAuth, isAdmin, teamController.getTeamDetailsPage);

router.get("/admin/dodavanje-tima", isAuth, isAdmin, teamController.getAddTeamPage);

router.get("/admin/izmena-tima/:teamId", isAuth, isAdmin, teamController.getEditTeamPage);

// _____________________________________________________________ POST _______________________________________________________________

router.post("/admin/doajte-tim",
    [],
    isAuth, isAdmin, teamController.postAddTeam);

router.post("/admin/izmente-tim",
    [],
    isAuth, isAdmin, teamController.postEditTeam);

router.post("/admin/izbrisite-tim",
    [],
    isAuth, isAdmin, teamController.postDeleteTeam);

router.post("/prijavite-vas-tim", teamController.postAddTeamToEvent);
module.exports = router;
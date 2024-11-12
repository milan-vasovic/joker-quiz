const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const questController = require("../controllers/quest");

const isAuth = require('../middlewares/is-auth');

const isAdmin = require('../middlewares/is-admin');

// _____________________________________________________________ GET _______________________________________________________________

router.get("/admin/pitanja", isAuth, isAdmin, questController.getQuestsPage);

router.get("/admin/pitanje-detalji/:questionId", isAuth, isAdmin, questController.getQuestDetailsPage);

router.get("/admin/dodavanje-pitanja", isAuth, isAdmin, questController.getAddQuestPage);

router.get("/admin/izmenite-pitanje/:questionId", isAuth, isAdmin, questController.getEditQuestPage);

// _____________________________________________________________ POST _______________________________________________________________

router.post("/admin/dodajte-pitanje",
    [],
     questController.postAddQuest);

router.post("/admin/izmenite-pitanje",
    [],
    isAuth, isAdmin, questController.postEditQuest);

router.post("/admin/izbrisite-pitanje",
    [],
    isAuth, isAdmin, questController.postDeleteQuest);

module.exports = router;
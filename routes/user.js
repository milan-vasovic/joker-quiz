const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const userController = require("../controllers/user");

const isAuth = require('../middlewares/is-auth');

const isAdmin = require('../middlewares/is-admin');

router.get("/moj-profil", isAuth, userController.getUserMyProfilePage);

// router.post("/prijava-na-dogadjaj", isAuth, userController.postTeamRegisterForEvent);

// _____________________________________________________________ ADMIN _____________________________________________________________

// _____________________________________________________________ GET _______________________________________________________________

router.get("/admin/korisnici", isAuth, isAdmin, userController.getUsersPage);

router.get("/admin/dodavanje-korisnika", isAuth, isAdmin, userController.getAddUserPage);

router.get("/admin/izmena-korisnika/:userId", isAuth, isAdmin, userController.getEditUserPage);

router.get("/admin/korisnik-detalji/:userId", isAuth, isAdmin, userController.getUserDetailsPage);

// _____________________________________________________________ POST _______________________________________________________________

// router.post("/admin/doajte-korisnika",
//     [],
//     isAuth, isAdmin, userController.postAddUser);

// router.post("/admin/izmenite-korisnika",
//     [],
//     isAuth, isAdmin, userController.postEditUser);

// router.post("/admin/izbrisite-korisnika",
//     [],
//     isAuth, isAdmin, userController.postDeleteUser);

module.exports = router;
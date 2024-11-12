const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");


const isAuth = require('../middlewares/is-auth');

const isAdmin = require('../middlewares/is-admin');

router.get("/dashboard", isAuth, isAdmin, adminController.getAdminDashBoardPage);

module.exports = router;
const express = require("express");

const router = express.Router();

const errorController = require("../controllers/error");

// _____________________________________________________________ GET _______________________________________________________________

router.get("/404", errorController.get404Page);

router.get("/500", errorController.get500Page);

module.exports = router;
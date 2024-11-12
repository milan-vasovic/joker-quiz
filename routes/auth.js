const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

router.get("/prijava", authController.getLoginPage);

router.get("/registracija", authController.getRegisterPage);

router.get("/zatrazite-novu-sifru", authController.getRequrestNewPasswordPage);

router.get("/nova-sifra/:token", authController.getNewPasswordPage);

router.post("/prijava-tim",
    [
        check('email')
        .isEmail()
        .withMessage("Unesite validan Email!"),
        body(
            'password',
            "Šifra mora da ima bar 5 karaktera!"
        )
        .isLength({min:5}),
    ],
    authController.postLoginTeam);

router.post("/prijava-korisnik",
    [
        check('email')
        .isEmail()
        .withMessage("Unesite validan Email!"),
        body(
            'password',
            "Šifra mora da ima bar 5 karaktera!"
        )
        .isLength({min:5}),    
    ],
    authController.postLoginUser);

router.post("/registracija",
    [
        check('email')
        .isEmail()
        .withMessage("Unesite validan Email!"),
        body(
            'password',
            "Šifra mora da ima bar 5 karaktera!"
        )
        .isLength({min:5}),
        body('confirmedPassword')
        .custom((value, {req}) => {
            if (value === req.body.password) {
                return true;
            }
            throw new Error("Šifra i Potvrđena Šifra moraju da se poklapaju!");
        }),
    ],
    authController.postRegisterTeam);

router.post('/logout', [], authController.postLogout);

router.post("/zatrazite-novu-sifru",
    [
        check('email')
        .isEmail()
        .withMessage("Unesite validan Email!")
    ],
    authController.postRequestNewTeamPassword);

router.post("/nova-sifra",
    [
        body('password')
        .isLength({min:5})
        .withMessage("Šifra mora da ima bar 5 karaktera!"),
        body("confirmedPassword")
        .custom((value, {req}) => {
            if (value === req.body.password) {
                return true;
            }
            throw new Error("Šifra i Potvrđena Šifra moraju da se poklapaju!")
        })
    ],
    authController.postSetNewTeamPassword);

module.exports = router;
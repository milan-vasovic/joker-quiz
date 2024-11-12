const errorHelper = require('../helpers/error-helper');
const authHelper = require('../helpers/auth-helper');
const cryptoHelper = require('../helpers/crypto-helper');

const { validationResult, check } = require("express-validator");

// _____________________________________________________________ GET _______________________________________________________________

exports.getLoginPage = (req, res, next) => {
    try {
        const isUser = req.query.login;

        if (!isUser) {
            return res.render("auth/login", {
                pageTitle: "Prijava na Tim",
                path: '/prijava',
                isUser: false,
                errorMessage: ''
            });
        }

        res.render("auth/login", {
            pageTitle: "Prijava na Korisnika",
            path: '/prijava',
            isUser: true,
            errorMessage: ''
        });

    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getRegisterPage = (req, res, next) => {
    try {
        res.render("auth/register", {
            pageTitle: "Registracija Tima",
            path: '/registracija',
            errorMessage: ''
        })
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getRequrestNewPasswordPage = (req, res, next) => {
    try {
        res.render("auth/get-new-password", {
            path: "/zatrazite-novu-sifru",
            pageTitle: "Zatražite novu Šifru",
            errorMessage: '',
            existingData: ""
        })
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getNewPasswordPage = async (req, res, next) => {
    try {
        const token = req.params.token;

        const team = await authHelper.getTeamByToken(token);

        if (!team) {
            errorHelper.throwServerError("Nije moguće pronaći tim!");
        }

        res.render("auth/set-new-password", {
            path: "/set-new-password",
            pageTitle: "Postavite novu Šifru",
            token: token,
            teamId: team._id,
            errorMessage: "",
            existingData: ""
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

// _____________________________________________________________ POST _______________________________________________________________

exports.postLoginTeam = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("auth/login", {
                path: "/prijava",
                pageTitle: "Prijava na Tim",
                errorMessage: errors.array()[0].msg,
                existingData: { email },
                isUser: false
            });
        }

        const teamExist = await authHelper.checkDoesTeamEmailExist(email);

        if (!teamExist) {
            return res.status(404).render("auth/login", {
                path: "/prijava",
                pageTitle: "Prijava na Tim",
                errorMessage: "Ne postoji Tim sa tim emailom!",
                existingData: { email },
                isUser: false
            });
        }

        const checkPassword = await cryptoHelper.compareTeamPasswords(password, teamExist._id);

        if (!checkPassword) {
            return res.status(404).render("auth/login", {
                path: "/prijava",
                pageTitle: "Prijava na Tim",
                errorMessage: "Pogrešna šifra!",
                existingData: { email },
                isUser: false
            });
        }

        const team = await authHelper.getTeamById(teamExist._id);

        if (team) {
            req.session.isLoggedIn = true;
            req.session.user = team;

            return res.redirect("/moj-tim")
        }
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postLoginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("auth/login", {
                path: "/prijava",
                pageTitle: "Prijava na Korisnika",
                errorMessage: errors.array()[0].msg,
                existingData: { email },
                isUser: true
            });
        }

        const userExist = await authHelper.checkDoesUserEmailExist(email);

        if (!userExist) {
            return res.status(404).render("auth/login", {
                path: "/prijava",
                pageTitle: "Prijava na Korisnika",
                errorMessage: "Ne postoji Korisnik sa tim emailom!",
                existingData: { email },
                isUser: true
            });
        }

        const checkPassword = await cryptoHelper.compareUserPasswords(password, userExist._id);

        if (!checkPassword) {
            return res.status(404).render("auth/login", {
                path: "/prijava",
                pageTitle: "Prijava na Korisnika",
                errorMessage: "Pogrešna šifra!",
                existingData: { email },
                isUser: true
            });
        }

        const user = await authHelper.getUserById(userExist._id);

        if (user) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            res.redirect("/moj-profil");
        }
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postRegisterTeam = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("auth/register", {
                path: "/registracija",
                pageTitle: "Registracija",
                errorMessage: errors.array()[0].msg,
                existingData: { name, email }
            });
        }
        const doesExist = await authHelper.checkDoesTeamEmailExist(email);
        if (doesExist) {
            return res.status(409).render("auth/register", {
                path: "/registracija",
                pageTitle: "Registracija",
                errorMessage: "Ovaj email je zauzet!",
                existingData: { name, email }
            });
        }
        const hashedPassword = await cryptoHelper.hashPassword(password);

        await authHelper.addTeam(name, email, hashedPassword);

        res.render("auth/login", {
            path: "/login",
            pageTitle: "My Team",
            isUser: false,
            errorMessage: '',
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postRequestNewTeamPassword = async (req, res, next) => {
    try {
        const {email} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("auth/get-new-password", {
                path: "/get-new-password",
                pageTitle: "Zatrazite novu Šifru",
                errorMessage: errors.array()[0].msg,
                existingData: { email }
            });
        };

        const teamExist = await authHelper.checkDoesTeamEmailExist(email);

        if (!teamExist) {
            return res.status(404).render("auth/get-new-password", {
                path: "/get-new-password",
                pageTitle: "Zatrazite novu Šifru",
                errorMessage: "Ne postoji Korisnik sa tim emailom!",
                existingData: { email },
            });
        };

        const hasRequested = await authHelper.postTeamRequestNewPassword(email, teamExist._id);

        if (!hasRequested) {
            return res.status(404).render("auth/get-new-password", {
                path: "/get-new-password",
                pageTitle: "Zatrazite novu Šifru",
                errorMessage: "Email nije poslat!",
                existingData: { email },
            });
        }

        res.render("auth/login", {
                path: "/prijava",
                pageTitle: "Prijava na Korisnika",
                errorMessage: "",
                existingData: {},
                isUser: false
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postSetNewTeamPassword = async (req, res, next) => {
    try {
        const {password, token, teamId} = req.body;

        const hashedPassword = await cryptoHelper.hashPassword(password);

        if (!hashedPassword) {
            return res.render("auth/set-new-password", {
                path: "/set-new-password",
                pageTitle: "Postavite novu Šifru",
                token: token,
                teamId: teamId,
                errorMessage: "Hashovanje sifre nije uspelo!",
                existingData: ""
            });
        }

        const hasSucceed = await authHelper.postTeamNewPassword(hashedPassword);

        if (!hasSucceed) {
            return res.render("auth/set-new-password", {
                path: "/set-new-password",
                pageTitle: "Postavite novu Šifru",
                token: token,
                teamId: teamId,
                errorMessage: "Hashovanje sifre nije uspelo!",
                existingData: ""
            });
        }

        res.render("auth/login", {
            path: "/prijava",
            pageTitle: "Prijava na Korisnika",
            errorMessage: "",
            existingData: {},
            isUser: false
        });   
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postLogout = (req, res, next) => {
    try {
        req.session.destroy(() => {
            res.redirect("/");
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};
const errorHelper = require('../helpers/error-helper');

// _____________________________________________________________ GET _______________________________________________________________

exports.get404Page = (req, res, next) => {
    try {
        res.status(404).render('error/404error', {
            pageTitle: "Stranica Nije Pronađena",
            path: "/404",
            isAuthenticated: req.session.isLoggedIn,
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.get409Page = (req, res, next) => {
    try {
        res.status(409).render('error/409error', {
            pageTitle: "Desio se Konflikt!",
            path: "/409",
            errorMsg: error,
            isAuthenticated: req.session.isLoggedIn
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.get500Page = (req, res, next) => {
    try {
        res.status(500).render('error/500error', {
            pageTitle: "Greška na Serveru!",
            path: "/500",
            errorMsg: error,
            isAuthenticated: req.session.isLoggedIn
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};
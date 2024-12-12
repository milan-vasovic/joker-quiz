const errorHelper = require('../helpers/error-helper');
const eventHelper = require('../helpers/event-helper');
const leagueHelper = require('../helpers/league-helper');
const { join, basename } = require('path');
const { access, constants, createReadStream } = require('fs');

// _____________________________________________________________ GET _______________________________________________________________

exports.getHomePage = async (req, res, next) => {
    try {
        const events = await eventHelper.getEvents();

        const leagues = await leagueHelper.getLeagues();

        let activeEvents, activeLeagues;

        if (!req.query.leagues) {
            activeEvents = 'active';
        } else {
            activeEvents = undefined;
            activeLeagues = "active";
        }

        res.render("default/home", {
            path: "/",
            pageTitle: "Početna",
            events,
            leagues,
            activeEvents,
            activeLeagues
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getImages = async (req, res, next) => {
    try {
        // Sanitizacija imena fajla da se izbegne "directory traversal"
        const imagePath = basename(req.params.imagePath);
        const localImagePath = join(__dirname, '../..', 'images', imagePath);

        // Proveravamo da li fajl postoji
        access(localImagePath, constants.F_OK, (err) => {
            if (err) {
                console.error(`Fajl nije pronađen: ${localImagePath}`);
                const error = new Error("Fajl nije pronađen!");
                error.httpStatusCode = 404;
                return next(error);
            }

            // Čitamo i šaljemo fajl kao odgovor
            const imageStream = createReadStream(localImagePath);
            imageStream.on('error', (err) => {
                console.error("Greška prilikom čitanja fajla:", err.message);
                const error = new Error("Greška prilikom čitanja fajla.");
                error.httpStatusCode = 500;
                return next(error);
            });
            imageStream.pipe(res);
        });
    } catch (err) {
        console.error("Nepredviđena greška u kontroleru za slike:", err.message);
        const error = new Error("Nepredviđena greška! " + err.message);
        error.httpStatusCode = 500;
        next(error);
    }
};
const path = require('path');

module.exports = async (req, res, next) => {
    try {
        // Proveravamo da li postoji parametar imagePath i da li ima validnu ekstenziju
        const imagePath = req.params.imagePath && 
            (req.params.imagePath.includes('.png') || req.params.imagePath.includes('.jpg') || req.params.imagePath.includes('.jpeg'))
            ? `/images/${req.params.imagePath}`
            : undefined;

        // Proveravamo da li postoji sesija i validna putanja slike
        if (imagePath) {
            return next();
        } else {
            return imageNotFoundError(next, imagePath);
        }
    } catch (err) {
        console.error("Greška u middleware-u za validaciju slike:", err.message);
        const error = new Error(err.message || "Greška na serveru!");
        error.httpStatusCode = 500;
        next(error);
    }
};

// Pomoćna funkcija za rukovanje greškom
const imageNotFoundError = (next, imagePath) => {
    const error = new Error(`Slika nije pronađena! Path: ${imagePath || "undefined"}`);
    error.httpStatusCode = 404;
    next(error);
};

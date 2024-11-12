const errorHelper = require('../helpers/error-helper');

// _____________________________________________________________ GET _______________________________________________________________

exports.getDashBoardPage = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};
const errorHelper = require('../helpers/error-helper');
const userHelper = require('../helpers/user-helper');

// _____________________________________________________________ GET _______________________________________________________________
exports.getUserMyProfilePage = async (req, res, next) => {
    try {
        console.log("Uslo!");
        const userId = req.session.user._id;
        
        const user = await userHelper.getUserById(userId);

        res.render("user/my-profile", {
            path: "/moj-profil",
            pageTitle: "Moj Profil",
            user: user
        });
    } catch (err) {
        console.log(err);
        errorHelper.throwServerError(err);
    }
};

exports.getUsersPage = async (req, res, next) => {
    try {
        const users = await userHelper.getUsers();

        res.render("user/users", {
            path: '/korisnici',
            pageTitle: "Korisnici",
            users: users
        })
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getAddUserPage = (req, res, next) => {
    try {
        res.render("user/add-user", {
            path: "/dodajte-korisnika",
            pageTitle: "Korisnik Dodavanje",
            edit: false,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        console.log(err);
        errorHelper.throwServerError(err);
    }
};

exports.getEditUserPage = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await userHelper.getUserById(userId);

        res.render("user/add-user", {
            path: "/dodaj-korisnika",
            pageTitle: "Korisnik Dodavanje",
            user: user,
            edit: true,
            errorMessage: "",
            existingData: {}
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.getUserDetailsPage = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await userHelper.getUserById(userId);

        res.render("user/user-profile", {
            path: "/korisnik-profil",
            pageTitle: "Korisnik Profil",
            user: user,
        });
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

// _____________________________________________________________ POST _______________________________________________________________

exports.postAddUser = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postEditUser = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};

exports.postDeleteUser = async (req, res, next) => {
    try {
        next();
    } catch (err) {
        errorHelper.throwServerError(err);
    }
};
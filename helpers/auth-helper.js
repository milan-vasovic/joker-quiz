const TeamModel = require('../models/team');
const UserModel = require('../models/user');
const errorHelper = require("../helpers/error-helper");
const emailHelper = require("../helpers/email-helper");
const cryptoHelper = require("../helpers/crypto-helper");

exports.checkDoesTeamEmailExist = async (email) => {
    const teamExist = await TeamModel.findOne({email: email}).select("email");
    if (teamExist) {
        return teamExist;
    }
    return false
};

exports.checkDoesUserEmailExist = async (email) => {
    const userExist = await UserModel.findOne({email: email}).select("email");
    if (userExist) {
        return userExist;
    }
    return false
};

exports.getTeams = async () => {
    const teams = await TeamModel.find();
    if (!teams) {
        errorHelper.throwNotFoundError("timovi");
    }
    return teams;
};

exports.getTeamByToken = async (token) => {
    const team = await TeamModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }}).select("_id");
    if (!team) {
        errorHelper.throwNotFoundError("tim");
    }
    return team;
};

exports.getUsers = async () => {
    const users = await UserModel.find();
    if (!users) {
        errorHelper.throwNotFoundError("korisnici");
    }
    return users;
};

exports.addTeam = async (name, email, password) => {
    const newTeam =  new TeamModel({
        name: name,
        email: email,
        password: password
    });
    await newTeam.save();
};

exports.addUser = async (user) => {
    const newUser = new UserModel(user);
    await newUser.save();
};

exports.getTeamById = async (id) => {
    const team = await TeamModel.findById(id).select("-password");

    if (!team) {
        errorHelper.throwNotFoundError("tim");
    }

    return team;
};

exports.getUserById = async (id) => {
    const user = await UserModel.findById(id).select("-password");

    if (!user) {
        errorHelper.throwNotFoundError("korisnik");
    }

    return user;
};

exports.postTeamRequestNewPassword = async (email, id) => {
    const team = await TeamModel.findOne(id);

    if (!team) {
        errorHelper.throwNotFoundError("tim");
    }

    if (team.resetToken && team.resetTokenExpiration > Date.now()) {
        errorHelper.throwConflictError("Token jos nije istekao!");
    };

    const token = await cryptoHelper.createResetToken();

    if (!token) {
        errorHelper.throwServerError("Nije moguće generisati token!");
    }

    const isSent = await emailHelper.sendTeamResetPasssword(email, token);

    if (!isSent) {
        errorHelper.throwServerError("Email nije poslat");
    }

    team.resetToken = token;
    team.resetTokenExpiration = new Date(Date.now() + 3600000);

    try {
        await team.save();
        return true;
    } catch (err) {
        return false;
    }
};

exports.postTeamNewPassword = async (password, id) => {
    const team = await TeamModel.findOne(id).select("password resteToken resetTokenExpiration");
    team.password = password;
    team.resetToken = undefined;
    team.resetTokenExpiration = undefined;
    await team.save();
    return true
};
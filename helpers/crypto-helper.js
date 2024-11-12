const bcrypt = require("bcryptjs");
const errorHelper = require("../helpers/error-helper");
const crypto = require("crypto");

const UserModel = require('../models/user');
const TeamModel = require('../models/team');

exports.hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12);

    if (!hashedPassword) {
        errorHelper.throwServerError("Desila se neočekivana greška!");
    }

    return hashedPassword;
}

exports.compareUserPasswords = async (password, id) => {
    const user = await UserModel.findById(id).select("password");

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
        return false;
    };

    return true;
}

exports.compareTeamPasswords = async (password, id) => {
    const team = await TeamModel.findById(id).select("password");

    const doMatch = await bcrypt.compare(password, team.password);

    if (!doMatch) {
        return false;
    };

    return true;
}

exports.createResetToken = async () => {
    const buffer = await new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buf) => {
            if (err) {
                reject("Desila se neočekivana greška!");
            } else {
                resolve(buf);
            }
        });
    });
    return buffer.toString("hex");
}
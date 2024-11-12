const UserModel = require("../models/user");
const errorHelper = require("../helpers/error-helper");

exports.getUsers = async () => {
    const users = await UserModel.find();
    return users.length > 0 ? users : [];
};

exports.getUserById = async (id) => {
    const user = await UserModel.findById(id).select("-password");
    console.log(user);
    if (!user) {
        errorHelper.throwNotFoundError("korisnik");
    }
    return user;
};

exports.postNewUser = async (user) => {
    const newUser = new UserModel(user);
    await newUser.save();
};

exports.postEditUser = async (user) => {
    await UserModel.findOneAndUpdate(
        { _id: user._id },
        user
    );
};

exports.postDeleteUser = async (id) => {
    await UserModel.findOneAndDelete({ _id: id });
};

const HttpError = require('../models/http-error');

const User = require('../models/user');

const getUsers = async (req,res,next) => {
    let users;
    try {
        users = await User.find({});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ users: users });
}

const signup = async (req,res,next) => {
    const { email, password } = req.body;

    const newUser = new User({
        email,
        password
    });

    try {
        await newUser.save();
    } catch (err) {
        const error = new HttpError('Creating User failed', 500)
        return next(error);
    }

    res.status(201).json({ user: newUser })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser
    try {
        existingUser = await User.findOne({email:email});
    } catch (err) {
        const error = new HttpError('Login failed!',500);
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError('Invalid email or password',401);
        return next(error);
    }

    res.json({user: existingUser.email})
};

const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findByIdAndDelete(userId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete user.', 500);
        return next(error);
    }
    res.status(200).json({ message: 'Succesful delete action!' });
}

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser;
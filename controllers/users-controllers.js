const HttpError = require('../models/http-error');

const User = require('../models/user');

const getUsers = async (req,res,next) => {
    let users;
    try {
        users = await User.find({}).sort({creation:-1});
    } catch (err) {
        const error = new HttpError('Something went wrong', 500);
        return next(error);
    }
    res.json({ users: users });
}

const signup = async (req,res,next) => {
    const { email, password } = req.body;

    const newUser = new User{
        email,
        password
    }

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

    res.json({message: 'Logged in!'})
};

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
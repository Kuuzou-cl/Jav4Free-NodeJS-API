const HttpError = require('../models/http-error');

const User = require('../models/user');

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
const HttpError = require('../models/http-error');

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = ARRAY.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user', 401)
    }

    res.json({message: 'Logged in!'})
};

exports.login = login;
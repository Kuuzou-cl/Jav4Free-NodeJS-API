const jwt = require("jsonwebtoken");
const config = require('../config/config');

module.exports = function (req, res, next) {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
        const decoded = jwt.verify(token, config.key);
        req.user = decoded;
        next();
    } catch (ex) {
        res.json({alive: false});
    }
};
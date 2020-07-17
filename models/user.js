const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
})

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const javSchema = new Schema({
    name: { type: String, unique: false },
    code: { type: String },
    url: { type: String },
    duration: { type: String },
    imageUrl: { type: String },
    imageIndexUrl: { type: String },
    hidden: { type: Boolean, default: false, },
    categories: {
        type: [String], unique: false
    },
    idols: {
        type: [String], unique: false
    },
    creation: { type: Date, default: Date.now }
})

module.exports = mongoose.model('jav4free-jav', javSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SceneSchema = new Schema({
    title: { type: String, unique: true },
    url: { type: String },
    hidden: { type: Boolean, default: true, unique: false },
    categories: {
        type: [String], unique: false
    },
    creation: { type: Date, default: Date.now }
})

module.exports = mongoose.model('rule34hub-video', SceneSchema);
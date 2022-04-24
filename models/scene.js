const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SceneSchema = new Schema({
    name: { type: String, unique: false },
    jav: { type: String, unique: false },
    code: { type: String, unique: false },
    url: { type: String },
    duration: { type: String, unique: false },
    imageUrl: { type: String },
    imageIndexUrl: { type: String },
    hidden: { type: Boolean, default: true, unique: false },
    categories: {
        type: [String], unique: false
    },
    idols: {
        type: [String], unique: false
    },
    creation: { type: Date, default: Date.now }
})

module.exports = mongoose.model('jav4free-scene', SceneSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ViewSchema = new Schema({
    video: { type: String, unique: false },
    creation: { type: Date, default: Date.now }
})

module.exports = mongoose.model('jav4free-view', ViewSchema);
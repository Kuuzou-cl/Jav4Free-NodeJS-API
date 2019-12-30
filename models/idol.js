const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const idolSchema = new Schema({
    name:{ type:String},
    imageUrl:{ type:String},
    hidden: { type: Boolean, default: false},
    creation: { type : Date, default: Date.now },
})

module.exports = mongoose.model('jav4free-idol',idolSchema);
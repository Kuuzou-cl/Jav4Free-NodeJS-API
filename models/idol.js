const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const idolSchema = new Schema({
    name:{ type:String, required: true },
    imageUrl:{ type:String, required:true },
    hidden: { type: Boolean, default: false, required: true },
})

module.exports = mongoose.model('Idol',idolSchema);
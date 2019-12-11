const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const idolSchema = new Schema({
    idol_id: { type:String, required: true },
    name:{ type:String, required: true },
    imageUrl:{ type:String, required:true }
})

module.exports = mongoose.model('Idol',idolSchema);
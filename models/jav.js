const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const javSchema = new Schema({
    jav_id: { type:String, required: true },
    name:{ type:String, required: true },
    code:{ type:String, required: true },
    url:{ type:String, required: true },
    duratio:{ type:String, required: true },
    imageUrl:{ type:String, required: true },
    imageUrl:{ type:String, required: true }
})

module.exports = mongoose.model('Jav',javSchema);
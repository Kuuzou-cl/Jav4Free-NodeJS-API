const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name:{ type:String, required: true },
    javs:[{type:mongoose.Types.ObjectId, required: true, ref:'jav4free-jav'}]
})

module.exports = mongoose.model('jav4free-category',categorySchema);
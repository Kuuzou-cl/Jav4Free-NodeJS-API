const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const idolSchema = new Schema({
    name:{ type:String, required: true },
    imageUrl:{ type:String, required:true },
    hidden: { type: Boolean, default: false, required: true },
    javs:[{type:mongoose.Types.ObjectId, required: true, ref:'jav4free-jav'}]
})

module.exports = mongoose.model('jav4free-idol',idolSchema);
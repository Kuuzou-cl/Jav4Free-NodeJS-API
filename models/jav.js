const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const javSchema = new Schema({
    name:{ type:String, required: true },
    code:{ type:String, required: true, unique: true },
    url:{ type:String, required: true },
    duration:{ type:String, required: true },
    imageUrl:{ type:String, required: true },
    imageIndexUrl:{ type:String, required: true },
    hidden: { type: Boolean, default: false, required: true },    
    categories: [{type:mongoose.Types.ObjectId, required: true, ref:'jav4free-category', unique: true}],
    idols: [{type:mongoose.Types.ObjectId, required: true, ref:'jav4free-idol', unique: true}],
    creation: { type : Date, default: Date.now }
})

module.exports = mongoose.model('jav4free-jav',javSchema);
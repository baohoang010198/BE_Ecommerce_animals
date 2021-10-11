const mongoose = require('mongoose');

const adviseSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true,
    },
    phoneNumber:{
        type:String,
        required: true,
        trim: true,
    },
    status:{
        type:Number,
        required: true,
        trim: true,
        default:0,
    },
},
{
    timestamps: true,
},
)

module.exports = mongoose.model('Advise',adviseSchema)
const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    adress:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    phoneNumber:{
        type:String,
        required: true,
        unique:true,
    },
    wage:{
        type:Number,
        default:0
    }
},
{
    timestamps: true,
},
)

module.exports = mongoose.model('Employe',employeSchema)
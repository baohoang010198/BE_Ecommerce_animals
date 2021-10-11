const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    employe_Id:{
        type:String,
        required: true,
    },
    phoneNumber:{
        type:String,
        required: true,
    },
    wage:{
        type:Number,
        required: true,
    }
},
{
    timestamps: true,
},
)

module.exports = mongoose.model('Attendances',attendanceSchema)
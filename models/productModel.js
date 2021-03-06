const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_Id:{
        type:String,
        unique:true,
        trim:true,
        required:true,
    },
    title:{
        type:String,
        required: true,
        trim: true,
    },
    price:{
        type:Number,
        trim:true,
        required:true,
    },
    description:{
        type:String,
        required: true,
    },
    content:{
        type:String,
        required: true,
    },
    images:{
        type:Object,
        required: true,
    },
    category_Id:{
        type:String,
        required: true,
    },
    checked:{
        type:Boolean,
        default: false,
    },
    inventory:{
        type:Number,
        default: 0,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Products',productSchema)
const mongoose = require('mongoose');
const moment = require('moment')
const Sales = new mongoose.Schema({
    product_name:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    quantity:{
        type:Number,
        default:0,
        required: true
    },
    day:{
        type: String,
        default:moment().format('dddd')
    }
})

module.exports =  mongoose.model('sales', Sales);
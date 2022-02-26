const mongoose = require('mongoose');
const productModel = new mongoose.Schema({
    product_name:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    popularity:{
        type: Number,
        default:0
    }
})

module.exports = mongoose.model('products',productModel);
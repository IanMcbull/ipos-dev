const mongoose = require('mongoose');
const moment = require('moment');
const Expense = new mongoose.Schema({
    expense_name:{
        type: String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    day:{
        type:String,
        default:moment().format('dddd')
    }
       
})

module.exports = mongoose.model('expenses',Expense);
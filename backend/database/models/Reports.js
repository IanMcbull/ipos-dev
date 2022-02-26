const mongooose = require('mongoose');
const ReportSchema = new mongooose.Schema({
   name:{
       type: String,
       required:true
   },
   amount:{
       type:Number,
       required: true
   },
   category:{
       type: String,
       required:true
   },
   quantity:{
       type: Number,
       default:1
   },
   day:{
       type: String,
       required:true
   }    
})

module.exports = mongooose.model('reports',ReportSchema)
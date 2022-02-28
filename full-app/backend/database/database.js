const mongoose = require('mongoose');

const connectDb = async () =>{
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mukenya_restraunt_database',{
            useNewUrlParser: true,
            useUnifiedTopology:false
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error) 
        process.exit(1)   
    }
}

module.exports = connectDb
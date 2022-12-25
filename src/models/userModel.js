const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name : {type : String , required : true} ,
    email : {type : String , required : true} ,
    phone : {type : String , required : true} ,
    bio : {type : String},
    password : {type : String , required : true} ,
    country : {type : String},
    photo : {type : String}
}, {timestamps : true})

module.exports = mongoose.model('user' , userSchema)
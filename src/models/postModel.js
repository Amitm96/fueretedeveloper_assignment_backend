const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    photo : {type: String , required : true} ,
    caption : {type : String} ,
    isDeleted : {type : Boolean , default : false},
    userId : {type : mongoose.Schema.Types.ObjectId , ref : "user"}

} , {timestamps : true})

module.exports = mongoose.model("post" , postSchema)
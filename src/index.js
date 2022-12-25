const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require("cors")
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');

const app = express()

app.use(cors());

app.use(multer().any())
app.use(express.json())

app.use("/user" , userRoute)
app.use("/post" , postRoute)

const url = "mongodb+srv://Amitmaz96:5YOiTjMdLmeCiWAC@cluster1.mdpsbcj.mongodb.net/furetadevassignDb?retryWrites=true&w=majority"
mongoose.connect(url,{useNewUrlParser:true})
.then(()=> console.log("Mongodb is connected"))
.catch(err => console.log(err))

app.listen(5000, function(){
    console.log("express app is running on PORT 5000")
})
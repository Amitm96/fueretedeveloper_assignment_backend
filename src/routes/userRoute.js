const express= require("express")
const {registerUser , loginUser , updateUser} = require("../controller/userController");
const { verifyUser } = require("../middleware/auth");
const userRoute = express.Router();

userRoute.post("/registeruser" , registerUser)
userRoute.post("/login" , loginUser)
userRoute.put("/updateuser" , verifyUser , updateUser)

module.exports = userRoute
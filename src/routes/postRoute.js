const express= require("express");
const {createPost , getallPosts , postsbyUser} = require("../controller/postController");
const { verifyUser } = require("../middleware/auth");
const postRoute = express.Router();

postRoute.post("/createpost" ,verifyUser ,createPost)
postRoute.get("/getallpost" , getallPosts)
postRoute.get("/postbyuser" ,verifyUser , postsbyUser)

module.exports = postRoute
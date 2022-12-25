let postModel = require("../models/postModel");
let { uploadFile, isImageFile } = require('../awsconfig/awsconfig');
const userModel = require("../models/userModel");

async function createPost(req , res){
    try{

        let postdata = {}
        let files = req.files
        if(files.length == 0){
            return res.status({status : false , msg : "please select file for post"})
        }
        if (!isImageFile(files[0])) {
            return res.status(400).send({ status: false, msg: "Only image file is valid" })
        }
        if (files && files.length > 0) {
            let fileS3Link = await uploadFile(files[0], "postimg")
            postdata.photo = fileS3Link
        }
        if(req.body.caption.trim()){
            postdata.caption = req.body.caption.trim()
        }
        else{
            postdata.caption = "post caption"
        }
        
        postdata.userId = req.userId
        let newPost = await postModel.create(postdata)
        return res.status(201).send({status : true , msg : "post created successfuly" , data : newPost})
    }
    catch(err){
        return res.status(500).send({status : false , msg : err.message})
    }
}

async function getallPosts(req , res){
    try{
        let allPosts = await postModel.find({isDeleted : false}).populate("userId")
        return res.status(200).send({status : true , data : allPosts})
    }
    catch(err){
        return res.status(500).send({status : false , msg : err.message})
    }
}

async function postsbyUser(req , res){
    try{
        let userId = req.userId
        let postsbyUser = await postModel.find({isDeleted : false , userId : userId})
        return res.status(200).send({status : true , data : postsbyUser})
    }
    catch(err){
        return res.status(500).send({status : false , msg : err.message})
    }
}

module.exports = {createPost , getallPosts , postsbyUser}
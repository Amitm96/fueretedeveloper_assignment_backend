let userModel = require('../models/userModel');
let jwt = require('jsonwebtoken');
let { uploadFile, isImageFile } = require('../awsconfig/awsconfig');
let bcrypt = require("bcrypt");

async function registerUser(req, res) {
    try {
        let data = req.body;

        let files = req.files
        if (!isImageFile(files[0])) {
            return res.status(400).send({ status: false, msg: "Only image file is valid" })
        }

        if (files && files.length > 0) {

            // console.log(files)
            let fileS3Link = await uploadFile(files[0], "profimg")
            data.photo = fileS3Link
        }
        let { Name, email, phone, bio, password, country } = data
        if (!Name.trim()) {
            return res.status(400).send({ status: false, msg: "please enter Name" })
        }

        if (!/^[a-zA-Z ]*$/.test(Name.trim())) {
            return res.status(400).send({ status: false, msg: "enter valid Name" })
        }
        if (!email.trim()) {
            return res.status(400).send({ status: false, msg: " please enter email" })
        }

        if (!/^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "Entered email is invalid" });
        }

        let existemail = await userModel.findOne({ email: email })
        if (existemail) {
            return res.status(400).send({ status: false, msg: "this email is already register in our Database" })
        }
        if (!phone) {
            return res.status(400).send({ status: false, msg: " please enter phone" })
        }

        if (phone.length > 10 || phone.length < 10) {
            return res.status(400).send({ status: false, msg: "invalid phone number  is not allowed" })
        }

        let existPhone = await userModel.findOne({ phone: phone })

        if (existPhone) {
            return res.status(400).send({ status: false, msg: "this phone number is already exist" })
        }
        if (!password.trim()) {
            return res.status(400).send({ status: false, msg: "provide password" })
        }
        if (password.trim().length > 15 || password.trim().length < 8) {
            return res.status(400).send({ status: false, msg: "password length should be 8-15 character long" })
        }
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(password, salt);
        if (!country.trim()) {
            return res.status(400).send({ status: false, msg: "please provide country name" })
        }
        if (!/^[a-zA-Z ]*$/.test(country.trim())) {
            return res.status(400).send({ status: false, msg: "enter valid country name" })
        }
        let newUser = await userModel.create(data)
        return res.status(201).send({ status: true, data: newUser, msg: "User Successfully registered" })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

async function loginUser(req, res) {
    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "plese enter credincials in body" })
        }

        let existUser = await userModel.findOne({ email: req.body.email })
        if (!existUser) {
            return res.status(401).send({ status: false, msg: "invalid credincial" })
        }
        let validPassword = await bcrypt.compare(req.body.password, existUser.password)
        if (!validPassword) {
            return res.status(401).send({ status: false, msg: "invalid credincial" })

        }

        let token = jwt.sign({
            userId: existUser._id.toString(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24

        }, "fdevasssignprjctseckey")
        let data = {token : token , user : existUser.Name}

        return res.status(200).send({ status: true, msg: "user login Successfully", data: data })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

async function updateUser(req, res) {
    try {
        let userId = req.userId
        let existUser = await userModel.findById(userId)
        let files = req.files
        
        if (files && files.length > 0) {
            if (!isImageFile(files[0])) {
                return res.status(400).send({ status: false, msg: "Only image file is valid" })
            }
            let fileS3Link = await uploadFile(files[0], "profimg")
            existUser.photo = fileS3Link
        }
        let data = req.body
        if (data.Name) {
            if (!/^[a-zA-Z ]*$/.test(data.Name.trim())) {
                return res.status(400).send({ status: false, msg: "enter valid Name" })
            }
            existUser.Name = data.Name.trim()
        }
        if (data.phone) {
            if (!/^[6-9]\d{9}$/.test(data.phone)) {
                return res.status(400).send({ status: false, msg: "ivalid phone number or space is not allowed" })
            }
    
            let existPhone = await userModel.findOne({ phone: data.phone })
    
            if (existPhone) {
                return res.status(400).send({ status: false, msg: "this phone number is already exist" })
            }
            existUser.phone = data.phone
        }
        if (data.country) {
            if (!/^[a-zA-Z ]*$/.test(data.country.trim())) {
                return res.status(400).send({ status: false, msg: "enter valid country name" })
            }
            existUser.country = data.country
        }
        if(data.bio){
            existUser.bio = data.bio
        }
        await existUser.save()
        return res.status(200).send({status : true , msg : "user details updated successfully" , data : existUser})

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = {registerUser , loginUser , updateUser}
const aws = require('aws-sdk');

aws.config.update({
    accessKeyId: "AKIASZMJLVXLMJ3QFJPM",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file , type) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });

        var uploadParams = {
            ACL: "public-read",
            Bucket: "amzderbucket",  //HERE
            Key: `fdevassign/${type}/` + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }

            return resolve(data.Location)
        })

    })
}

const isImageFile = (file)=>{
    return (file.mimetype.slice(0 , 5) == "image")
}
module.exports = {uploadFile , isImageFile}